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
  initHeroCarousel();
  initEcommerce();
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

/* ==========================================================
   15. CARROSSEL DO HERO BANNER
   ========================================================== */

function initHeroCarousel() {
  const container = document.getElementById('hero-carousel-container');
  if (!container) return;

  const slides = container.querySelectorAll('.hero-slide');
  const dots = container.querySelectorAll('.hero-dot');
  if (slides.length <= 1) return;

  let currentSlide = 0;
  let autoPlayInterval;

  const showSlide = (index) => {
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('opacity-100', 'z-10');
        slide.classList.remove('opacity-0');
      } else {
        slide.classList.add('opacity-0');
        slide.classList.remove('opacity-100', 'z-10');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.className = 'hero-dot w-2.5 h-2.5 rounded-full bg-white transition-all scale-125';
      } else {
        dot.className = 'hero-dot w-2.5 h-2.5 rounded-full bg-white/40 transition-all hover:bg-white/60';
      }
    });

    currentSlide = index;
  };

  const nextSlide = () => {
    const nextIdx = (currentSlide + 1) % slides.length;
    showSlide(nextIdx);
  };

  // Click on dots
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-slide'), 10);
      showSlide(targetIdx);
      resetAutoPlay();
    });
  });

  const startAutoPlay = () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  };

  startAutoPlay();
}

/* ==========================================================
   16. E-COMMERCE ENGINE (CARRINHO, CARTEIRA DIGITAL, DETALHES)
   ========================================================== */

