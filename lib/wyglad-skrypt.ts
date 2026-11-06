// Bez 'use client': stała trafia do <head> w app/layout.tsx (komponent serwerowy).
// Skrypt do <head>: ten sam odczyt co czytajPalete i czytajTryb w lib/wyglad.ts (najpierw ciasteczko
// wspólne dla subdomen, potem localStorage), wykonany przed pierwszym malowaniem strony.
export const SKRYPT_WYGLADU = `(function(){try{
var d=document.documentElement,c=document.cookie,m=function(k){var r=c.match(new RegExp('(?:^|; )'+k+'=([^;]*)'));return r?decodeURIComponent(r[1]):null};
var t=m('hb_theme')||localStorage.getItem('hb_theme');if(t==='dark'){d.classList.add('dark')}else{d.classList.remove('dark')}
var p=m('hb_paleta')||localStorage.getItem('hb_paleta');if(p&&/^(cieply|naturalny|sloneczny|kolorowy)$/.test(p)){d.setAttribute('data-paleta',p)}
var l=localStorage.getItem('hb_lang');if(l&&(l==='pl'||l==='en'||l==='ru')){d.lang=l}
}catch(e){}})()`;
