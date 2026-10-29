/* Glowfolio — dokumen panjang di HP: daftar isi menempel di atas dan bagian bisa dilipat. */
(function () {
  // menu mengambang di HP: tutup setelah memilih tujuan atau menekan Esc
  var menu = document.querySelector('.mmenu');
  if (menu) {
    menu.querySelectorAll('.msheet a').forEach(function (l) { l.addEventListener('click', function () { menu.removeAttribute('open'); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu.removeAttribute('open'); });
  }
  var toc = document.querySelector('.toc-mobile');
  var secs = [].slice.call(document.querySelectorAll('.doc section[id]'));
  if (!toc || !secs.length) return;
  var phone = window.matchMedia('(max-width: 760px)').matches;
  var sum = toc.querySelector('summary');
  var cur = document.createElement('span');
  cur.className = 'toc-cur';
  sum.insertBefore(cur, sum.lastElementChild);
  var names = {};
  toc.querySelectorAll('a[href^="#"]').forEach(function (a) { names[a.getAttribute('href').slice(1)] = a.textContent; });

  function open(sec, on) {
    if (!sec || !sec.classList.contains('fold')) return;
    sec.classList.toggle('open', on);
    var b = sec.querySelector('.fold-btn');
    if (b) b.setAttribute('aria-expanded', on ? 'true' : 'false');
  }

  if (phone) {
    secs.forEach(function (sec) {
      var h = sec.querySelector('h2');
      if (!h) return;
      var body = document.createElement('div');
      body.className = 'fold-body';
      body.id = sec.id + '-isi';
      while (h.nextSibling) body.appendChild(h.nextSibling);
      sec.appendChild(body);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fold-btn';
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-controls', body.id);
      while (h.firstChild) b.appendChild(h.firstChild);
      var ic = document.createElement('span');
      ic.className = 'fold-ic';
      ic.setAttribute('aria-hidden', 'true');
      ic.textContent = '+';
      b.appendChild(ic);
      h.appendChild(b);
      sec.classList.add('fold');
      b.addEventListener('click', function () { open(sec, !sec.classList.contains('open')); });
    });
    // tombol buka/tutup semua di dalam daftar isi
    var all = document.createElement('button');
    all.type = 'button';
    all.className = 'fold-all';
    all.textContent = 'Buka semua bagian';
    all.addEventListener('click', function () {
      var on = all.textContent.indexOf('Buka') === 0;
      secs.forEach(function (s) { open(s, on); });
      all.textContent = on ? 'Tutup semua bagian' : 'Buka semua bagian';
      toc.removeAttribute('open');
    });
    toc.appendChild(all);
    if (location.hash) open(document.getElementById(location.hash.slice(1)), true);
  }

  // pilih bagian dari daftar isi: buka, tutup daftar isi, lalu gulir
  toc.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      open(document.getElementById(a.getAttribute('href').slice(1)), true);
      toc.removeAttribute('open');
    });
  });
  // tautan ke bagian lain di dalam isi dokumen
  document.querySelectorAll('.doc a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () { open(document.getElementById(a.getAttribute('href').slice(1)), true); });
  });

  // judul daftar isi menampilkan bagian yang sedang dibaca
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && names[e.target.id]) cur.textContent = names[e.target.id]; });
    }, { rootMargin: '-30% 0px -65% 0px' });
    secs.forEach(function (s) { io.observe(s); });
  }
})();
