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
  initNewsletterForm();
  initSmoothScroll();
  initMarquee();
  initLazyLoading();
  initCartCountAnimation();
  initSearchModal();
  initCategoryFilter();
});

/* ==========================================================
   1. MENU MOBILE
   ========================================================== */

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  const closeBtn = document.getElementById('close-menu-btn');

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

  // Fecha ao clicar no botão X
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Fecha ao clicar em qualquer link do menu
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================
   2. EFEITO DE SCROLL NO HEADER
   ========================================================== */

function initHeaderScroll() {
  const header = document.getElementById('main-header');
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
  const carousel = document.getElementById('product-carousel');
  const btnLeft = document.getElementById('carousel-prev');
  const btnRight = document.getElementById('carousel-next');

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
  const hearts = document.querySelectorAll('.heart-btn');
  if (!hearts.length) return;

  hearts.forEach((heart) => {
    heart.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isActive = heart.classList.toggle('active');
      const svg = heart.querySelector('.heart-icon');

      // Altera visualmente o coração
      if (svg) {
        if (isActive) {
          svg.setAttribute('fill', '#A8D5C2');
          svg.classList.remove('text-gray-400');
          svg.classList.add('text-mint');
        } else {
          svg.setAttribute('fill', 'none');
          svg.classList.remove('text-mint');
          svg.classList.add('text-gray-400');
        }
      }

      // Animação de pulso
      heart.style.transform = 'scale(1.3)';
      setTimeout(() => { heart.style.transform = 'scale(1)'; }, 300);

      // Notificação toast
      const message = isActive
        ? '💚 Adicionado aos favoritos!'
        : 'Removido dos favoritos!';
      showToast(message);

      // Anima o badge do carrinho
      animateCartBadge();
    });
  });
}


/* ==========================================================
   7. FORMULÁRIO DE NEWSLETTER
   ========================================================== */

function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
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
  const badge = document.getElementById('cart-badge');
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
  const searchToggle = document.getElementById('search-btn');
  const searchOverlay = document.getElementById('search-modal');
  const searchClose = document.getElementById('close-search-btn');
  const searchOverlayBg = document.getElementById('search-modal-overlay');
  const searchInput = document.getElementById('search-input');

  if (!searchToggle || !searchOverlay) return;

  /** Abre o modal de busca */
  const openSearch = () => {
    searchOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Foca no input com pequeno atraso para a animação
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 200);
    }
  };

  /** Fecha o modal de busca */
  const closeSearch = () => {
    searchOverlay.classList.add('hidden');
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

  // Fecha ao clicar no overlay de fundo
  if (searchOverlayBg) {
    searchOverlayBg.addEventListener('click', closeSearch);
  }

  // Fecha ao pressionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !searchOverlay.classList.contains('hidden')) {
      closeSearch();
    }
  });
}

/* ==========================================================
   14. FILTRO DE CATEGORIAS E OCULTAMENTO DINÂMICO
   ========================================================== */

function initCategoryFilter() {
  const subcatEl = document.getElementById('subcategories-data');
  if (!subcatEl) return;
  
  let subcategories = [];
  try {
    subcategories = JSON.parse(subcatEl.textContent);
  } catch (e) {
    console.error('Erro ao ler subcategorias:', e);
    return;
  }
  
  const parentIds = ['lingerie', 'conjuntos', 'moda-feminina', 'infantil', 'promocoes', 'novidades'];
  
  parentIds.forEach(parentId => {
    const section = document.getElementById(parentId);
    if (!section) return;
    
    const container = section.querySelector(`[data-products-container="${parentId}"]`);
    if (!container) return;
    
    // Find all products in this container
    const products = Array.from(container.querySelectorAll('.product-card'));
    
    // Hide parent section if empty
    if (products.length === 0) {
      section.style.display = 'none';
      // Hide nav links (both desktop and mobile)
      document.querySelectorAll(`a[href="#${parentId}"]`).forEach(link => {
        const li = link.closest('li');
        if (li) {
          li.style.display = 'none';
        } else {
          link.style.display = 'none';
        }
      });
      return;
    } else {
      // Ensure section and nav links are visible
      section.style.display = '';
      document.querySelectorAll(`a[href="#${parentId}"]`).forEach(link => {
        const li = link.closest('li');
        if (li) {
          li.style.display = '';
        } else {
          link.style.display = '';
        }
      });
    }
    
    // Find the subcategories present in this section
    const activeSubcatIds = [...new Set(products.map(p => p.getAttribute('data-product-category')).filter(Boolean))];
    
    // Filter active subcategories from metadata to preserve order and titles
    const parentSubcats = subcategories.filter(s => s.parent === parentId && activeSubcatIds.includes(s.id));
    
    // If there is more than 1 subcategory, render filter tabs
    if (parentSubcats.length > 1) {
      // Create tabs container
      let tabsContainer = section.querySelector('.category-filter-tabs');
      if (!tabsContainer) {
        tabsContainer = document.createElement('div');
        tabsContainer.className = 'category-filter-tabs flex flex-wrap justify-center gap-2 mb-8';
        
        const titleContainer = section.querySelector('.text-center.mb-10') || section.firstElementChild;
        if (titleContainer) {
          titleContainer.insertAdjacentElement('afterend', tabsContainer);
        } else {
          container.parentNode.insertBefore(tabsContainer, container);
        }
      } else {
        tabsContainer.innerHTML = '';
      }
      
      // Add "Todos" tab
      const allTab = document.createElement('button');
      allTab.className = 'px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 bg-mint text-mint-darkest shadow-sm hover:shadow active:scale-95';
      allTab.textContent = 'Todos';
      allTab.setAttribute('data-filter', 'all');
      tabsContainer.appendChild(allTab);
      
      // Add other tabs
      parentSubcats.forEach(sub => {
        const tab = document.createElement('button');
        tab.className = 'px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 active:scale-95';
        tab.textContent = sub.title;
        tab.setAttribute('data-filter', sub.id);
        tabsContainer.appendChild(tab);
      });
      
      // Add click events to tabs
      const tabs = tabsContainer.querySelectorAll('button');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const filterValue = tab.getAttribute('data-filter');
          
          // Update active state of tabs
          tabs.forEach(t => {
            t.className = 'px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 active:scale-95';
          });
          tab.className = 'px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 bg-mint text-mint-darkest shadow-sm hover:shadow active:scale-95';
          
          // Filter products with a smooth transition
          products.forEach(prod => {
            const prodCat = prod.getAttribute('data-product-category');
            if (filterValue === 'all' || prodCat === filterValue) {
              // Fade in
              prod.style.display = '';
              setTimeout(() => {
                prod.style.opacity = '1';
                prod.style.transform = 'scale(1)';
              }, 10);
            } else {
              // Fade out
              prod.style.opacity = '0';
              prod.style.transform = 'scale(0.95)';
              setTimeout(() => {
                prod.style.display = 'none';
              }, 300);
            }
          });
        });
      });
    } else {
      // Remove any existing tabs container if subcategory count <= 1
      const tabsContainer = section.querySelector('.category-filter-tabs');
      if (tabsContainer) {
        tabsContainer.remove();
      }
      
      // Ensure all products are visible
      products.forEach(prod => {
        prod.style.display = '';
        prod.style.opacity = '1';
        prod.style.transform = 'scale(1)';
      });
    }
  });
}
