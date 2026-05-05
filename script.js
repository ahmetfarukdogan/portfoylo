/* ── SCROLL TO TOP ON LOAD ── */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1600);
});

/* ── MAGNETIC HOVER ── */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── HAMBURGER ── */
const ham  = document.getElementById('hamburger');
const menu = document.getElementById('mobile-menu');

ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  menu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    ham.classList.remove('open');
    menu.classList.remove('open');
  });
});

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal-section').forEach(s => revealObs.observe(s));

/* ── NUMBER COUNTER ── */
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();
  (function step(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(t) * target);
    if (t < 1) requestAnimationFrame(step);
  })(start);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(n => counterObs.observe(n));

/* ── BENTO CARD TILT ── */
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── PHOTO STACK SLIDER ── */
(function() {
  const stack = document.getElementById('photoStack');
  if (!stack) return;

  const cards = Array.from(stack.querySelectorAll('.photo-card'));
  let positions = cards.map((_, i) => i);

  function applyPositions() {
    cards.forEach((card, i) => {
      card.dataset.pos = positions[i];
    });
  }

  applyPositions();

  stack.addEventListener('click', () => {
    const frontIdx = positions.indexOf(0);
    const frontCard = cards[frontIdx];

    frontCard.classList.add('fly-out');

    setTimeout(() => {
      frontCard.classList.remove('fly-out');
      positions = positions.map(p => (p - 1 + cards.length) % cards.length);
      applyPositions();
    }, 420);
  });
})();

