(function () {
  'use strict';
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // Research interests: highlight the projects an interest covers
  var ris = $$('.ri'), projects = $$('.project'), current = null;
  function apply(tag) {
    ris.forEach(function (r) {
      var on = r.getAttribute('data-tag') === tag;
      r.classList.toggle('on', on);
      r.querySelector('.ri-btn').setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    projects.forEach(function (p) {
      var hit = tag && (' ' + p.getAttribute('data-tags') + ' ').indexOf(' ' + tag + ' ') >= 0;
      p.classList.toggle('match', !!hit);
      p.classList.toggle('dim', !!tag && !hit);
    });
  }
  ris.forEach(function (r) {
    r.querySelector('.ri-btn').addEventListener('click', function () {
      current = current === r.getAttribute('data-tag') ? null : r.getAttribute('data-tag');
      apply(current);
      var first = current && document.querySelector('.project.match');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Figure tabs inside each project
  projects.forEach(function (p) {
    var tabs = $$('.tab', p), panels = $$('.panel', p);
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var i = t.getAttribute('data-i');
        tabs.forEach(function (x) { var on = x === t; x.classList.toggle('on', on); x.setAttribute('aria-selected', on ? 'true' : 'false'); });
        panels.forEach(function (x) { x.hidden = x.getAttribute('data-i') !== i; });
      });
    });
  });

  // Lightbox: every figure of a project, previous / next across its tabs
  var box = document.getElementById('lightbox'), img = box.querySelector('img'), cap = box.querySelector('.lb-cap');
  var list = [], idx = 0;
  function show(i) {
    idx = (i + list.length) % list.length;
    var f = list[idx];
    img.src = f.getAttribute('data-full');
    img.alt = f.querySelector('img').alt;
    cap.innerHTML = f.closest('.panel').querySelector('.cap').innerHTML;
    box.querySelector('.lb-prev').hidden = box.querySelector('.lb-next').hidden = list.length < 2;
  }
  function open(fig) {
    list = $$('.fig', fig.closest('.project'));
    show(list.indexOf(fig));
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb-close').focus();
  }
  function close() { box.hidden = true; document.body.style.overflow = ''; img.removeAttribute('src'); }
  $$('.fig-btn').forEach(function (b) { b.addEventListener('click', function () { open(b.closest('.fig')); }); });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  box.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();
