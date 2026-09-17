'use client';

import { useEffect, useState } from 'react';

export const PROD_STREFA_URL = 'https://strefa.happybirth.pl';
export const PROD_PARTNERZY_URL = 'https://partnerzy.happybirth.pl';

export interface SiteUrls {
  strefa: string;
  partnerzy: string;
  /** Buduje adres wewnątrz Strefy, np. strefaPath('/lekcje') */
  strefaPath: (path: string) => string;
}

function build(isDev: boolean): SiteUrls {
  const strefa = isDev ? '/strefa' : PROD_STREFA_URL;
  const partnerzy = isDev ? '/partnerzy' : PROD_PARTNERZY_URL;
  return {
    strefa,
    partnerzy,
    strefaPath: (path: string) => `${strefa}${path.startsWith('/') ? path : `/${path}`}`,
  };
}

/**
 * Adresy Strefy i programu partnerskiego. Na produkcji subdomeny,
 * lokalnie ścieżki. Rozstrzygane po zamontowaniu, żeby uniknąć różnic
 * między renderem serwerowym a klientem.
 */
export function useSiteUrls(): SiteUrls {
  const [urls, setUrls] = useState<SiteUrls>(() => build(false));

  useEffect(() => {
    const host = window.location.hostname;
    const isDev = host.includes('localhost') || host.includes('127.0.0.1');
    if (isDev) setUrls(build(true));
  }, []);

  return urls;
}
