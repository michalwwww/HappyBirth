/* HappyBirth · strona v1. Bez zależności, bez pikseli, bez cookies. */
(function () {
  'use strict';
  var d = document;

  /* 1. Lekcja bezpłatna: odtwarzacz Cloudflare Stream ładuje się dopiero po kliknięciu */
  d.querySelectorAll('[data-wideo]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('.wideo');
      var f = d.createElement('iframe');
      f.src = btn.getAttribute('data-wideo');
      f.title = btn.getAttribute('data-tytul') || 'Lekcja wideo';
      f.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.loading = 'eager';
      box.appendChild(f);
      btn.remove();
      var img = box.querySelector('img');
      if (img) img.remove();
      var plakat = box.querySelector('.plakat');
      if (plakat) plakat.remove();
    });
  });

  /* 2. Zapis na listę: źródło wejścia z UTM (bez danych o zdrowiu) i komunikat o błędzie */
  var form = d.querySelector('form[data-lista]');
  if (form) {
    var q = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) {
      var el = form.querySelector('input[name="' + k + '"]');
      var v = q.get(k);
      if (el && v) el.value = v.slice(0, 80);
    });
    var blad = q.get('blad');
    var box = form.querySelector('.komunikat');
    var teksty = {
      email: 'Brakuje poprawnego adresu e-mail. Wpiszcie go, a damy znać o starcie.',
      zgoda: 'Zaznaczcie zgodę na wiadomość o starcie sprzedaży. Bez niej nie możemy napisać.',
      serwer: 'Zapis chwilowo nie działa. Spróbujcie za kilka minut.'
    };
    if (blad && box && teksty[blad]) {
      box.textContent = teksty[blad];
      box.hidden = false;
      var zapis = d.getElementById('zapis');
      if (zapis) zapis.scrollIntoView();
    }
    form.addEventListener('submit', function (e) {
      var email = form.querySelector('input[type=email]');
      var zgoda = form.querySelector('input[name=zgoda]');
      if (email && !email.checkValidity()) { e.preventDefault(); box.textContent = teksty.email; box.hidden = false; email.focus(); return; }
      if (zgoda && !zgoda.checked) { e.preventDefault(); box.textContent = teksty.zgoda; box.hidden = false; zgoda.focus(); }
    });
  }
})();

/* ═══════════════════════════════════════════════════════════════════════════
   3. Suwak etapów. Komponent z folderu komponenty/suwak-etapow, tu w wersji
   dla strony: bez atrybutów style (CSP), z płynnym ciągnięciem i z podpisem
   liczonym z jednostki etapu (tydzień ciąży albo miesiąc z dzieckiem).
   Konfiguracja: <script type="application/json" id="konfig-suwak"> z build.py.
   ═══════════════════════════════════════════════════════════════════════════ */
