/* ============================================================
   THONG MINH MARKET — Scripts principaux
   ============================================================ */

/* ─── Hero Slider ────────────────────────────────────────── */
class HeroSlider {
  constructor(el) {
    this.el       = el;
    this.slides   = [...el.querySelectorAll('.hero__slide')];
    this.dots     = [...el.querySelectorAll('.hero__dot')];
    this.barre    = el.querySelector('.hero__barre-prog');
    this.current  = 0;
    this.total    = this.slides.length;
    this.timer    = null;
    this.DELAI    = 5500;

    this._init();
  }

  _init() {
    this._activer(0);

    this.el.querySelector('.hero__prev')
      .addEventListener('click', () => { this.precedent(); this._resetTimer(); });
    this.el.querySelector('.hero__next')
      .addEventListener('click', () => { this.suivant();   this._resetTimer(); });

    this.dots.forEach((dot, i) =>
      dot.addEventListener('click', () => { this._aller(i); this._resetTimer(); })
    );

    this.el.addEventListener('mouseenter', () => this._pause());
    this.el.addEventListener('mouseleave', () => this._jouer());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { this.precedent(); this._resetTimer(); }
      if (e.key === 'ArrowRight') { this.suivant();   this._resetTimer(); }
    });

    // Touch / swipe
    let startX = 0;
    this.el.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
    this.el.addEventListener('touchend',   (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) {
        dx < 0 ? this.suivant() : this.precedent();
        this._resetTimer();
      }
    });

    this._jouer();
  }

  _activer(i) {
    const ancien = this.current;

    this.slides[ancien].classList.remove('est-actif');
    this.slides[ancien].classList.add('est-precedent');
    this.dots[ancien].classList.remove('est-actif');

    this.current = (i + this.total) % this.total;

    this.slides[this.current].classList.add('est-actif');
    this.slides[this.current].classList.remove('est-precedent');
    this.dots[this.current].classList.add('est-actif');

    // Clean previous after transition
    setTimeout(() => {
      this.slides[ancien].classList.remove('est-precedent');
    }, 1200);

    this._lancerBarre();
  }

  _aller(i)    { this._activer(i); }
  suivant()    { this._activer(this.current + 1); }
  precedent()  { this._activer(this.current - 1); }

  _jouer() {
    this.timer = setInterval(() => this.suivant(), this.DELAI);
  }

  _pause() {
    clearInterval(this.timer);
    if (this.barre) {
      this.barre.style.transition = 'none';
      this.barre.style.width = '0%';
    }
  }

  _resetTimer() {
    this._pause();
    this._jouer();
  }

  _lancerBarre() {
    if (!this.barre) return;
    this.barre.style.transition = 'none';
    this.barre.style.width = '0%';
    // Force reflow
    void this.barre.offsetWidth;
    this.barre.style.transition = `width ${this.DELAI}ms linear`;
    this.barre.style.width = '100%';
  }
}

/* ─── Header: transparent → solide au scroll ────────────── */
function initHeader() {
  const header = document.querySelector('.entete');
  if (!header) return;

  const seuil = 80;

  const update = () => {
    if (window.scrollY > seuil) {
      header.classList.remove('entete--transparente');
      header.classList.add('entete--solide');
    } else {
      header.classList.add('entete--transparente');
      header.classList.remove('entete--solide');
    }
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ─── Navigation mobile ──────────────────────────────────── */
function initNavMobile() {
  const burger  = document.querySelector('.burger');
  const navMob  = document.querySelector('.nav-mobile');
  const fermer  = document.querySelector('.nav-mobile__fermer');
  if (!burger || !navMob) return;

  const ouvrir  = () => {
    navMob.classList.add('ouverte');
    document.body.style.overflow = 'hidden';
    burger.setAttribute('aria-expanded', 'true');
  };

  const fermerFn = () => {
    navMob.classList.remove('ouverte');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', ouvrir);
  if (fermer) fermer.addEventListener('click', fermerFn);

  navMob.querySelectorAll('a').forEach(a => a.addEventListener('click', fermerFn));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fermerFn();
  });
}

/* ─── Animations au scroll (Intersection Observer) ──────── */
function initAnimations() {
  const els = document.querySelectorAll('[data-anim]');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anime');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
}

/* ─── Bouton retour en haut ──────────────────────────────── */
function initRetourHaut() {
  const btn = document.querySelector('.retour-haut');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── Smooth scroll pour ancres internes ────────────────── */
function initAncres() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const cible = document.querySelector(a.getAttribute('href'));
      if (!cible) return;
      e.preventDefault();
      const offset = 80;
      const top = cible.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── Init ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const heroEl = document.querySelector('.hero');
  if (heroEl) new HeroSlider(heroEl);

  initHeader();
  initNavMobile();
  initAnimations();
  initRetourHaut();
  initAncres();
});
