/**
 * ============================================================
 * Ana Belas Store — JavaScript Principal
 * ============================================================
 * Funcionalidades:
 *  1.  Menu Mobile (toggle, overlay, scroll-lock)
 *  2.  Efeito de scroll no header
 *  3.  Animações de scroll (Intersection Observer)
 *  4.  Carrossel de produtos
 *  5.  Toggle de favoritos (coração)
 *  6.  Botão "Voltar ao topo"
 *  7.  Formulário de newsletter
 *  8.  Sistema de notificações toast
 *  9.  Scroll suave para links âncora
 * 10.  Marquee da barra superior
 * 11.  Lazy loading de imagens
 * 12.  Animação do contador do carrinho
 * 13.  Modal de busca
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderScroll();
  initScrollAnimations();
  initProductCarousel();
  initFavoriteToggle();
  initBackToTop();
  initNewsletterForm();
  initSmoothScroll();
  initMarquee();
  initLazyLoading();
  initCartCountAnimation();
  initSearchModal();
});

/* ==========================================================
   1. MENU MOBILE
   ========================================================== */

function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger, .mobile-menu-toggle');
  const menu = document.querySelector('.nav-menu, .mobile-menu');
  const overlay = document.querySelector('.menu-overlay, .overlay');

  if (!hamburger || !menu) return;

  // Cria overlay se não existir
  let menuOverlay = overlay;
  if (!menuOverlay) {
    menuOverlay = document.createElement('div');
    menuOverlay.classList.add('menu-overlay');
    document.body.appendChild(menuOverlay);
  }

  /** Abre ou fecha o menu mobile */
  const toggleMenu = () => {
    const isOpen = menu.classList.toggle('active');
    hamburger.classList.toggle('active');
    menuOverlay.classList.toggle('active');

    // Trava/destrava o scroll do body
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  /** Fecha o menu */
  const closeMenu = () => {
    menu.classList.remove('active');
    hamburger.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', closeMenu);

  // Fecha ao clicar em qualquer link do menu
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================
   2. EFEITO DE SCROLL NO HEADER
   ========================================================== */

function initHeaderScroll() {
  const header = document.querySelector('header, .header');
  if (!header) return;

  const SCROLL_THRESHOLD = 50;

  const handleScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Executa no carregamento para páginas já roladas
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ==========================================================
   3. ANIMAÇÕES DE SCROLL (Intersection Observer)
   ========================================================== */

function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const delay = el.dataset.delay || 0;

        // Aplica atraso escalonado se definido
        setTimeout(() => {
          el.classList.add('visible');
        }, Number(delay));

        // Deixa de observar após animar
        observer.unobserve(el);
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ==========================================================
   4. CARROSSEL DE PRODUTOS
   ========================================================== */

function initProductCarousel() {
  const carousel = document.querySelector('.product-carousel, .carousel-container');
  const btnLeft = document.querySelector('.carousel-btn-left, .carousel-prev');
  const btnRight = document.querySelector('.carousel-btn-right, .carousel-next');

  if (!carousel) return;

  /** Calcula a largura de um card para scroll preciso */
  const getScrollAmount = () => {
    const card = carousel.querySelector('.product-card, .carousel-item');
    if (!card) return 300; // fallback
    const style = getComputedStyle(card);
    return card.offsetWidth + parseInt(style.marginRight || 0, 10);
  };

  // Navegação esquerda
  if (btnLeft) {
    btnLeft.addEventListener('click', () => {
      carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
  }

  // Navegação direita
  if (btnRight) {
    btnRight.addEventListener('click', () => {
      carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }

  // Auto-scroll a cada 5 segundos
  let autoScrollInterval = setInterval(() => {
    // Volta ao início se chegou ao final
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    if (carousel.scrollLeft >= maxScroll - 5) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    }
  }, 5000);

  // Pausa auto-scroll ao passar o mouse
  carousel.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
  });

  // Retoma auto-scroll ao tirar o mouse
  carousel.addEventListener('mouseleave', () => {
    autoScrollInterval = setInterval(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScroll - 5) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }
    }, 5000);
  });
}

/* ==========================================================
   5. TOGGLE DE FAVORITOS (CORAÇÃO)
   ========================================================== */

function initFavoriteToggle() {
  const hearts = document.querySelectorAll('.heart-icon, .btn-favorite, .favorite-btn');
  if (!hearts.length) return;

  hearts.forEach((heart) => {
    heart.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isActive = heart.classList.toggle('active');

      // Animação de pulso
      heart.classList.add('pulse');
      heart.addEventListener(
        'animationend',
        () => heart.classList.remove('pulse'),
        { once: true }
      );

      // Notificação toast
      const message = isActive
        ? 'Adicionado aos favoritos!'
        : 'Removido dos favoritos!';
      showToast(message);

      // Anima o badge do carrinho
      animateCartBadge();
    });
  });
}

/* ==========================================================
   6. BOTÃO VOLTAR AO TOPO
   ========================================================== */