window.SuwakEtapow = (function () {
  'use strict';

  function pozycje(kon) {
    var odstep = kon.wstega.odstep, kreska = kon.wstega.kreska, pasma = kon.pasma;
    var suma = 0, kresek = 0, i;
    for (i = 0; i < pasma.length; i++) { if (pasma[i].kreska) kresek++; else suma += pasma[i].waga; }
    var skala = (1000 - kreska * kresek - odstep * (pasma.length - 1)) / (suma || 1);
    var x = 0, poz = {};
    for (i = 0; i < pasma.length; i++) {
      var w = pasma[i].kreska ? kreska : pasma[i].waga * skala;
      poz[pasma[i].id] = [x, w];
      x += w + odstep;
    }
    return poz;
  }

  /* Suwak liczy w jednostkach wstęgi (0 do 1000), nie w dniach. Dzięki temu kropka
     suwaka i znacznik na wstędze stoją w tym samym miejscu: wcześniej suwak szedł
     liniowo po dniach, a wstęga ma odstępy między pasmami i kreskę dnia zero, więc
     oba rozjeżdżały się nawet o kilka procent szerokości (tura 3, Kalendarz). */
  function mapa(kon, poz) {
    var m = [];
    kon.etapy.forEach(function (e) {
      var g = poz[e.pasmo];
      if (g && e.zakres) m.push({ x: g[0], w: g[1], od: e.zakres[0], az: e.zakres[1] });
    });
    return m;
  }

  function dzienDla(m, x) {
    for (var i = 0; i < m.length; i++) {
      if (x <= m[i].x + m[i].w || i === m.length - 1) {
        var f = Math.min(1, Math.max(0, (x - m[i].x) / Math.max(1, m[i].w)));
        return Math.round(m[i].od + f * (m[i].az - m[i].od));
      }
    }
    return m[0].od;
  }

  function pozycjaDla(m, v) {
    for (var i = 0; i < m.length; i++) {
      if (v <= m[i].az || i === m.length - 1) {
        var f = Math.min(1, Math.max(0, (v - m[i].od) / Math.max(1, m[i].az - m[i].od)));
        return m[i].x + f * m[i].w;
      }
    }
    return 0;
  }

  function etapDla(kon, v) {
    for (var i = 0; i < kon.etapy.length; i++) if (v <= kon.etapy[i].do) return i;
    return kon.etapy.length - 1;
  }

  function podpisDla(e, v) {
    var wzor = e.podpis || '{n}';
    var n = v;
    if (e.jednostka === 'tydzien') n = Math.max(1, Math.ceil(v / 7));
    if (e.jednostka === 'miesiac') n = Math.max(1, Math.ceil((v - (e.baza || 0)) / 30.44));
    return wzor.replace('{n}', n).replace('{v}', v);
  }

  function el(tag, klasa, rodzic) {
    var e = document.createElement(tag);
    if (klasa) e.className = klasa;
    if (rodzic) rodzic.appendChild(e);
    return e;
  }

  function utworz(host, kon) {
    if (!host || !kon || !kon.etapy.length) return null;
    var poz = pozycje(kon);
    var m = mapa(kon, poz);
    var koniec = m.length ? m[m.length - 1].x + m[m.length - 1].w : 1000;
    var tydzienJedn = koniec / Math.max(1, kon.dniRazem || 645) * 7;   // tydzień w jednostkach wstęgi
    var id = 'se-suwak-' + Math.random().toString(36).slice(2, 8);

    host.classList.add('se');
    /* Cała konstrukcja powstaje w odłączonym fragmencie: jedno dołożenie do strony, jeden układ. */
    var frag = document.createDocumentFragment();
    var gora = el('div', 'se-gora', frag);
    var nr = el('div', 'se-nr', gora);
    nr.setAttribute('aria-hidden', 'true');
    var kol = el('div', '', gora);
    var meta = el('div', 'se-meta', kol);
    var nazwaBox = el('div', 'se-nazwa', kol);
    var kropka = el('span', 'se-kropka', nazwaBox);
    kropka.setAttribute('aria-hidden', 'true');
    var nazwa = el('span', 'se-nazwa-tekst', nazwaBox);
    var rekBox = el('div', 'se-rekomendacja-box', kol);

    var etykieta = el('label', 'se-etykieta', frag);
    etykieta.setAttribute('for', id);
    etykieta.textContent = kon.teksty.etykieta || '';

    var suwak = el('input', 'se-suwak', frag);
    suwak.id = id;
    suwak.type = 'range';
    suwak.min = 0; suwak.max = Math.round(koniec); suwak.step = 1;
    suwak.value = Math.round(pozycjaDla(m, kon.start));

    var wstega = el('div', 'se-wstega', frag);
    wstega.setAttribute('role', 'img');
    wstega.setAttribute('aria-label', kon.opisWstegi || '');
    var segmenty = {};
    kon.pasma.forEach(function (p) {
      var g = poz[p.id], s = el('span', 'se-pasmo' + (p.kreska ? ' se-kreska' : ''), wstega);
      s.style.left = (g[0] / 10).toFixed(3) + '%';
      s.style.width = (g[1] / 10).toFixed(3) + '%';
      s.style.setProperty('--se-p', p.kolor);
      if (p.kolorCzysty) s.style.setProperty('--se-c', p.kolorCzysty);
      if (p.tytul) s.title = p.tytul;
      if (!p.kreska) segmenty[p.id] = s;
    });
    var znacznik = el('span', 'se-znacznik', wstega);
    znacznik.setAttribute('aria-hidden', 'true');

    if (kon.skala && kon.skala.length) {
      var skala = el('div', 'se-skala', frag);
      skala.setAttribute('aria-hidden', 'true');
      kon.skala.forEach(function (s) { el('span', '', skala).textContent = s; });
    }
    var opis = el('ul', 'se-moduly', frag);
    if (kon.teksty.stopka) el('p', 'se-stopka', frag).textContent = kon.teksty.stopka;

    function rysuj() {
      var x = Number(suwak.value);
      var v = dzienDla(m, x);
      var i = etapDla(kon, v), e = kon.etapy[i];
      var pasmo = kon.pasma.filter(function (p) { return p.id === e.pasmo; })[0] || {};
      var podpis = podpisDla(e, v);

      host.style.setProperty('--se-kolor', pasmo.kolorCzysty || pasmo.kolor || 'currentColor');
      nr.textContent = podpis.replace(/[^0-9]/g, '');
      meta.textContent = (kon.teksty.meta || '')
        .replace('{podpis}', podpis).replace('{nr}', String(i + 1));
      nazwa.textContent = e.nazwa || '';
      opis.textContent = '';
      (e.moduly || []).forEach(function (m) {
        var li = el('li', '', opis);
        el('b', '', li).textContent = m.tytul;
        el('span', '', li).textContent = m.meta;
      });

      /* Dynamiczna sugestia filmu w zależności od konkretnego tygodnia ciąży i wybranego języka */
      var lang = document.documentElement.lang || 'pl';
      var rekTekst = '';
      if (v <= 280) {
        var tydz = Math.max(1, Math.ceil(v / 7));
        if (tydz <= 13) {
          if (lang === 'en') {
            rekTekst = 'Lesson 1: "Beginning of a New Life and First Weeks" & Lesson 2: "First Trimester Tests Schedule"';
          } else if (lang === 'ru') {
            rekTekst = 'Урок 1: «Начало новой жизни и первые недели» и Урок 2: «Календарь анализов в I триместре»';
          } else {
            rekTekst = 'Lekcja 1: „Początek nowego życia i pierwsze tygodnie” oraz Lekcja 2: „Kalendarz badań w I trymestrze”';
          }
        } else if (tydz <= 20) {
          if (lang === 'en') {
            rekTekst = 'Lesson 6: "When and How to Start Preparing" & Lesson 13: "Comfort, Sleep and Relieving Postures"';
          } else if (lang === 'ru') {
            rekTekst = 'Урок 6: «Когда и как начинать подготовку» и Урок 13: «Комфорт, сон и разгрузка тела»';
          } else {
            rekTekst = 'Lekcja 6: „Kiedy i jak rozpocząć przygotowania” oraz Lekcja 13: „Komfort, sen i pozycje odciążające ciało”';
          }
        } else if (tydz <= 27) {
          if (lang === 'en') {
            rekTekst = 'Lesson 14: "Physical Activity with a Physical Therapist" & Lesson 16: "Healthy Diet and Wellness"';
          } else if (lang === 'ru') {
            rekTekst = 'Урок 14: «Физическая активность и упражнения с физиотерапевтом» и Урок 16: «Питание и профилактика»';
          } else {
            rekTekst = 'Lekcja 14: „Aktywność fizyczna i ćwiczenia z fizjoterapeutką” oraz Lekcja 16: „Zdrowa dieta i profilaktyka”';
          }
        } else if (tydz <= 34) {
          if (lang === 'en') {
            rekTekst = 'Lesson 19: "Layette Without Chaos – What to Actually Buy" & Lesson 20: "Safe Stroller and Car Seat"';
          } else if (lang === 'ru') {
            rekTekst = 'Урок 19: «Приданое без хаоса – что действительно нужно» и Урок 20: «Безопасная коляска и автокресло»';
          } else {
            rekTekst = 'Lekcja 19: „Wyprawka bez chaosu – co naprawdę kupić” oraz Lekcja 20: „Bezpieczny fotelik i wózek”';
          }
        } else {
          if (lang === 'en') {
            rekTekst = 'Lesson 26: "Hour Zero: Labor Signs, Contractions and Hospital Bag" & Lesson 28: "Breathing and Upright Postures"';
          } else if (lang === 'ru') {
            rekTekst = 'Урок 26: «Час Ноль: предвестники родов, схватки и сумка» и Урок 28: «Дыхание и вертикальные позы»';
          } else {
            rekTekst = 'Lekcja 26: „Godzina Zero: zwiastuny porodu, skurcze i torba” oraz Lekcja 28: „Oddech i pozycje wertykalne”';
          }
        }
      } else {
        var mies = Math.max(1, Math.ceil((v - 280) / 30.44));
        if (mies <= 3) {
          if (lang === 'en') {
            rekTekst = 'Lesson 35: "First 48 Hours, Safe Bathing and Newborn Care" & Lesson 44: "Postpartum Recovery"';
          } else if (lang === 'ru') {
            rekTekst = 'Урок 35: «Первые 48 часов, безопасное купание и уход» и Урок 44: «Послеродовое восстановление»';
          } else {
            rekTekst = 'Lekcja 35: „Pierwsze 48 godzin, bezpieczna kąpiel i pielęgnacja noworodka” oraz Lekcja 44: „Połóg i regeneracja”';
          }
        } else {
          if (lang === 'en') {
            rekTekst = 'Lesson 48: "Comfortable Breastfeeding" & Lesson 50: "Safe Sleep and Development in the 1st Year"';
          } else if (lang === 'ru') {
            rekTekst = 'Урок 48: «Грудное вскармливание без боли» и Урок 50: «Безопасный сон и развитие в 1-й год»';
          } else {
            rekTekst = 'Lekcja 48: „Karmienie i laktacja bez bólu” oraz Lekcja 50: „Bezpieczny sen i rozwój w 1. roku życia”';
          }
        }
      }
      var labelText = lang === 'en' ? 'In your current week, start with:' : lang === 'ru' ? 'На вашем текущем сроке начните с урока:' : 'W Twoim obecnym tygodniu zacznij od filmu:';
      rekBox.innerHTML = '<span class="se-rek-label">' + labelText + '</span><span class="se-rek-film">' + rekTekst + '</span>';

      znacznik.style.left = (x / 10).toFixed(3) + '%';
      suwak.setAttribute('aria-valuetext', podpis + (e.nazwa ? ', ' + e.nazwa : ''));
      Object.keys(segmenty).forEach(function (k) {
        segmenty[k].classList.toggle('se-akt', k === e.pasmo);
      });

      if (kon.synchronizuj) {
        document.querySelectorAll(kon.synchronizuj).forEach(function (c) {
          c.classList.toggle('akt', c.getAttribute('data-etap') === String(i + 1));
        });
      }
    }

    /* Płynne ciągnięcie: w czasie przeciągania znacznik idzie bez animacji, za palcem.
       Po puszczeniu i przy klawiaturze wraca miękkie dojście. */
    suwak.addEventListener('input', rysuj);
    /* Krok wstęgi to ułamek dnia, więc strzałka przestawiałaby o pół dnia.
       Przejmujemy klawisze i chodzimy tygodniami, bo tak czyta się ta mapa. */
    suwak.addEventListener('keydown', function (e2) {
      var kroki = { ArrowLeft: -1, ArrowRight: 1, ArrowDown: -1, ArrowUp: 1, PageDown: -4, PageUp: 4 };
      if (e2.key in kroki) {
        e2.preventDefault();
        suwak.value = Math.min(Number(suwak.max), Math.max(0, Number(suwak.value) + kroki[e2.key] * tydzienJedn));
        rysuj();
      } else if (e2.key === 'Home' || e2.key === 'End') {
        e2.preventDefault();
        suwak.value = e2.key === 'Home' ? 0 : suwak.max;
        rysuj();
      }
    });
    suwak.addEventListener('pointerdown', function () { host.setAttribute('data-ciagnie', ''); });
    ['pointerup', 'pointercancel', 'blur'].forEach(function (z) {
      suwak.addEventListener(z, function () { host.removeAttribute('data-ciagnie'); });
    });
    rysuj();
    host.textContent = '';
    host.appendChild(frag);
    return { host: host, ustaw: function (v) { suwak.value = v; rysuj(); }, wartosc: function () { return Number(suwak.value); } };
  }

  /* Suwak jest pod pierwszym ekranem, więc budujemy go, gdy przeglądarka ma wolną chwilę.
     Do tego czasu w jego miejscu stoi tekst zapasowy, ten sam co przy wyłączonym skrypcie. */
  var zrodlo = document.getElementById('konfig-suwak');
  var miejsce = document.getElementById('suwak');
  if (zrodlo && miejsce) {
    var start = function () {
      try { utworz(miejsce, JSON.parse(zrodlo.textContent)); }
      catch (e) { /* zostaje tekst zapasowy */ }
    };
    if (window.requestIdleCallback) requestIdleCallback(start, { timeout: 1200 });
    else setTimeout(start, 200);

    /* Dynamiczne odświeżenie suwaka przy zmianie języka strony */
    window.addEventListener('hb_lang_updated', function () {
      setTimeout(function () {
        var freshZrodlo = document.getElementById('konfig-suwak');
        if (freshZrodlo && miejsce) {
          try { utworz(miejsce, JSON.parse(freshZrodlo.textContent)); }
          catch (e) {}
        }
      }, 50);
    });
  }
  return { utworz: utworz };
})();

