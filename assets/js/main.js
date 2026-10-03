(function () {
	var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var $ = function (s, r) { return (r || document).querySelector(s); };
	var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

	$('#yr').textContent = new Date().getFullYear();

	// theme toggle
	$('#theme').addEventListener('click', function () {
		var root = document.documentElement;
		var dark = root.dataset.theme ? root.dataset.theme === 'dark'
			: window.matchMedia('(prefers-color-scheme: dark)').matches;
		root.dataset.theme = dark ? 'light' : 'dark';
		try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
	});

	// rotating role
	var roles = ['SAP ABAP consultant', 'S/4HANA developer', 'HANA & CDS tinkerer', 'Laravel developer'];
	var swap = $('#swap'), ri = 0;
	if (!calm) setInterval(function () {
		swap.classList.add('out');
		setTimeout(function () { ri = (ri + 1) % roles.length; swap.textContent = roles[ri]; swap.classList.remove('out'); }, 350);
	}, 2800);

	// count up
	$$('[data-count]').forEach(function (el) {
		var n = +el.dataset.count, plus = el.hasAttribute('data-plus') ? '+' : '';
		if (calm) { el.textContent = n + plus; return; }
		var i = 0, t = setInterval(function () { i++; el.textContent = i + (i === n ? plus : ''); if (i >= n) clearInterval(t); }, 1100 / n);
	});

	// SE38 "execute"
	var mottos = [
		'Kopi dulu, logika jalan, solusi datang.',
		'Keep it simple, make it work, make it better.',
		'Code. Analyze. Optimize. Impact.',
		'Setiap hari sedikit lebih baik dari kemarin.',
		'Disiplin hari ini, kebebasan esok hari.'
	];
	var mi = -1, out = $('#out');
	function run() {
		mi = (mi + 1) % mottos.length;
		var d = new Date(), pad = function (x) { return ('0' + x).slice(-2); };
		out.innerHTML = '<div class="hdr"><span>ZHELLO_WORLD</span><span>' + pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear() + '</span></div>' +
			'<div>Salam dari Tangerang</div><div>' + mottos[mi] + '</div>' +
			'<div class="rt">Runtime: ' + (Math.random() * 0.04 + 0.008).toFixed(3) + ' s · press F8 again</div>';
		out.classList.add('show');
	}
	$('#run').addEventListener('click', run);
	document.addEventListener('keydown', function (e) { if (e.key === 'F8') { e.preventDefault(); run(); } });

	// work accordion
	$$('.job > button').forEach(function (b) {
		b.addEventListener('click', function () {
			var job = b.parentNode, open = !job.classList.contains('open');
			job.classList.toggle('open', open);
			b.setAttribute('aria-expanded', open);
		});
	});

	// project filters
	var projs = $$('.proj'), count = $('#count');
	function filter(fn, label) {
		var n = 0;
		projs.forEach(function (p) {
			var show = fn(p);
			if (show) n++;
			p.classList.add('fade');
			setTimeout(function () { p.classList.toggle('hide', !show); requestAnimationFrame(function () { p.classList.remove('fade'); }); }, calm ? 0 : 180);
		});
		count.textContent = n + (n === 1 ? ' project' : ' projects') + (label ? ' · ' + label : '');
	}
	function setOn(btn) { $$('#pf button, #mf button').forEach(function (b) { b.classList.toggle('on', b === btn); }); }
	function hits(m) { $$('.proj .mods span').forEach(function (s) { s.classList.toggle('hit', !!m && s.textContent === m); }); }
	$$('#pf button').forEach(function (b) {
		b.addEventListener('click', function () {
			setOn(b); hits(null);
			var f = b.dataset.f;
			filter(function (p) { return f === 'all' || p.dataset.p === f; }, f === 'all' ? '' : b.textContent);
		});
	});
	function byModule(m) {
		setOn($('#mf button[data-m="' + m + '"]')); hits(m);
		filter(function (p) { return p.dataset.m.split(' ').indexOf(m) > -1; }, 'module ' + m);
	}
	$$('#mf button').forEach(function (b) { b.addEventListener('click', function () { byModule(b.dataset.m); }); });
	$$('dl.skills .mod').forEach(function (b) {
		b.addEventListener('click', function () { byModule(b.dataset.m); $('#projects').scrollIntoView(); });
	});

	// copy buttons
	$$('.copy').forEach(function (b) {
		b.addEventListener('click', function () {
			var done = function () { b.textContent = 'copied'; b.classList.add('done'); setTimeout(function () { b.textContent = 'copy'; b.classList.remove('done'); }, 1500); };
			if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, function () {}); else done();
		});
	});

	// progress bar + active nav
	var bar = $('#progress'), links = $$('.top nav a'), secs = $$('section');
	function onScroll() {
		var h = document.documentElement.scrollHeight - innerHeight;
		bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
		var cur = '';
		secs.forEach(function (s) { if (s.getBoundingClientRect().top < 160) cur = s.id; });
		links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
	}
	addEventListener('scroll', onScroll, { passive: true }); onScroll();

	// reveal
	var rv = $$('.rv');
	if (calm || !('IntersectionObserver' in window)) { rv.forEach(function (e) { e.classList.add('in'); }); return; }
	var io = new IntersectionObserver(function (es) {
		es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
	}, { threshold: 0.1 });
	rv.forEach(function (e) { io.observe(e); });
})();
