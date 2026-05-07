(() => {
  const WELCOMES = {
    ja: "象徴界の大草原へようこそ！",
    zh: "欢迎来到象征界的大草原！",
    en: "Welcome to the Steppe of the Symbolic!",
    de: "Willkommen in der Steppe des Symbolischen!"
  };
  const SOC_LABELS = {
    blog:     { ja: "ブログ",   zh: "博客",        en: "Blog",     de: "Blog" },
    bilibili: { ja: "ビリビリ", zh: "哔哩哔哩", en: "Bilibili", de: "Bilibili" },
    zhihu:    { ja: "知乎",     zh: "知乎",         en: "Zhihu",    de: "Zhihu" },
    youtube:  { ja: "YouTube", zh: "YouTube",     en: "YouTube",  de: "YouTube" },
    github:   { ja: "GitHub",  zh: "GitHub",      en: "GitHub",   de: "GitHub" }
  };
  const SOC_KEY = { ja: "追う", zh: "关注", en: "FOLLOW", de: "FOLGEN" };
  const ASK_KEY = { ja: "連絡", zh: "联系", en: "CONTACT", de: "KONTAKT" };
  const MAIL = { plain: "info@un-canon.com", masked: "info(at)un-canon.com" };
  const TICKER = { ja: "構築中", zh: "敬请期待", en: "Under Construction", de: "Im Aufbau" };
  const PRELAUNCH = { ja: "公開予定", zh: "即将上线", en: "Pre-launch", de: "Vorveröffentlichung" };
  const ISSUEDATE = { ja: "2026年秋冬", zh: "2026年秋冬", en: "2026.Q4", de: "Ende 2026" };
  const THEME_LBL = { ja: "主題", zh: "主题", en: "Theme", de: "Thema" };
  const LANG_LBL = { ja: "言語", zh: "语言", en: "Lang", de: "Sprache" };
  const FOOT_BRAND = { ja: "西洋負典", zh: "西方負典", en: "UN-CANON", de: "UN-CANON" };
  const FOOT_RIGHTS = {
    ja: "権利<b>留保なし</b>",
    zh: "翻印<b>不究</b>",
    en: "All Rights <b>Un-Reserved</b>",
    de: "Alle Rechte <b>Nicht Vorbehalten</b>"
  };
  const ORDER = ["en","zh","ja","de"];
  const LANG_ATTR = { ja: "ja", zh: "zh-Hans", en: "en", de: "de" };

  const welcomeEl = document.getElementById("welcome");
  const btns = [...document.querySelectorAll(".wu-lang-btn")];
  let current = localStorage.getItem("wu.lang") || "en";
  let autoIdx = ORDER.indexOf(current);
  let autoTimer = null;
  let userTouched = false;

  function setLang(l, fromAuto = false){
    current = l;
    autoIdx = ORDER.indexOf(l);
    btns.forEach(b => b.classList.toggle("is-active", b.dataset.lang === l));

    // Fade everything out together, swap text while invisible, fade in.
    const html = document.documentElement;
    html.classList.add("is-l10n-swapping");
    setTimeout(() => {
      html.setAttribute("data-locale", l);
      welcomeEl.textContent = WELCOMES[l];
      welcomeEl.className = "wu-welcome lang-" + l;
      welcomeEl.setAttribute("lang", LANG_ATTR[l]);
      applyL10nText(l);
      // Next tick: remove the swap class so CSS transitions fade back in.
      // Using setTimeout instead of rAF — rAF is throttled in iframes
      // that aren't the active tab.
      setTimeout(() => html.classList.remove("is-l10n-swapping"), 20);
    }, 180);
    if (!fromAuto) {
      userTouched = true;
      stopAuto();
      localStorage.setItem("wu.lang", l);
    }
    return;
  }

  // All non-welcome localised text; called during the swap phase.
  function applyL10nText(l){
    const socLinks = document.querySelectorAll("#soc-links a[data-soc]");
    socLinks.forEach(a => {
      const key = a.dataset.soc;
      a.textContent = SOC_LABELS[key][l];
      if (key === "zhihu" || (key === "bilibili" && l !== "en")) {
        a.setAttribute("lang", LANG_ATTR[l]);
      } else {
        a.removeAttribute("lang");
      }
    });
    const k1 = document.getElementById("soc-k1");
    const k2 = document.getElementById("soc-k2");
    if (k1) { k1.textContent = SOC_KEY[l]; k1.setAttribute("lang", LANG_ATTR[l]); }
    if (k2) { k2.textContent = ASK_KEY[l]; k2.setAttribute("lang", LANG_ATTR[l]); }
    const mail = document.getElementById("soc-mail");
    if (mail) {
      mail.textContent = l === "ja" ? MAIL.masked : MAIL.plain;
      mail.setAttribute("href", "mailto:" + MAIL.plain);
    }
    const ticker = document.getElementById("wu-ticker-text");
    if (ticker) {
      ticker.textContent = TICKER[l];
      ticker.setAttribute("lang", LANG_ATTR[l]);
    }
    const pre = document.getElementById("wu-prelaunch");
    if (pre) {
      pre.textContent = PRELAUNCH[l];
      pre.setAttribute("lang", LANG_ATTR[l]);
    }
    const isd = document.getElementById("wu-issuedate");
    if (isd) {
      isd.textContent = ISSUEDATE[l];
      if (l === "en") isd.removeAttribute("lang");
      else isd.setAttribute("lang", LANG_ATTR[l]);
    }
    const thLbl = document.getElementById("wu-theme-lbl");
    if (thLbl) {
      thLbl.textContent = THEME_LBL[l];
      thLbl.setAttribute("lang", LANG_ATTR[l]);
    }
    const lgLbl = document.getElementById("wu-lang-lbl");
    if (lgLbl) {
      lgLbl.textContent = LANG_LBL[l];
      lgLbl.setAttribute("lang", LANG_ATTR[l]);
    }
    const lgCode = document.getElementById("lang-ind-code");
    if (lgCode) lgCode.textContent = l.toUpperCase();
    const fb = document.getElementById("wu-foot-brand");
    if (fb) {
      fb.textContent = FOOT_BRAND[l];
      if (l === "en") fb.removeAttribute("lang");
      else fb.setAttribute("lang", LANG_ATTR[l]);
    }
    const fr = document.getElementById("wu-foot-rights");
    if (fr) {
      fr.innerHTML = FOOT_RIGHTS[l];
      fr.setAttribute("lang", LANG_ATTR[l]);
    }
  }
  function tick(){
    autoIdx = (autoIdx + 1) % ORDER.length;
    setLang(ORDER[autoIdx], true);
  }
  function startAuto(){
    if (autoTimer || userTouched) return;
    autoTimer = setInterval(tick, 30000);
  }
  function stopAuto(){ if (autoTimer){ clearInterval(autoTimer); autoTimer = null; } }

  btns.forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));

  // (CJK wordmark hover-wipe + click-lock interaction archived in
  //  notes/cjk-wordmark-hover-lock.md — removed from the live design.)

  const langInd = document.getElementById("lang-ind");
  if (langInd) {
    langInd.addEventListener("click", () => {
      const i = ORDER.indexOf(current);
      const next = ORDER[(i + 1) % ORDER.length];
      setLang(next);
    });
  }

  // initial
  setLang(current, true);
  startAuto();

  // Theme
  const lt = document.getElementById("th-lt");
  const dk = document.getElementById("th-dk");
  function setTheme(t){
    document.documentElement.setAttribute("data-theme", t);
    lt.classList.toggle("is-active", t === "light");
    dk.classList.toggle("is-active", t === "dark");
    localStorage.setItem("wu.theme", t);
  }
  setTheme(localStorage.getItem("wu.theme") || "light");
  lt.addEventListener("click", () => setTheme("light"));
  dk.addEventListener("click", () => setTheme("dark"));

  // ── corner markers + margin line-numbers ──────────────
  // Two L-shaped corner markers (TL, BR) are positioned so that the
  // HORIZONTAL distance between their inner angles : VERTICAL distance
  // is exactly 77:48 — matching the top and side scale ranges below.
  // The pair is centred within the stage with a minimum edge inset.
  function drawMarginNumbers(){
    const stage = document.querySelector(".wu-stage");
    if (!stage) return;
    stage.querySelectorAll(".wu-marginnum, .wu-gridline").forEach(n => n.remove());

    // Scale unit (matches CSS --u): 1 at 3840w, 0.5 at 1920w.
    const u = Math.max(0.5, Math.min(1, window.innerWidth / 3840));
    const MARK = Math.round(36 * u);    // marker arm length (matches CSS)
    const MIN_INSET = Math.round(56 * u);
    const W = stage.clientWidth;
    const H = stage.clientHeight;

    // Available distance between inner angles of the two marks if we
    // push them to the MIN_INSET on all sides:
    const maxDx = W - MIN_INSET * 2 - MARK * 2 + MARK * 2; // = W - 2*MIN_INSET
    const maxDy = H - MIN_INSET * 2 - MARK * 2 + MARK * 2; // = H - 2*MIN_INSET
    // (the MARK terms cancel because inner angle = outer-edge + MARK for TL,
    //  and = outer-edge - MARK for BR when mirrored)

    // Choose dx, dy such that dx/dy = 77/48 and both fit in max:
    let dx, dy;
    if (maxDx / maxDy >= 77 / 48) {
      dy = maxDy;
      dx = dy * 77 / 48;
    } else {
      dx = maxDx;
      dy = dx * 48 / 77;
    }

    // Centre the pair within the stage.
    const innerCx = W / 2;
    const innerCy = H / 2;
    const tlInnerX = innerCx - dx / 2;
    const tlInnerY = innerCy - dy / 2;
    const brInnerX = innerCx + dx / 2;
    const brInnerY = innerCy + dy / 2;

    // TL marker outer-corner = inner-angle minus MARK on both axes
    const tlLeft = Math.round(tlInnerX - MARK);
    const tlTop  = Math.round(tlInnerY - MARK);
    // BR marker outer-corner = inner-angle on both axes (marker extends
    // down-right from inner angle, since its borders are bottom+right)
    const brLeft = Math.round(brInnerX);
    const brTop  = Math.round(brInnerY);

    stage.style.setProperty("--mk-tl-left", tlLeft + "px");
    stage.style.setProperty("--mk-tl-top",  tlTop  + "px");
    stage.style.setProperty("--mk-br-left", brLeft + "px");
    stage.style.setProperty("--mk-br-top",  brTop  + "px");

    // Scale anchors: numerals' visual midline aligns with the midline
    // of the corresponding L-marker arm.
    //   Horizontal scale → sits on the top-border midline of the TL marker
    //   Vertical   scale → sits on the left-border midline of the TL marker
    const V_X = Math.round(tlLeft) + 0.5;        // centred on left-arm stroke
    const H_Y = Math.round(tlTop) + 0.5;         // centred on top-arm stroke

    // Vertical scale 0–48, render 05–45, span = dy
    const vStep = dy / 48;
    for (let n = 5; n <= 45; n += 5) {
      const el = document.createElement("span");
      el.className = "wu-marginnum v";
      el.style.left = V_X + "px";
      el.style.top  = Math.round(tlInnerY + n * vStep) + "px";
      el.textContent = String(n).padStart(2, "0");
      stage.appendChild(el);
    }
    // Horizontal scale 0–77, render 05–75, span = dx
    const hStep = dx / 77;
    for (let n = 5; n <= 75; n += 5) {
      const el = document.createElement("span");
      el.className = "wu-marginnum h";
      el.style.top  = H_Y + "px";
      el.style.left = Math.round(tlInnerX + n * hStep) + "px";
      el.textContent = String(n).padStart(2, "0");
      stage.appendChild(el);
    }

    // Background grid lines at each 10-step, with a gap at each end
    // so endpoints stay clear of the L-markers.
    const GAP = Math.round(56 * u);
    for (let n = 10; n <= 40; n += 10) {
      const line = document.createElement("span");
      line.className = "wu-gridline h";
      line.style.top    = Math.round(tlInnerY + n * vStep) + "px";
      line.style.left   = Math.round(tlInnerX + GAP) + "px";
      line.style.width  = Math.round(dx - GAP * 2) + "px";
      stage.appendChild(line);
    }
    for (let n = 10; n <= 70; n += 10) {
      const line = document.createElement("span");
      line.className = "wu-gridline v";
      line.style.left   = Math.round(tlInnerX + n * hStep) + "px";
      line.style.top    = Math.round(tlInnerY + GAP) + "px";
      line.style.height = Math.round(dy - GAP * 2) + "px";
      stage.appendChild(line);
    }
  }
  drawMarginNumbers();
  window.addEventListener("resize", drawMarginNumbers);

  // ── strike recolour while the CJK wordmark is being text-selected ──
  // (Disabled — hover effect replaced selection-based interaction.)
  (function noopSelectionWatcher(){})();
})();