/* ═══════════════════════════════════════════════════════════════════════════
   4. Karuzela w hero. Cztery kadry 3 na 2, jeden widoczny (poprawki tura 2,
   sekcja 3a). Zmiana co 5,5 s, zatrzymanie po najechaniu i po wyjściu kadru
   z ekranu. Na dotyku bez automatu, za to z przesuwaniem palcem. Kropki
   powstają w skrypcie, bo bez skryptu nie miałyby czego przełączać.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
function karuzela() {
  'use strict';
  var host = document.querySelector('[data-karuzela]');
  if (!host) return;
  var slajdy = [].slice.call(host.querySelectorAll('.kar-slajd'));
  if (slajdy.length < 2) return;

  var ODSTEP = 5500;
  var dotyk = window.matchMedia('(pointer: coarse)').matches;
  var spokoj = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var i = 0, zegar = null, widoczna = true, wstrzym = false;

  /* Kadry 2 do 4 mają adres w data-src, żeby nie konkurowały z kadrem pierwszym
     o pasmo przy pierwszym malowaniu. Wstawiamy je tu, zanim ruszy automat. */
  host.querySelectorAll('img[data-src]').forEach(function (img) {
    if (img.getAttribute('data-srcset')) img.srcset = img.getAttribute('data-srcset');
    img.src = img.getAttribute('data-src');
    img.removeAttribute('data-src');
    img.removeAttribute('data-srcset');
  });

  var kropki = document.createElement('div');
  kropki.className = 'kar-kropki';
  var przyciski = slajdy.map(function (s, n) {
    s.hidden = false;
    s.setAttribute('aria-hidden', n ? 'true' : 'false');
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'kar-kropka';
    b.setAttribute('aria-label', 'Kadr ' + (n + 1) + ' z ' + slajdy.length);
    b.setAttribute('aria-current', n ? 'false' : 'true');
    b.addEventListener('click', function () { pokaz(n); odlicz(); });
    kropki.appendChild(b);
    return b;
  });
  host.appendChild(kropki);

  function pokaz(n) {
    i = (n + slajdy.length) % slajdy.length;
    slajdy.forEach(function (s, k) {
      s.classList.toggle('akt', k === i);
      s.setAttribute('aria-hidden', k === i ? 'false' : 'true');
    });
    przyciski.forEach(function (b, k) { b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
  }

  function odlicz() {
    if (zegar) clearInterval(zegar);
    if (dotyk || spokoj) return;
    zegar = setInterval(function () {
      if (widoczna && !wstrzym && !document.hidden) pokaz(i + 1);
    }, ODSTEP);
  }

  host.addEventListener('mouseenter', function () { wstrzym = true; });
  host.addEventListener('mouseleave', function () { wstrzym = false; });
  host.addEventListener('focusin', function () { wstrzym = true; });
  host.addEventListener('focusout', function () { wstrzym = false; });

  /* Przesuwanie palcem. Próg 40 px, żeby zwykłe przewijanie strony nie zmieniało kadru.
     Bez natywnego przeciągania obrazka: na komputerze przeciąganie myszą też zmienia kadr,
     zamiast przerywać gest zdarzeniem pointercancel. */
  host.addEventListener('dragstart', function (e) { e.preventDefault(); });
  var x0 = null, y0 = null;
  host.addEventListener('pointerdown', function (e) { x0 = e.clientX; y0 = e.clientY; });
  host.addEventListener('pointerup', function (e) {
    if (x0 === null) return;
    var dx = e.clientX - x0, dy = e.clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { pokaz(i + (dx < 0 ? 1 : -1)); odlicz(); }
  });
  host.addEventListener('pointercancel', function () { x0 = null; });

  if (window.IntersectionObserver) {
    new IntersectionObserver(function (wpisy) {
      widoczna = wpisy[0].isIntersecting;
    }, { threshold: 0.2 }).observe(host);
  }
  odlicz();
}

/* Karuzela rusza dopiero, gdy przeglądarka ma wolną chwilę: pierwsze malowanie
   pobiera jeden kadr i nie konkuruje z nim ani o pasmo, ani o wątek główny. */
if (window.requestIdleCallback) requestIdleCallback(karuzela, { timeout: 2500 });
else setTimeout(karuzela, 400);
})();

