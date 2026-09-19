(function () {
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Mountain backdrop: a seeded, layered ridgeline drawn as an SVG and used as a CSS background.
  try {
    var W = 1600, H = 900;
    var rng = function (s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
    var ridge = function (seed, base, amp) {
      var r = rng(seed), pts = [base, base], d = amp, i, j, n;
      for (i = 0; i < 8; i++) {
        n = [];
        for (j = 0; j < pts.length - 1; j++) { n.push(pts[j], (pts[j] + pts[j + 1]) / 2 + (r() * 2 - 1) * d); }
        n.push(pts[pts.length - 1]); pts = n; d *= 0.55;
      }
      var s = 'M0,' + H;
      for (j = 0; j < pts.length; j++) { s += 'L' + Math.round(W * j / (pts.length - 1)) + ',' + Math.round(pts[j]); }
      return s + 'L' + W + ',' + H + 'Z';
    };
    var L = [[11, 420, 210, '#3a3a3d'], [23, 520, 170, '#28282b'], [37, 610, 130, '#191a1c'], [51, 700, 95, '#0e0e0f'], [67, 790, 55, '#060606']];
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMax slice">' +
      '<defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0a0b"/><stop offset=".55" stop-color="#1d1d20"/><stop offset="1" stop-color="#2c2c30"/></linearGradient>' +
      '<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a8f96" stop-opacity="0"/><stop offset="1" stop-color="#8a8f96" stop-opacity=".16"/></linearGradient>' +
      '<filter id="g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .09"/></feComponentTransfer></filter></defs>' +
      '<rect width="' + W + '" height="' + H + '" fill="url(#a)"/>';
    L.forEach(function (l, k) {
      svg += '<path d="' + ridge(l[0], l[1], l[2]) + '" fill="' + l[3] + '"/>';
      if (k < 4) { svg += '<rect y="' + (l[1] - 40) + '" width="' + W + '" height="' + (H - l[1] + 40) + '" fill="url(#b)"/>'; }
    });
    svg += '<rect width="' + W + '" height="' + H + '" filter="url(#g)"/></svg>';
    document.documentElement.style.setProperty('--mtn', 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
  } catch (e) {}

  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
})();