function initEcommerce() {
  // --- ESTADO GLOBAL (LOCAL STORAGE) ---
  let cart = JSON.parse(localStorage.getItem('ab_cart')) || [];
  let wallet = JSON.parse(localStorage.getItem('ab_wallet')) || {
    balance: 200.00,
    history: [
      { date: new Date().toLocaleDateString('pt-BR'), type: 'deposit', amount: 200.00, desc: 'Bônus de Cadastro' }
    ]
  };

  // Salvamento
  const saveCart = () => {
    localStorage.setItem('ab_cart', JSON.stringify(cart));
    updateCartUI();
  };

  const saveWallet = () => {
    localStorage.setItem('ab_wallet', JSON.stringify(wallet));
    updateWalletUI();
  };

  // --- COMPONENTES DO DOM ---
  const cartBtn = document.getElementById('cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotal = document.getElementById('cart-total');
  const cartBadge = document.getElementById('cart-badge');
  
  const walletBtn = document.getElementById('wallet-btn');
  const closeWalletBtn = document.getElementById('close-wallet-btn');
  const walletModal = document.getElementById('wallet-modal');
  const walletOverlay = document.getElementById('wallet-overlay');
  const walletBalanceNav = document.getElementById('wallet-balance-nav');
  const walletBalanceAmount = document.getElementById('wallet-balance-amount');
  const depositAmountInput = document.getElementById('deposit-amount');
  const btnGeneratePix = document.getElementById('btn-generate-pix');
  const pixArea = document.getElementById('pix-area');
  const btnCopyConfirmPix = document.getElementById('btn-copy-confirm-pix');
  const walletHistoryContainer = document.getElementById('wallet-history-container');
  
  const cartPayWalletBtn = document.getElementById('cart-pay-wallet-btn');
  const cartCheckoutWaBtn = document.getElementById('cart-checkout-wa-btn');

  const orderSuccessModal = document.getElementById('order-success-modal');
  const orderSuccessOverlay = document.getElementById('order-success-overlay');
  const btnSuccessClose = document.getElementById('btn-success-close');
  const successOrderId = document.getElementById('success-order-id');
  const successOrderTotal = document.getElementById('success-order-total');

  const productDetailModal = document.getElementById('product-detail-modal');
  const productDetailOverlay = document.getElementById('product-detail-overlay');
  const closeProductModalBtn = document.getElementById('close-product-modal-btn');
  const modalProductBadge = document.getElementById('modal-product-badge');
  const modalProductTitle = document.getElementById('modal-product-title');
  const modalProductPrice = document.getElementById('modal-product-price');
  const modalProductDesc = document.getElementById('modal-product-desc');
  const modalSizeContainer = document.getElementById('modal-size-container');
  const modalColorContainer = document.getElementById('modal-color-container');
  const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
  const productSlidesContainer = document.getElementById('product-slides-container');
  const prodSlideDots = document.getElementById('prod-slide-dots');
  const btnProdSlidePrev = document.getElementById('prod-slide-prev');
  const btnProdSlideNext = document.getElementById('prod-slide-next');

  // --- CONTROLE DE DRAWER & MODAIS ---
  const openCart = () => {
    cartDrawer.classList.add('active');
    cartDrawerOverlay.classList.add('active');
    renderCart();
  };
  const closeCart = () => {
    cartDrawer.classList.remove('active');
    cartDrawerOverlay.classList.remove('active');
  };

  const openWallet = () => {
    walletModal.classList.add('active');
    walletOverlay.classList.add('active');
    pixArea.classList.add('hidden'); // reseta pix
    updateWalletUI();
  };
  const closeWallet = () => {
    walletModal.classList.remove('active');
    walletOverlay.classList.remove('active');
  };

  const openProductModal = () => {
    productDetailModal.classList.add('active');
    productDetailOverlay.classList.add('active');
  };
  const closeProductModal = () => {
    productDetailModal.classList.remove('active');
    productDetailOverlay.classList.remove('active');
  };

  // Event Listeners abertura/fechamento
  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', closeCart);

  if (walletBtn) walletBtn.addEventListener('click', openWallet);
  if (closeWalletBtn) closeWalletBtn.addEventListener('click', closeWallet);
  if (walletOverlay) walletOverlay.addEventListener('click', closeWallet);

  if (closeProductModalBtn) closeProductModalBtn.addEventListener('click', closeProductModal);
  if (productDetailOverlay) productDetailOverlay.addEventListener('click', closeProductModal);

  if (btnSuccessClose) {
    btnSuccessClose.addEventListener('click', () => {
      orderSuccessModal.classList.remove('active');
      orderSuccessOverlay.classList.remove('active');
    });
  }

  // --- LÓGICA DO CARRINHO ---
  const updateCartUI = () => {
    // Badge counter
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) {
      cartBadge.textContent = totalQty;
      if (totalQty > 0) {
        cartBadge.classList.remove('scale-0');
        cartBadge.classList.add('scale-100');
      } else {
        cartBadge.classList.add('scale-0');
        cartBadge.classList.remove('scale-100');
      }
    }
  };

  const addToCart = (product) => {
    // Procura se já existe a mesma peça com tamanho e cor iguais
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === product.size && item.color === product.color
    );

    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    saveCart();
    showToast(`🛍️ ${product.name} adicionado ao carrinho!`);
    animateCartBadge();
    
    // Abre o carrinho para dar feedback visual imediato
    setTimeout(openCart, 300);
  };

  const updateCartItemQty = (index, delta) => {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
    renderCart();
  };

  const removeCartItem = (index) => {
    cart.splice(index, 1);
    saveCart();
    renderCart();
  };

  const renderCart = () => {
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
          <div class="w-16 h-16 rounded-full bg-creme flex items-center justify-center text-mint-darker">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-800">Seu carrinho está vazio</h4>
            <p class="text-xs text-gray-400 mt-1 max-w-[200px]">Adicione peças lindas e confortáveis para começar.</p>
          </div>
        </div>
      `;
      if (cartSubtotal) cartSubtotal.textContent = 'R$ 0,00';
      if (cartTotal) cartTotal.textContent = 'R$ 0,00';
      
      if (cartPayWalletBtn) cartPayWalletBtn.disabled = true;
      if (cartCheckoutWaBtn) cartCheckoutWaBtn.disabled = true;
      return;
    }

    if (cartPayWalletBtn) cartPayWalletBtn.disabled = false;
    if (cartCheckoutWaBtn) cartCheckoutWaBtn.disabled = false;

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
      // Limpa string de preço (ex: "R$ 27,99" -> 27.99)
      const numericPrice = parseFloat(item.price.replace(/[^\d,.-]/g, '').replace(',', '.'));
      const itemSubtotal = numericPrice * item.qty;
      total += itemSubtotal;

      html += `
        <div class="flex items-center gap-4 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover">
          <div class="flex-grow">
            <h4 class="text-xs font-semibold text-gray-800">${item.name}</h4>
            <div class="flex flex-wrap gap-1.5 mt-1 text-[9px] text-gray-400 uppercase tracking-wider font-semibold">
              <span class="bg-gray-100 px-1.5 py-0.5 rounded">Tamanho: ${item.size}</span>
              <span class="bg-gray-100 px-1.5 py-0.5 rounded">Cor: ${item.color}</span>
            </div>
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs font-bold text-mint-darkest">${item.price}</span>
              <!-- Qty controls -->
              <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
                <button class="px-2 py-0.5 text-gray-500 hover:bg-gray-100 text-xs font-bold" data-cart-index="${index}" data-action="minus">-</button>
                <span class="px-2 text-xs font-bold text-gray-700">${item.qty}</span>
                <button class="px-2 py-0.5 text-gray-500 hover:bg-gray-100 text-xs font-bold" data-cart-index="${index}" data-action="plus">+</button>
              </div>
            </div>
          </div>
          <button class="p-1 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-colors" data-cart-index="${index}" data-action="remove" aria-label="Remover item">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = html;
    
    const formattedTotal = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    if (cartSubtotal) cartSubtotal.textContent = formattedTotal;
    if (cartTotal) cartTotal.textContent = formattedTotal;

    // Adiciona handlers para os botões do carrinho
    cartItemsContainer.querySelectorAll('[data-cart-index]').forEach(btn => {
      const idx = parseInt(btn.getAttribute('data-cart-index'), 10);
      const action = btn.getAttribute('data-action');
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (action === 'plus') {
          updateCartItemQty(idx, 1);
        } else if (action === 'minus') {
          updateCartItemQty(idx, -1);
        } else if (action === 'remove') {
          removeCartItem(idx);
        }
      });
    });
  };

  // --- LÓGICA DA CARTEIRA DIGITAL ---
  const updateWalletUI = () => {
    if (walletBalanceNav) {
      walletBalanceNav.textContent = wallet.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (walletBalanceAmount) {
      walletBalanceAmount.textContent = wallet.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Render transactions history
    if (walletHistoryContainer) {
      if (wallet.history.length === 0) {
        walletHistoryContainer.innerHTML = `<div class="text-center text-gray-400 py-6">Nenhuma transação registrada.</div>`;
        return;
      }

      walletHistoryContainer.innerHTML = wallet.history.map(t => {
        const sign = t.type === 'deposit' ? '+' : '-';
        const color = t.type === 'deposit' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold';
        return `
          <div class="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
            <div>
              <p class="font-medium text-gray-700 text-xs">${t.desc}</p>
              <span class="text-[10px] text-gray-400 font-mono">${t.date}</span>
            </div>
            <span class="${color}">${sign} ${t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
        `;
      }).reverse().join(''); // Mais recente primeiro
    }
  };

  const addWalletTransaction = (type, amount, desc) => {
    wallet.history.push({
      date: new Date().toLocaleDateString('pt-BR'),
      type: type,
      amount: amount,
      desc: desc
    });
    if (type === 'deposit') {
      wallet.balance += amount;
    } else {
      wallet.balance -= amount;
    }
    saveWallet();
  };

  // Gerar Pix copia e cola
  if (btnGeneratePix) {
    btnGeneratePix.addEventListener('click', () => {
      const val = parseFloat(depositAmountInput.value);
      if (isNaN(val) || val < 5) {
        showToast('❌ Insira um valor de depósito válido (Mínimo R$ 5,00).');
        return;
      }
      pixArea.classList.remove('hidden');
    });
  }

  // Copiar e confirmar Pix
  if (btnCopyConfirmPix) {
    btnCopyConfirmPix.addEventListener('click', () => {
      const val = parseFloat(depositAmountInput.value);
      addWalletTransaction('deposit', val, 'Depósito via PIX');
      
      // Feedback visual
      showToast(`💸 Depósito de R$ ${val.toFixed(2)} confirmado!`);
      pixArea.classList.add('hidden');
      depositAmountInput.value = '50';
      
      // Animação de escala no saldo da carteira do nav
      if (walletBalanceNav) {
        walletBalanceNav.style.transition = 'transform 0.3s ease';
        walletBalanceNav.style.transform = 'scale(1.3)';
        setTimeout(() => { walletBalanceNav.style.transform = 'scale(1)'; }, 300);
      }
    });
  }

  // --- CHECKOUT COM CARTEIRA ---
  if (cartPayWalletBtn) {
    cartPayWalletBtn.addEventListener('click', () => {
      if (cart.length === 0) return;

      // Calcular total do carrinho
      let total = 0;
      cart.forEach(item => {
        const numericPrice = parseFloat(item.price.replace(/[^\d,.-]/g, '').replace(',', '.'));
        total += numericPrice * item.qty;
      });

      if (wallet.balance < total) {
        showToast('❌ Saldo insuficiente na carteira digital.');
        // Abre carteira para recarga
        setTimeout(() => {
          closeCart();
          openWallet();
        }, 1000);
        return;
      }

      // Conclui compra
      addWalletTransaction('purchase', total, `Compra #${Math.floor(10000 + Math.random() * 90000)}`);
      
      // Prepara e abre modal de sucesso
      if (successOrderId) {
        successOrderId.textContent = `#AB-${Math.floor(10000 + Math.random() * 90000)}`;
      }
      if (successOrderTotal) {
        successOrderTotal.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      }

      // Esvazia carrinho
      cart = [];
      saveCart();
      closeCart();

      // Confetti ou animação
      if (orderSuccessModal) {
        orderSuccessModal.classList.add('active');
        orderSuccessOverlay.classList.add('active');
      }
    });
  }

  // --- CHECKOUT VIA WHATSAPP (ESTRUTURADO) ---
  if (cartCheckoutWaBtn) {
    cartCheckoutWaBtn.addEventListener('click', () => {
      if (cart.length === 0) return;

      let total = 0;
      let text = '🛍️ *NOVO PEDIDO - ANA BELAS STORE*\n\n';
      
      cart.forEach((item, index) => {
        const numericPrice = parseFloat(item.price.replace(/[^\d,.-]/g, '').replace(',', '.'));
        const sub = numericPrice * item.qty;
        total += sub;
        
        text += `${index + 1}. *${item.name}*\n`;
        text += `   Tamanho: ${item.size} | Cor: ${item.color}\n`;
        text += `   Qtd: ${item.qty} x ${item.price} (Subtotal: R$ ${sub.toFixed(2)})\n\n`;
      });

      text += `--------------------------------\n`;
      text += `💰 *TOTAL DO PEDIDO: R$ ${total.toFixed(2)}*\n\n`;
      text += `Olá! Gostaria de finalizar o meu pedido acima e combinar a entrega.`;

      const encodedText = encodeURIComponent(text);
      const url = `https://wa.me/554892083379?text=${encodedText}`;

      // Abre link do WhatsApp em aba separada
      window.open(url, '_blank');
    });
  }

  // --- DELEGAÇÃO DE EVENTOS PARA MODAL DE PRODUTO & CARROSSEL ---
  document.addEventListener('click', (e) => {
    // Procura por clique em botões de "Ver detalhes" dentro de .product-card
    const detailsLink = e.target.closest('.product-card a[href*="wa.me"]');
    if (!detailsLink) return;

    // Previne a abertura direta do WhatsApp
    e.preventDefault();

    const card = detailsLink.closest('.product-card');
    if (!card) return;

    const id = card.getAttribute('data-product-id');
    const category = card.getAttribute('data-product-category-title') || 'Lingerie';
    const imgEl = card.querySelector('[data-product-image]');
    const nameEl = card.querySelector('[data-product-name]');
    const priceEl = card.querySelector('[data-product-price]');

    if (!nameEl || !priceEl || !imgEl) return;

    const image = imgEl.getAttribute('src');
    const name = nameEl.textContent.trim();
    const price = priceEl.textContent.trim();

    // Injeta dados no Modal
    if (modalProductBadge) modalProductBadge.textContent = category;
    if (modalProductTitle) modalProductTitle.textContent = name;
    if (modalProductPrice) modalProductPrice.textContent = price;

    // Reseta descrições se for calcinha, conjunto ou top para ser mais coerente
    if (modalProductDesc) {
      if (name.toLowerCase().includes('calcinha')) {
        modalProductDesc.textContent = 'Calcinha confeccionada em microfibra macia com toque gelado e costuras imperceptíveis. Modelagem anatômica perfeita para o uso diário, oferecendo máximo conforto e ventilação.';
      } else if (name.toLowerCase().includes('conjunto')) {
        modalProductDesc.textContent = 'Conjunto premium composto por duas peças harmônicas. Sutiã com alças reguláveis e calcinha confortável com detalhe refinado em renda floral. Caimento maravilhoso e tecidos nobres.';
      } else {
        modalProductDesc.textContent = 'Peça exclusiva Ana Belas confeccionada com matérias-primas selecionadas de alta elasticidade. Proporciona conforto absoluto, estilo e ajuste perfeito ao corpo.';
      }
    }

    // --- CARROSSEL DO MODAL (IMAGEM + DETALHES VISUAIS) ---
    if (productSlidesContainer && prodSlideDots) {
      productSlidesContainer.innerHTML = `
        <div class="product-slide active absolute inset-0 w-full h-full flex items-center justify-center">
            <img src="${image}" class="w-full h-full object-cover object-center" alt="${name} - Vista Principal">
        </div>
        <div class="product-slide absolute inset-0 w-full h-full flex items-center justify-center bg-creme-dark">
            <img src="${image}" class="w-full h-full object-cover object-top scale-125 transition-transform duration-500" alt="${name} - Detalhe aproximado">
        </div>
        <div class="product-slide absolute inset-0 w-full h-full flex items-center justify-center">
            <img src="${image}" class="w-full h-full object-cover object-center grayscale opacity-80" alt="${name} - Textura de tecido">
        </div>
      `;

      prodSlideDots.innerHTML = `
        <button class="w-2 h-2 rounded-full bg-mint-darkest transition-all scale-125" data-slide="0"></button>
        <button class="w-2 h-2 rounded-full bg-mint/55 transition-all hover:bg-mint" data-slide="1"></button>
        <button class="w-2 h-2 rounded-full bg-mint/55 transition-all hover:bg-mint" data-slide="2"></button>
      `;

      // Slider logic
      let modalSlides = productSlidesContainer.querySelectorAll('.product-slide');
      let modalDots = prodSlideDots.querySelectorAll('button');
      let slideIdx = 0;

      const setModalSlide = (idx) => {
        modalSlides.forEach((slide, sIdx) => {
          if (sIdx === idx) {
            slide.classList.add('active', 'opacity-100');
            slide.classList.remove('opacity-0');
          } else {
            slide.classList.add('opacity-0');
            slide.classList.remove('active', 'opacity-100');
          }
        });

        modalDots.forEach((dot, dIdx) => {
          if (dIdx === idx) {
            dot.className = 'w-2 h-2 rounded-full bg-mint-darkest transition-all scale-125';
          } else {
            dot.className = 'w-2 h-2 rounded-full bg-mint/55 transition-all hover:bg-mint';
          }
        });
        slideIdx = idx;
      };

      // Dots click
      modalDots.forEach((dot, idx) => {
        dot.addEventListener('click', () => setModalSlide(idx));
      });

      // Arrow click
      btnProdSlidePrev.onclick = () => {
        let prevIdx = (slideIdx - 1 + modalSlides.length) % modalSlides.length;
        setModalSlide(prevIdx);
      };

      btnProdSlideNext.onclick = () => {
        let nextIdx = (slideIdx + 1) % modalSlides.length;
        setModalSlide(nextIdx);
      };
    }

    // --- CONTROLE DE SELEÇÃO DE TAMANHO & COR ---
    // Reseta tamanhos
    const sizeButtons = modalSizeContainer.querySelectorAll('.size-option');
    sizeButtons.forEach(btn => {
      // Valor padrão M ativo
      if (btn.getAttribute('data-size') === 'M') {
        btn.className = 'size-option w-9 h-9 rounded-lg border border-mint-darkest text-mint-darkest font-semibold bg-mint/10 transition-all focus:outline-none';
      } else {
        btn.className = 'size-option w-9 h-9 rounded-lg border border-gray-200 text-xs font-medium hover:border-mint-darkest hover:text-mint-darkest transition-all focus:outline-none';
      }
    });

    let selectedSize = 'M';
    sizeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeButtons.forEach(b => b.className = 'size-option w-9 h-9 rounded-lg border border-gray-200 text-xs font-medium hover:border-mint-darkest hover:text-mint-darkest transition-all focus:outline-none');
        btn.className = 'size-option w-9 h-9 rounded-lg border border-mint-darkest text-mint-darkest font-semibold bg-mint/10 transition-all focus:outline-none';
        selectedSize = btn.getAttribute('data-size');
      });
    });

    // Reseta cores
    const colorButtons = modalColorContainer.querySelectorAll('.color-option');
    colorButtons.forEach(btn => {
      const color = btn.getAttribute('data-color');
      if (color === 'Menta') {
        btn.className = 'color-option w-6 h-6 rounded-full border-2 border-mint-darkest bg-[#A8D5C2] relative focus:outline-none';
        btn.innerHTML = '<span class="absolute inset-0.5 rounded-full border border-white"></span>';
      } else {
        btn.className = `color-option w-6 h-6 rounded-full border border-gray-200 ${color === 'Branco' ? 'bg-white' : color === 'Preto' ? 'bg-black' : 'bg-[#F7F2E7]'} relative focus:outline-none`;
        btn.innerHTML = '';
      }
    });

    let selectedColor = 'Menta';
    colorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        colorButtons.forEach(b => {
          const c = b.getAttribute('data-color');
          b.className = `color-option w-6 h-6 rounded-full border border-gray-200 ${c === 'Branco' ? 'bg-white' : c === 'Preto' ? 'bg-black' : 'bg-[#F7F2E7]'} relative focus:outline-none`;
          b.innerHTML = '';
        });
        
        btn.className = `color-option w-6 h-6 rounded-full border-2 border-mint-darkest ${btn.getAttribute('data-color') === 'Menta' ? 'bg-[#A8D5C2]' : btn.getAttribute('data-color') === 'Branco' ? 'bg-white' : btn.getAttribute('data-color') === 'Preto' ? 'bg-black' : btn.getAttribute('data-color') === 'Preto' ? 'bg-black' : 'bg-[#F7F2E7]'} relative focus:outline-none`;
        btn.innerHTML = '<span class="absolute inset-0.5 rounded-full border border-white"></span>';
        selectedColor = btn.getAttribute('data-color');
      });
    });

    // --- SUBMISSÃO AO CARRINHO DESDE O MODAL ---
    modalAddToCartBtn.onclick = (event) => {
      event.preventDefault();
      
      const productToAdd = {
        id: id,
        name: name,
        price: price,
        image: image,
        size: selectedSize,
        color: selectedColor
      };
      
      addToCart(productToAdd);
      closeProductModal();
    };

    openProductModal();
  });

  // Inicializa a interface da carteira e do carrinho no carregamento
  updateCartUI();
  updateWalletUI();
}

