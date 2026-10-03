/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'calzolaio-domenico',
    /* nessun WhatsApp dichiarato: il telefono */
    whatsapp: { number: '', message: '', ids: [] },
    /* la scheda Google (1/10/2026): martedì 8:30–12:30 e 15–19, mercoledì–venerdì 8:30–19, sabato 8:30–12:30 e 13:30–18; domenica e lunedì chiuso */
    hours: {
      0: [], 1: [],
      2: [['08:30', '12:30'], ['15:00', '19:00']], 3: [['08:30', '19:00']], 4: [['08:30', '19:00']], 5: [['08:30', '19:00']], 6: [['08:30', '12:30'], ['13:30', '18:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1100,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Calzolaio Domenico: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.lavoro": "Our work",
      "n.nuovo": "Before and after",
      "n.recensioni": "Reviews",
      "n.orari": "Hours and directions",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "t.orari": "Hours",
      "h.riga": "Via Negroli · Milan",
      "h.frase": "Shoes and sandals made good as new, in an old-style workshop.",
      "h.sotto": "We’re at Via Negroli&nbsp;14, between Viale Corsica and Forlanini station: everyday shoes, the good leather ones with leather soles, summer sandals.",
      "h.voto": "on Google, 36 reviews",
      "l.titolo": "Our work",
      "l.v1": "The good shoes",
      "l.v1t": "Leather, with leather soles: the ones worth keeping for years. They’re restored with care.",
      "l.v2": "The everyday ones",
      "l.v2t": "The shoes you wear every day and wear out sooner: the simple ones come to the counter too.",
      "l.v3": "Sandals",
      "l.v3t": "In summer it is the sandals’ turn, like the one in the photo further down: the leather footbed, the straps, the low heel.",
      "l.nota": "For anything else, just ask: call 333 524 0527 or come to the counter.",
      "f.titolo2": "Before and&nbsp;after",
      "f.chi": "Patrizia, on Google",
      "f.intro": "Here we drew it on the workbench, seen from below: the worn sole comes off, the new leather goes on, the shoemaker’s knife runs along the edge and the excess leather comes away, then the edge is darkened.",
      "f.titolo": "The new sole: off, cut, finished",
      "f.desc": "A shoe seen from below on the wooden workbench, with a worn leather sole and a hole under the ball of the foot. The old sole comes off and the bottom of the shoe shows; a larger piece of leather arrives; the shoemaker’s knife runs along the edge and the extra leather comes away in one piece; the edge is darkened and a flash of light runs over the new leather. In the second mode it is a sandal with rhinestone straps.",
      "f.d0": "A shoe with a worn leather sole: off with the old sole, the new leather, the knife along the edge, the darkened edge.",
      "f.d1": "A sandal with rhinestone straps: off with the old sole, the new leather, the knife along the edge, the darkened edge.",
      "f.modi": "What to redo",
      "f.b0": "Shoe",
      "f.b1": "Sandal",
      "r.titolo": "People who came&nbsp;by",
      "r.g": "Google",
      "r.foto": "Google, with her photo",
      "a.sandalo": "A sandal held in a hand on the pavement: the natural leather footbed marked Vero cuoio and size 37, the rhinestone straps, the low heel.",
      "r.nota": "From the reviews on Google, as they were written, in Italian; […] where we shortened them.",
      "r.tutte": "All the reviews on Google",
      "o.titolo": "Hours and directions",
      "o.orari": "Hours",
      "o.cap": "Opening hours",
      "o.nota": "Hours from our Google listing (October 2026).",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "w.dove": "Where",
      "w.dovev": "Via Negroli&nbsp;14, 20133 Milan, between Viale Corsica and Forlanini station",
      "w.bus": "Bus",
      "w.busv": "the 45 and the 175, Viale Corsica – Via Negroli stop, about 65 metres away",
      "w.tram": "Tram",
      "w.tramv": "the 12 and the 27, Viale Corsica – Via Negroli stop, about 150 metres away",
      "w.metro": "Metro and rail",
      "w.metrov": "M4 Stazione Forlanini, about 300 metres away; Milano Forlanini railway station about 340 metres away",
      "w.tel": "Phone",
      "w.mappa": "Map: Calzolaio Domenico, Via Negroli 14, Milan",
      "q.titolo": "Questions",
      "q.d1": "When are you open?",
      "q.r1": "Tuesday 8:30–12:30 and 15:00–19:00; Wednesday, Thursday and Friday 8:30–19:00; Saturday 8:30–12:30 and 13:30–18:00. We’re closed on Sundays and Mondays.",
      "q.d2": "Do you also work on shoes with leather soles?",
      "q.r2": "Yes: leather shoes with leather soles, everyday shoes and sandals.",
      "q.d3": "Can I call before coming by?",
      "q.r3": "Yes, on 333 524 0527, the workshop’s number.",
      "q.d4": "How do I get to Via&nbsp;Negroli&nbsp;14?",
      "q.r4": "Buses 45 and 175 stop at Viale Corsica – Via Negroli, about sixty metres away; trams 12 and 27 stop close by. The M4 Stazione Forlanini metro station is about 300 metres away.",
      "f2.dove": "Via Negroli&nbsp;14, 20133 Milan",
      "f2.orario": "Tuesday 8:30–12:30 and 15–19 · Wednesday–Friday 8:30–19 · Saturday 8:30–12:30 and 13:30–18 · closed on Sundays and Mondays",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · <a href=\"privacy.html\">Privacy</a> · hours, rating and reviews from the Google listing (October 2026); the photo is by a customer, from the same listing. The footbed, the drawings and the new sole are our own illustrations.",
      "f2.su": "Back to top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ CALZOLAIO DOMENICO — calzolaio, Via Negroli 14 ══════════
     la FIRMA — «la suola nuova»: la scarpa vista da sotto sul banco; la suola vecchia consumata se ne va, arriva il cuoio nuovo, il
     trincetto gira lungo il bordo, il cuoio in più si stacca, il bordo si annerisce, passa un lampo. Lo stato è M (Scarpa / Sandalo),
     T (0…1) e V (0 al suo posto; fino a 1 la scarpa sale di poco e si spegne; da −1 a 0 arriva la prossima, con la suola vecchia).
     Senza JS e alla fine: Scarpa, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): la suola vecchia, consumata. Reduced-motion:
     tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la
     ferma dov'è. */
  var DATI = {"vb":[640,440],"via":-16,"modi":[{"nome":"Scarpa","punti":[[535.2,208,-2.6],[534.9,213.5,2.9],[534.2,219,8.1],[533.2,224.4,13],[531.9,229.8,18],[530.2,235.1,23.1],[527.9,240.1,28.2],[525,244.8,33.3],[521.6,249.1,38.4],[517.8,253.2,43.3],[513.8,257,47.8],[509.6,260.6,52],[505.2,263.9,55.8],[500.5,266.8,59.7],[495.6,269.5,63.4],[490.6,271.7,66.9],[485.4,273.6,70],[480.1,275.3,72.6],[474.8,276.7,74.9],[469.4,278,76.7],[464,279.1,78.1],[458.5,280.2,79.3],[453.1,281.1,80.4],[447.6,282,81.4],[442.2,282.8,82.5],[436.7,283.5,83.9],[431.2,284.1,85.6],[425.7,284.6,87.6],[420.1,284.8,89.9],[414.6,284.7,92.3],[409.1,284.3,94.7],[403.6,283.7,97.1],[398.2,282.8,99.3],[392.7,281.8,101.2],[387.3,280.6,102.8],[381.9,279.3,104.1],[376.6,277.8,105.3],[371.3,276.2,106.3],[366,274.6,107.1],[360.8,272.9,107.7],[355.5,271.2,108.5],[350.2,269.4,109.3],[345,267.7,110.1],[339.8,265.8,110.9],[334.7,263.7,111.5],[329.6,261.6,111.9],[324.5,259.4,111.8],[319.4,257.2,111.1],[314.3,255.1,109.7],[309.1,253.2,107.8],[303.9,251.5,105.5],[298.5,250.1,102.9],[293.1,249.1,100.3],[287.6,248.3,97.7],[282.1,247.7,95.3],[276.6,247.4,93.1],[271,247.2,91.2],[265.5,247.2,89.4],[260,247.4,87.5],[254.5,247.7,85.5],[249,248.1,83.5],[243.5,248.8,81.7],[238,249.7,80],[232.6,250.9,78.6],[227.2,252.2,77.6],[221.9,253.5,77.3],[216.5,254.9,77.4],[211.1,256.2,77.8],[205.7,257.3,78.4],[200.3,258.3,79],[194.8,259.2,79.7],[189.4,260.2,80.5],[183.9,261.1,81.2],[178.5,262,82.2],[173,262.8,83.7],[167.5,263.5,86],[162,263.9,88.9],[156.5,264.1,92.5],[150.9,263.8,96.7],[145.5,262.9,101.2],[140.1,261.6,105.9],[134.9,259.8,111.1],[129.8,257.6,117.1],[124.9,255,123.7],[120.3,252.1,130.6],[116.2,248.4,137.8],[112.8,243.9,145.5],[110.2,239.1,153.4],[108.2,233.9,161],[106.8,228.6,167.7],[106.1,223.1,173.6],[105.9,217.6,178.9],[106.2,212,184.2],[106.8,206.6,189.6],[107.8,201.1,195.3],[109.2,195.8,201.5],[111.3,190.7,208.5],[114.2,185.9,216.2],[117.7,181.7,224],[121.9,178.1,231.7],[126.6,175.2,238.7],[131.6,172.8,244.8],[136.8,170.9,250.1],[142.1,169.4,254.3],[147.5,168.2,257.7],[153,167.2,260.5],[158.4,166.5,262.9],[163.9,166,264.9],[169.5,165.6,266.6],[175,165.4,268],[180.5,165.4,269.1],[186.1,165.4,269.9],[191.6,165.5,270.5],[197.1,165.6,270.8],[202.6,165.7,270.9],[208.2,165.8,271],[213.7,165.9,271.1],[219.2,166,271.3],[224.8,166,271.4],[230.3,166.2,271.5],[235.8,166.4,271.7],[241.3,166.6,271.8],[246.9,166.8,271.9],[252.4,167,271.7],[257.9,167.2,271.4],[263.5,167.3,270.8],[269,167.4,270.1],[274.5,167.4,269.3],[280,167.3,268.3],[285.6,167.1,267.3],[291.1,166.8,266.3],[296.6,166.4,265.3],[302.1,165.9,264.4],[307.6,165.3,263.6],[313.1,164.6,262.9],[318.6,163.9,262.3],[324.1,163.1,261.8],[329.5,162.3,261.4],[335,161.4,261.1],[340.5,160.5,260.8],[345.9,159.6,260.3],[351.4,158.7,259.7],[356.8,157.8,259.1],[362.2,156.7,258.4],[367.7,155.6,257.7],[373,154.3,257.2],[378.4,153,256.9],[383.8,151.6,257],[389.1,150.3,257.5],[394.5,149,258.6],[399.9,147.9,260],[405.4,146.9,261.6],[410.9,146.2,263.2],[416.4,145.7,264.9],[421.9,145.4,266.6],[427.4,145.2,268.1],[432.9,145,269.5],[438.5,145,270.8],[444,145.2,272.2],[449.5,145.4,273.8],[455,145.8,275.6],[460.5,146.4,277.7],[466,147.1,280.1],[471.5,148.2,282.7],[476.8,149.5,285.5],[482.1,151.1,288.4],[487.3,153,291.4],[492.4,155.2,294.5],[497.4,157.6,297.5],[502.2,160.3,300.7],[506.9,163.2,304.2],[511.5,166.3,307.9],[515.8,169.8,312],[519.8,173.6,316.4],[523.5,177.7,321.3],[526.8,182.1,326.8],[529.6,186.9,332.8],[532.1,191.8,339.1],[533.9,197,345.4],[534.9,202.5,351.5],[535.2,208,357.4]],"riposo0":[474,402,-8],"riposo1":[474,402,352],"vecchia":{"lato":-300,"fase":[0.04,0.12]},"nuova":{"lato":320,"fase":[0.18,0.12]},"avvicina":[0.3,0.04],"taglio":[0.34,0.36],"ritorno":[0.7,0.05],"sfrido":{"dy":96,"fase":[0.72,0.1]},"bordo":[0.83,0.07],"luce":{"da":15.9,"a":625.2,"fase":[0.9,0.1]}},{"nome":"Sandalo","punti":[[500.6,212.5,-1],[500.3,217.2,4.4],[499.7,221.9,9.7],[498.7,226.6,15.2],[497.4,231.1,20.9],[495.6,235.5,26.9],[493.3,239.6,32.8],[490.5,243.4,38.7],[487.2,246.8,44.4],[483.7,249.9,49.6],[479.9,252.8,54.3],[475.9,255.3,58.3],[471.8,257.6,62],[467.5,259.7,65.3],[463.1,261.6,68.4],[458.7,263.1,71.3],[454.1,264.5,73.8],[449.5,265.6,76.1],[444.9,266.6,78.1],[440.3,267.5,79.8],[435.6,268.3,81.3],[430.9,268.9,82.8],[426.2,269.5,84.3],[421.5,269.9,85.8],[416.8,270.2,87.4],[412,270.4,89],[407.3,270.4,90.6],[402.6,270.2,92.2],[397.8,270,93.6],[393.1,269.6,95],[388.4,269.1,96.2],[383.7,268.5,97.4],[379,267.9,98.4],[374.3,267.1,99.4],[369.7,266.3,100.3],[365,265.4,101.2],[360.4,264.4,102.1],[355.8,263.4,102.9],[351.2,262.3,103.7],[346.6,261.2,104.6],[342,260,105.6],[337.4,258.7,106.8],[332.9,257.4,108],[328.4,255.9,109.1],[324,254.2,110.1],[319.6,252.4,110.8],[315.2,250.6,111.1],[310.8,248.8,110.7],[306.4,247.1,109.7],[302,245.4,108],[297.5,243.9,106],[292.9,242.7,103.8],[288.3,241.7,101.4],[283.6,240.9,99],[278.9,240.3,96.7],[274.2,239.9,94.7],[269.5,239.6,93],[264.8,239.4,91.4],[260,239.4,89.9],[255.3,239.5,88.4],[250.6,239.7,86.9],[245.9,239.9,85.3],[241.1,240.3,83.8],[236.4,240.9,82.3],[231.8,241.7,81],[227.1,242.6,79.9],[222.5,243.5,79.1],[217.8,244.5,78.8],[213.2,245.5,78.9],[208.6,246.5,79.2],[203.9,247.3,79.6],[199.3,248.1,80],[194.6,248.9,80.6],[189.9,249.6,81.4],[185.2,250.4,82.5],[180.6,251.1,84.1],[175.9,251.7,86.6],[171.1,252,89.9],[166.4,252.1,94.1],[161.7,251.6,98.8],[157,250.7,104.1],[152.5,249.3,110.3],[148.2,247.5,117.4],[144,245.3,125],[140.1,242.6,132.7],[136.9,239.2,140.7],[134.3,235.2,149.1],[132.3,230.9,157.6],[130.8,226.4,165.4],[130,221.7,172],[129.8,217,177.8],[130.2,212.3,183.6],[130.7,207.6,189.5],[131.5,202.9,195.6],[132.7,198.3,202],[134.5,193.9,209.1],[137,190,216.9],[140.1,186.4,225],[143.8,183.4,232.9],[147.9,181,240],[152.2,179.1,246.2],[156.7,177.5,251.4],[161.3,176.4,255.6],[165.9,175.4,259],[170.6,174.8,261.8],[175.3,174.2,264.2],[180,173.9,266.1],[184.7,173.7,267.6],[189.5,173.6,268.8],[194.2,173.6,269.7],[198.9,173.7,270.4],[203.7,173.8,270.7],[208.4,173.9,270.7],[213.1,173.9,270.6],[217.9,174,270.4],[222.6,174,270.3],[227.3,174,270.2],[232.1,174,270.1],[236.8,174,270],[241.6,174,269.9],[246.3,174,269.8],[251,174,269.5],[255.8,174,269.1],[260.5,173.9,268.6],[265.2,173.8,268],[270,173.6,267.2],[274.7,173.4,266.3],[279.4,173,265.4],[284.1,172.6,264.5],[288.8,172.1,263.6],[293.5,171.5,262.8],[298.2,170.9,262.1],[302.9,170.2,261.5],[307.6,169.4,261.2],[312.2,168.7,260.9],[316.9,167.9,260.9],[321.6,167.1,260.9],[326.3,166.3,260.9],[330.9,165.6,260.9],[335.6,164.9,260.9],[340.3,164.2,260.9],[345,163.4,260.8],[349.6,162.7,260.7],[354.3,161.9,260.7],[359,161.1,260.8],[363.6,160.3,261.1],[368.3,159.6,261.6],[373,158.9,262.3],[377.7,158.2,263.2],[382.4,157.7,264],[387.1,157.2,265],[391.8,156.9,265.9],[396.6,156.6,266.8],[401.3,156.4,267.8],[406,156.2,268.7],[410.7,156.1,269.7],[415.5,156.1,270.8],[420.2,156.2,272.1],[424.9,156.4,273.6],[429.7,156.7,275.4],[434.4,157.2,277.3],[439.1,157.8,279.4],[443.7,158.7,281.6],[448.3,159.7,283.9],[452.9,161,286.3],[457.4,162.4,288.8],[461.9,164,291.4],[466.3,165.8,294.3],[470.6,167.8,297.7],[474.7,170,301.6],[478.8,172.5,305.9],[482.5,175.4,310.5],[486,178.6,315.4],[489.1,182.1,320.4],[491.9,185.9,325.7],[494.4,190,331.1],[496.6,194.2,336.6],[498.4,198.5,342.2],[499.6,203.1,347.8],[500.3,207.8,353.4],[500.6,212.5,359]],"riposo0":[474,402,-8],"riposo1":[474,402,352],"vecchia":{"lato":-300,"fase":[0.04,0.12]},"nuova":{"lato":320,"fase":[0.18,0.12]},"avvicina":[0.3,0.04],"taglio":[0.34,0.36],"ritorno":[0.7,0.05],"sfrido":{"dy":96,"fase":[0.72,0.1]},"bordo":[0.83,0.07],"luce":{"da":39.8,"a":590.6,"fase":[0.9,0.1]}}],"tempi":{"inizio":300,"suola":6600,"servi":420,"arriva":480,"suolaV":5600}};
  /* la suola nuova a (M, T, V) — una sola fonte: la usano _cdm_firma.mjs (l'HTML allo stato finale), main.js (via cdm_main.cjs) e
     la prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     La scarpa vista da sotto sul banco: la suola vecchia consumata se ne va di lato, sotto resta il fondo della scarpa; arriva un
     pezzo di cuoio più grande; il trincetto si avvicina, gira lungo il bordo (il taglio si disegna dietro la lama) e torna a
     posto; il cuoio in più si stacca tutto intero; il bordo si annerisce; un lampo di luce passa sul cuoio nuovo. Col V la scarpa
     sale di poco e si spegne; arriva la prossima, con la suola consumata. */
  function creaSuola(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w[0] + w[1] - 1e-9 ? 1 : c01((t - w[0]) / w[1]); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var q = function (sel) { return svg.querySelector(sel); };
    var servito = q('.servito');
    var uno = function (cl, m) { return q('.' + cl + '[data-m="' + m + '"]'); };
    var pezzi = D.modi.map(function (M, m) {
      return { vecchia: uno('su-vecchia', m), nuova: uno('su-nuova', m), taglio: uno('su-taglio', m), sfrido: uno('su-sfrido', m), bordo: uno('su-bordo', m), luce: uno('su-luce', m), lama: uno('su-trincetto', m) };
    });
    var sposta = function (el, x, y) { el.setAttribute('transform', 'translate(' + r1(x) + ' ' + r1(y) + ')'); };
    /* il trincetto: la punta della lama in (x, y), il manico girato di a gradi (verso l'esterno della suola) */
    var posa = function (el, p) { el.setAttribute('transform', 'translate(' + r1(p[0]) + ' ' + r1(p[1]) + ') rotate(' + r1(p[2]) + ')'); };
    var misto = function (a, b, u) { return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; };
    /* lungo il bordo: i punti sono a passo costante, quindi la frazione del giro è la frazione dell'indice */
    function lungo(M, c) {
      var P = M.punti, n = P.length - 1, x = c * n, i = Math.min(n - 1, Math.floor(x));
      return misto(P[i], P[i + 1], x - i);
    }
    function disegna(m, t, v) {
      var P = pezzi[m], M = D.modi[m];
      /* la suola vecchia esce di lato e si spegne; il pezzo di cuoio nuovo entra dall'altro lato e si accende */
      var u = dolce(fase(t, M.vecchia.fase)), e = dolce(fase(t, M.nuova.fase));
      sposta(P.vecchia, M.vecchia.lato * u, 0);
      P.vecchia.setAttribute('opacity', r3(1 - u));
      sposta(P.nuova, M.nuova.lato * (1 - e), 0);
      P.nuova.setAttribute('opacity', r3(e));
      /* il taglio: la lama gira lungo il bordo e dietro di lei si disegna la riga (pathLength 1000) */
      var a = fase(t, M.avvicina), c = fase(t, M.taglio), r = fase(t, M.ritorno);
      var dc = dolce(c);
      P.taglio.setAttribute('stroke-dashoffset', r1(1000 * (1 - dc)));
      var punto = M.punti[M.punti.length - 1];
      if (r > 0) posa(P.lama, misto(punto, M.riposo1, dolce(r)));
      else if (c > 0) posa(P.lama, lungo(M, dc));
      else posa(P.lama, misto(M.riposo0, M.punti[0], dolce(a)));
      /* il cuoio in più si stacca tutto intero e scende */
      var s = dolce(fase(t, M.sfrido.fase));
      sposta(P.sfrido, 0, M.sfrido.dy * s);
      P.sfrido.setAttribute('opacity', r3(1 - s));
      /* il bordo si annerisce */
      P.bordo.setAttribute('opacity', r3(dolce(fase(t, M.bordo))));
      /* il lampo di luce passa sul cuoio nuovo */
      var l = fase(t, M.luce.fase);
      sposta(P.luce, M.luce.da + (M.luce.a - M.luce.da) * dolce(l), 0);
      P.luce.setAttribute('opacity', r3(4 * l * (1 - l)));
      /* col V la scarpa sale di poco e si spegne; la prossima arriva */
      servito.setAttribute('transform', 'translate(0 ' + r1(D.via * v) + ')');
      servito.setAttribute('opacity', r3(1 - Math.abs(v)));
    }
    var completo = !!servito && pezzi.every(function (P) { return P.vecchia && P.nuova && P.taglio && P.sfrido && P.bordo && P.luce && P.lama; });
    return { disegna: disegna, pezzi: pezzi, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('suola-firma'), svgF = prendi('suolaSvg'), leggiF = prendi('suolaLeggi');
  var SUOLA = svgF ? creaSuola(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.suola__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.suola__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    SUOLA.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) SUOLA.disegna(k, 1, 0); });
    SUOLA.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta la suola vecchia, consumata */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la suola vecchia, consumata */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.suola, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.suola });
  }
  /* il gesto: scegliere che cosa guardare. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     la scena scende e si spegne, arriva dall'alto la prossima, vuota, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.suolaV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && SUOLA && SUOLA.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaSuola); } catch (e) {}
    window.__suola = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__suola.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta la suola vecchia, consumata */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__suola.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }

  /* la mappa al clic: il titolo dell'iframe nella lingua corrente (w.mappa) */
  var cartina = document.querySelector('.cartina');
  if (cartina && 'MutationObserver' in window) {
    new MutationObserver(function () {
      cartina.querySelectorAll('iframe[data-i18n-title]').forEach(function (f) {
        var k = f.getAttribute('data-i18n-title');
        var st = originals['data-i18n-title'] || (originals['data-i18n-title'] = {});
        if (!(k in st)) st[k] = f.getAttribute('title');
        var d = SITE.LANGS[root.lang], v = d && d[k] !== undefined ? d[k] : st[k];
        if (f.getAttribute('title') !== v) f.setAttribute('title', v);
      });
    }).observe(cartina, { childList: true, subtree: true });
  }
})();
