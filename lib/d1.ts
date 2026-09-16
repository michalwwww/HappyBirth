// Klient Cloudflare D1 (obsługuje środowisko Cloudflare Pages/Workers, lokalny SQLite z Wranglera oraz zdalny REST API)
import fs from 'fs';
import path from 'path';

interface D1QueryResult<T = any> {
  results: T[];
  success: boolean;
  meta?: any;
}

let localSqliteDb: any = null;

function getLocalDatabase() {
  if (localSqliteDb) return localSqliteDb;
  try {
    const { DatabaseSync } = require('node:sqlite');
    const dir = path.join(process.cwd(), '.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const dbFile = files.find((f: string) => f.endsWith('.sqlite') && !f.startsWith('metadata'));
      if (dbFile) {
        localSqliteDb = new DatabaseSync(path.join(dir, dbFile));
        return localSqliteDb;
      }
    }
  } catch (e) {
    console.error('Błąd inicjalizacji node:sqlite dla bazy lokalnej:', e);
  }
  return null;
}

export async function executeD1Query<T = any>(
  sql: string,
  params: any[] = []
): Promise<D1QueryResult<T>> {
  // 1. Sprawdź, czy jesteśmy w środowisku Cloudflare z natywnym bindingiem env.DB
  // @ts-ignore
  if (typeof globalThis !== 'undefined' && globalThis.DB) {
    // @ts-ignore
    const stmt = globalThis.DB.prepare(sql).bind(...params);
    const result = await stmt.all();
    return {
      results: result.results || [],
      success: result.success !== false,
      meta: result.meta,
    };
  }

  // 2. W lokalnym środowisku deweloperskim (Next.js Node dev server) użyj bezpośrednio lokalnej bazy D1 z Wranglera
  const localDb = getLocalDatabase();
  if (localDb) {
    try {
      const trimmed = sql.trim().toUpperCase();
      const isSelect = trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA');
      const stmt = localDb.prepare(sql);
      if (isSelect) {
        const rows = stmt.all(...params) as T[];
        return {
          results: rows || [],
          success: true,
        };
      } else {
        const info = stmt.run(...params);
        return {
          results: [],
          success: true,
          meta: info,
        };
      }
    } catch (localErr: any) {
      console.error('Błąd wykonania zapytania na lokalnej bazie D1:', localErr);
      return { results: [], success: false, meta: localErr?.message };
    }
  }

  // 3. Jeśli podany jest zdalny token, użyj Cloudflare D1 REST API
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_D1_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;

  if (accountId && apiToken && databaseId) {
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sql, params }),
        }
      );

      const data = await res.json();
      if (data.success && data.result && data.result[0]) {
        return {
          results: data.result[0].results || [],
          success: true,
          meta: data.result[0].meta,
        };
      } else {
        console.error('Błąd zapytania Cloudflare D1 API:', data.errors);
        return { results: [], success: false, meta: data.errors };
      }
    } catch (err) {
      console.error('Błąd połączenia z Cloudflare D1 REST API:', err);
      return { results: [], success: false };
    }
  }

  return { results: [], success: true };
}

export async function d1First<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const result = await executeD1Query<T>(sql, params);
  return result.results && result.results.length > 0 ? result.results[0] : null;
}

export async function d1All<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const result = await executeD1Query<T>(sql, params);
  return result.results || [];
}

export async function d1Run(sql: string, params: any[] = []): Promise<boolean> {
  const result = await executeD1Query(sql, params);
  return result.success;
}