function initBackToTop() {
  let btn = document.querySelector('.back-to-top, .btn-top');

  // Cria o botão se não existir no HTML
  if (!btn) {
    btn = document.createElement('button');
    btn.classList.add('back-to-top');
    btn.setAttribute('aria-label', 'Voltar ao topo');
    btn.innerHTML = '&#8679;'; // seta para cima
    document.body.appendChild(btn);
  }

  const SHOW_THRESHOLD = 500;

  const toggleVisibility = () => {
    if (window.scrollY > SHOW_THRESHOLD) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================
   7. FORMULÁRIO DE NEWSLETTER
   ========================================================== */

function initNewsletterForm() {
  const form = document.querySelector('.newsletter-form, .form-newsletter');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const input = form.querySelector('input[type="email"]');
    if (!input) return;

    const email = input.value.trim();

    // Validação simples de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Por favor, insira um e-mail válido.');
      input.focus();
      return;
    }

    // Sucesso
    showToast('Obrigado por se inscrever! 💚');
    input.value = '';
  });
}

/* ==========================================================
   8. SISTEMA DE NOTIFICAÇÕES TOAST
   ========================================================== */

/**
 * Exibe uma notificação toast temporária.
 * @param {string} message — Texto da notificação
 * @param {number} [duration=3000] — Tempo de exibição em ms
 */
function showToast(message, duration = 3000) {
  // Cria container se não existir
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.classList.add('toast-container');
    Object.assign(container.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '10000',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none',
    });
    document.body.appendChild(container);
  }

  // Cria o toast
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;
  Object.assign(toast.style, {
    background: '#333',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    opacity: '0',
    transform: 'translateX(100%)',
    transition: 'all 0.4s ease',
    pointerEvents: 'auto',
    maxWidth: '320px',
    wordBreak: 'break-word',
  });

  container.appendChild(toast);

  // Animação de entrada (slide-in)
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  // Animação de saída (slide-out) e remoção
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}

/* ==========================================================
   9. SCROLL SUAVE PARA LINKS ÂNCORA
   ========================================================== */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ==========================================================
   10. MARQUEE DA BARRA SUPERIOR
   ========================================================== */

function initMarquee() {
  const marquee = document.querySelector('.marquee-content, .top-bar-content');
  if (!marquee) return;

  // Evita duplicar se já foi clonado
  if (marquee.dataset.cloned === 'true') return;

  // Duplica o conteúdo para scroll infinito contínuo
  const clone = marquee.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  marquee.parentNode.appendChild(clone);
  marquee.dataset.cloned = 'true';
}

/* ==========================================================
   11. LAZY LOADING DE IMAGENS
   ========================================================== */

function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  // Fallback para navegadores sem suporte a IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    images.forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const img = entry.target;
        img.src = img.dataset.src;

        // Também troca srcset se existir
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }

        img.removeAttribute('data-src');
        img.classList.add('loaded');
        observer.unobserve(img);
      });
    },
    { rootMargin: '50px 0px' } // carrega 50px antes de entrar na viewport
  );

  images.forEach((img) => imageObserver.observe(img));
}

/* ==========================================================
   12. ANIMAÇÃO DO CONTADOR DO CARRINHO
   ========================================================== */

function initCartCountAnimation() {
  // Adiciona animação ao clicar em botões de "adicionar ao carrinho"
  const addToCartButtons = document.querySelectorAll(
    '.add-to-cart, .btn-add-cart, .btn-comprar'
  );

  addToCartButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      animateCartBadge();
    });
  });
}

/**
 * Aplica uma animação de escala rápida no badge do carrinho.
 */
function animateCartBadge() {
  const badge = document.querySelector(
    '.cart-count, .cart-badge, .badge-cart'
  );
  if (!badge) return;

  badge.style.transition = 'transform 0.3s ease';
  badge.style.transform = 'scale(1.5)';

  setTimeout(() => {
    badge.style.transform = 'scale(1)';
  }, 300);
}

/* ==========================================================
   13. MODAL DE BUSCA
   ========================================================== */

function initSearchModal() {
  const searchToggle = document.querySelector(
    '.search-icon, .btn-search, .search-toggle'
  );
  const searchOverlay = document.querySelector(
    '.search-overlay, .search-modal'
  );
  const searchClose = document.querySelector(
    '.search-close, .search-modal-close'
  );
  const searchInput = document.querySelector(
    '.search-overlay input, .search-modal input'
  );

  if (!searchToggle || !searchOverlay) return;

  /** Abre o modal de busca */
  const openSearch = () => {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Foca no input com pequeno atraso para a animação
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 200);
    }
  };

  /** Fecha o modal de busca */
  const closeSearch = () => {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  searchToggle.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  });

  // Fecha ao clicar no botão X
  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  // Fecha ao pressionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      closeSearch();
    }
  });

  // Fecha ao clicar fora do conteúdo
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      closeSearch();
    }
  });
}