/* ── SMOOTH MARQUEE PAUSE ON HOVER ── */
const track = document.querySelector('.marquee-track');
if (track) {
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

/* ══════════════════════════════════════
   ADMIN & BLOG
══════════════════════════════════════ */
(function() {
  const ADMIN_PWD       = 'Ahmet.06';
  const STORAGE_KEY     = 'afd_blog_posts_v1';
  const SESSION_KEY     = 'afd_admin_session';

  const loginBtn        = document.getElementById('adminLoginBtn');
  const loginModal      = document.getElementById('adminLoginModal');
  const panelModal      = document.getElementById('adminPanelModal');
  const loginForm       = document.getElementById('adminLoginForm');
  const pwdInput        = document.getElementById('adminPwd');
  const errorMsg        = document.getElementById('adminError');
  const postForm        = document.getElementById('postForm');
  const logoutBtn       = document.getElementById('logoutBtn');
  const blogGrid        = document.getElementById('blogGrid');
  const userPostList    = document.getElementById('userPostList');

  function loadPosts() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function savePosts(arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function renderUserPostsToBlog() {
    if (!blogGrid) return;
    blogGrid.querySelectorAll('.blog-post[data-user="true"]').forEach(n => n.remove());

    const posts = loadPosts();
    posts.forEach(p => {
      const art = document.createElement('article');
      art.className = 'blog-post';
      art.dataset.user = 'true';
      const initial = (p.title || 'A').trim().charAt(0).toUpperCase();
      const thumbHtml = p.image
        ? `<div class="blog-thumb"><img src="${p.image}" alt=""></div>`
        : `<div class="blog-thumb" style="background: linear-gradient(135deg, #1A1814, var(--accent));"><span class="blog-thumb-letter">${escapeHtml(initial)}</span></div>`;
      art.innerHTML = `
        ${thumbHtml}
        <div class="blog-meta">${escapeHtml(p.date || '')} · ${escapeHtml(p.readTime || '')}</div>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.summary)}</p>
      `;
      blogGrid.insertBefore(art, blogGrid.firstChild);
    });
  }

  function renderAdminList() {
    if (!userPostList) return;
    const posts = loadPosts();
    if (!posts.length) {
      userPostList.innerHTML = '<li class="empty">Henüz yazı eklemedin.</li>';
      return;
    }
    userPostList.innerHTML = '';
    posts.forEach((p, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${escapeHtml(p.title)}</span>
                      <button data-del="${i}">Sil</button>`;
      userPostList.appendChild(li);
    });
    userPostList.querySelectorAll('button[data-del]').forEach(b => {
      b.addEventListener('click', () => {
        const idx = parseInt(b.dataset.del, 10);
        if (!confirm('Bu yazıyı silmek istiyor musun?')) return;
        const arr = loadPosts();
        arr.splice(idx, 1);
        savePosts(arr);
        renderAdminList();
        renderUserPostsToBlog();
      });
    });
  }

  function openModal(m) { if (!m) return; m.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeModal(m) { if (!m) return; m.hidden = true; document.body.style.overflow = ''; }

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      if (sessionStorage.getItem(SESSION_KEY) === 'ok') {
        renderAdminList();
        openModal(panelModal);
      } else {
        errorMsg.hidden = true;
        pwdInput.value = '';
        openModal(loginModal);
        setTimeout(() => pwdInput.focus(), 100);
      }
    });
  }

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(loginModal);
      closeModal(panelModal);
    });
  });

  [loginModal, panelModal].forEach(m => {
    if (!m) return;
    m.addEventListener('click', e => {
      if (e.target === m) closeModal(m);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal(loginModal);
      closeModal(panelModal);
    }
  });

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      if (pwdInput.value === ADMIN_PWD) {
        sessionStorage.setItem(SESSION_KEY, 'ok');
        closeModal(loginModal);
        renderAdminList();
        openModal(panelModal);
      } else {
        errorMsg.hidden = false;
        pwdInput.value = '';
        pwdInput.focus();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      closeModal(panelModal);
    });
  }

  if (postForm) {
    postForm.addEventListener('submit', e => {
      e.preventDefault();
      const title    = document.getElementById('postTitle').value.trim();
      const summary  = document.getElementById('postSummary').value.trim();
      const body     = document.getElementById('postBody').value.trim();
      const readTime = document.getElementById('postReadTime').value.trim() || '3 dk okuma';
      const date     = document.getElementById('postDate').value.trim() || new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
      const fileInp  = document.getElementById('postImage');
      const file     = fileInp.files[0];

      const finalize = (imgData) => {
        const arr = loadPosts();
        arr.unshift({ title, summary, body, readTime, date, image: imgData || '' });
        savePosts(arr);
        postForm.reset();
        renderAdminList();
        renderUserPostsToBlog();
        const btn = postForm.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = 'Yayınlandı ✓';
        setTimeout(() => { btn.innerHTML = original; }, 1400);
      };

      if (file) {
        const reader = new FileReader();
        reader.onload = ev => finalize(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        finalize('');
      }
    });
  }

  renderUserPostsToBlog();
})();

/* ── Blog post modal reader ─── */
(function() {
  const posts = {
    'saha-satis': {
      meta: '02 May 2026 · 4 dk okuma',
      title: 'Saha satışında öğrendiğim 5 ders',
      body: `<p>Jetlid, Pan Creative Agency ve Andromedy Digital Solutions'da geçirdiğim aylarda saha satışının teoriden çok farklı olduğunu öğrendim.</p>
<p><strong>1. Red vurduğunda pes etme.</strong> Her "hayır" seni doğru kişiye bir adım daha yaklaştırır. Saha satışında ortalama 7-8 temasta bir "evet" alırsın.</p>
<p><strong>2. Dinlemek satmaktan güçlüdür.</strong> Müşterinin gerçek ihtiyacını anlamadan yapılan sunum boşa gider. İlk 2 dakikayı konuşmak değil, soru sormak için kullan.</p>
<p><strong>3. Takip seni farklı kılar.</strong> Çoğu satışçı bir kez ulaşır ve bekler. Ben her potansiyel müşterimi düzenli aralıklarla takip ettim — bu fark yarattı.</p>
<p><strong>4. Ürünü değil, sonucu sat.</strong> "Bu uygulama şu özelliklere sahip" değil, "bu uygulama sana şu kadar zaman kazandırır" de.</p>
<p><strong>5. Her görüşmeden bir şey öğren.</strong> Başarısız görüşmeleri kaybet değil, analiz et. En iyi satış eğitimi, sahada yaşanan hatalardır.</p>`
    },
    'dijital-pazarlama': {
      meta: '28 Nis 2026 · 6 dk okuma',
      title: 'Dijital pazarlamaya nereden başlamalı?',
      body: `<p>1. sınıf öğrencisi olarak nasıl ajans dünyasına girdim? Kısa cevap: merak ve ısrar.</p>
<p>Üniversiteye başladığımda dijital pazarlama hakkında teorik bilgim vardı ama pratik deneyimim yoktu. Pan Creative Agency'de satış ve pazarlama süreçlerine dahil olduğumda her şey değişti.</p>
<p><strong>Nereden başlamalısın?</strong></p>
<p>Önce hangi alanda olmak istediğine karar ver: içerik üretimi mi, paid ads mi, sosyal medya yönetimi mi, yoksa SEO mu? Her biri ayrı bir disiplin.</p>
<p>Ben içerik ve müşteri kazanımı tarafına yöneldim. Önce küçük markalar için sosyal medya planları hazırladım, sonra doğrudan satış süreçlerine girdim.</p>
<p>Tavsiyem: bir ajansın stajına veya part-time pozisyonuna başvur. Kurslardan çok daha hızlı öğrenirsin. Saha, en iyi okuldur.</p>`
    },
    'girisimcilik': {
      meta: '15 Nis 2026 · 5 dk okuma',
      title: 'Girişimcilik ekosisteminde öğrenci olmak',
      body: `<p>Campus Arc Elçisi olduğumda aslında ne yapacağımı tam bilmiyordum. Ama bu belirsizlik, en büyük öğretmenim oldu.</p>
<p>Üniversitede girişimcilik ekosistemi aslında çok zengin — fakat çoğu öğrenci bunun farkında değil. OSGİZ, GDG Bursa, TEDxBUU, 14. Girişimcilik Zirvesi... Bunlara katılmak sadece CV'ye katkı değil, gerçek bağlantılar demek.</p>
<p><strong>Ekosisteme nasıl girilir?</strong></p>
<p>Önce gönüllü ol. Organizasyonlara katıl, sadece izleyici olarak değil — ekip üyesi olarak. TEGV'de gönüllülük yaptım, UUIKT'ta aktif üye oldum. Her biri yeni bir kapı açtı.</p>
<p>Sonra yönetici ol. Finans ve Sponsorluk Direktörü olarak topluluğa katkı verdiğimde sadece liderlik değil, pratik problem çözme de öğrendim.</p>
<p>Girişimcilik ekosisteminde öğrenci olmak, öğrencilik süresini en verimli şekilde kullanmak demektir. Bir yıl içinde edindiğim ağ ve deneyim, yıllarca oturup ders çalışmaktan daha değerliydi.</p>`
    }
  };

  const overlay = document.getElementById('blogReadModal');
  if (!overlay) return;
  const closeBtn = document.getElementById('blogModalClose');

  function openPost(slug) {
    const post = posts[slug];
    if (!post) return;
    document.getElementById('blogModalMeta').textContent = post.meta;
    document.getElementById('blogModalTitle').textContent = post.title;
    document.getElementById('blogModalBody').innerHTML = post.body;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closePost() {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.blog-post[data-slug]').forEach(el => {
    el.addEventListener('click', () => openPost(el.dataset.slug));
  });

  closeBtn.addEventListener('click', closePost);
  overlay.addEventListener('click', e => { if (e.target === overlay) closePost(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePost(); });
})();

/* ══════════════════════════════════════
   THEME TOGGLE
   ══════════════════════════════════════ */
(function() {
  const root = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  if (!btn) return;
  const stored = localStorage.getItem('afd_theme');
  if (stored === 'dark') root.setAttribute('data-theme', 'dark');
  else if (stored === 'light') root.setAttribute('data-theme', 'light');
  else if (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }
  btn.addEventListener('click', () => {
    const cur = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('afd_theme', next);
  });
})();