/* ═══════════════════════════════════════════════════════════════════════════
   5. Liczniki na stronie O nas. Liczba dolicza się w górę, gdy kafelek wjeżdża
   na ekran (poprawki tura 3, O nas). Wartość docelowa siedzi w data-licz,
   dopisek po liczbie w data-po. W HTML stoi od razu gotowa liczba, więc bez
   skryptu i przy ustawieniu „ogranicz ruch” widać wynik, nie zero.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var pola = [].slice.call(document.querySelectorAll('[data-licz]'));
  if (!pola.length || !window.IntersectionObserver) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var CZAS = 1300;

  function zapis(n) {
    /* Spacja nierozdzielająca w tysiącach, tak jak w pozostałych liczbach na stronie. */
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function licz(el) {
    var cel = Number(el.getAttribute('data-licz')) || 0;
    var po = el.getAttribute('data-po') || '';
    var start = null;
    el.textContent = zapis(0) + po;
    function krok(t) {
      if (start === null) start = t;
      var f = Math.min(1, (t - start) / CZAS);
      var e = 1 - Math.pow(1 - f, 3);            /* miękkie dojście do wartości */
      el.textContent = zapis(Math.round(cel * e)) + po;
      if (f < 1) requestAnimationFrame(krok);
    }
    requestAnimationFrame(krok);
  }

  var oko = new IntersectionObserver(function (wpisy) {
    wpisy.forEach(function (w) {
      if (!w.isIntersecting) return;
      oko.unobserve(w.target);
      licz(w.target);
    });
  }, { threshold: 0.4 });
  pola.forEach(function (el) { oko.observe(el); });
})();
