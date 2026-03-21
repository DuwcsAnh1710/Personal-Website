/**
 * DUWCSANH PORTFOLIO 2026 - PREMIUM INTERACTIONS
 * Inspired by Apple + Linear + Awwwards
 * 
 * Features:
 * - Advanced cursor system with dot, ring, and trails
 * - Magnetic button effects
 * - 3D tilt for cards
 * - Smooth scroll and parallax
 * - Nav sliding indicator
 * - Page transitions
 * - Counting animations
 */

// ============================================================
// UTILITIES & CONFIG
// ============================================================
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
const root = document.documentElement;

// Custom easing functions
const easings = {
  expo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  spring: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  outQuart: (t) => 1 - Math.pow(1 - t, 4),
  inOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
};

// Smooth lerp function
const lerp = (start, end, factor) => start + (end - start) * factor;

// Clamp value between min and max
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// ============================================================
// ADVANCED CURSOR SYSTEM 2026
// ============================================================
class CursorSystem {
  constructor() {
    if (!supportsFinePointer || prefersReducedMotion) return;
    
    this.dot = null;
    this.ring = null;
    this.trails = [];
    this.pointerX = window.innerWidth / 2;
    this.pointerY = window.innerHeight / 2;
    this.currentX = this.pointerX;
    this.currentY = this.pointerY;
    this.ringX = this.pointerX;
    this.ringY = this.pointerY;
    this.trailPositions = [];
    this.isVisible = false;
    this.isHovering = false;
    this.hoverElement = null;
    this.animationFrame = null;
    this.trailCount = 8;
    this.trailInterval = 3;
    this.frameCount = 0;
    
    this.init();
  }
  
  init() {
    this.createElements();
    this.bindEvents();
    this.animate();
  }
  
  createElements() {
    // Create cursor dot
    this.dot = document.createElement('div');
    this.dot.className = 'cursor-dot';
    document.body.appendChild(this.dot);
    
    // Create cursor ring
    this.ring = document.createElement('div');
    this.ring.className = 'cursor-ring';
    document.body.appendChild(this.ring);
    
    // Create cursor trails
    for (let i = 0; i < this.trailCount; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.opacity = 0;
      trail.style.transform = `scale(${1 - (i * 0.1)})`;
      document.body.appendChild(trail);
      this.trails.push({
        element: trail,
        x: this.pointerX,
        y: this.pointerY,
        opacity: 0
      });
      this.trailPositions.push({ x: this.pointerX, y: this.pointerY });
    }
  }
  
  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.pointerX = e.clientX;
      this.pointerY = e.clientY;
      this.isVisible = true;
    });
    
    document.addEventListener('mouseleave', () => {
      this.isVisible = false;
    });
    
    document.addEventListener('mouseenter', () => {
      this.isVisible = true;
    });
    
    // Hover detection for interactive elements
    const interactiveSelectors = [
      'a', 'button', '.btn-primary', '.btn-outline', '.btn-ghost',
      '.nav-pill', '.metric-card', '.project-row', '.skill-card',
      '.profile-card', '.contact-card', '.map-card', 'input', 
      'textarea', '.hero-social a', '.floating-social a'
    ];
    
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(interactiveSelectors.join(', '));
      if (target && !this.isHovering) {
        this.isHovering = true;
        this.hoverElement = target;
        this.ring.classList.add('is-hovering');
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(interactiveSelectors.join(', '));
      if (target && target === this.hoverElement) {
        this.isHovering = false;
        this.hoverElement = null;
        this.ring.classList.remove('is-hovering');
      }
    });
  }
  
  animate() {
    // Calculate velocity for natural easing
    const vx = this.pointerX - this.ringX;
    const vy = this.pointerY - this.ringY;
    const speed = Math.sqrt(vx * vx + vy * vy);
    
    // Dynamic lerp based on speed (faster = more responsive)
    const dotFactor = Math.min(0.18 + speed * 0.001, 0.32);
    const ringFactor = Math.min(0.06 + speed * 0.0005, 0.12);
    
    // Smooth cursor dot movement
    this.currentX = lerp(this.currentX, this.pointerX, dotFactor);
    this.currentY = lerp(this.currentY, this.pointerY, dotFactor);
    
    // Slower ring movement with trailing effect
    this.ringX = lerp(this.ringX, this.pointerX, ringFactor);
    this.ringY = lerp(this.ringY, this.pointerY, ringFactor);
    
    // Update dot position
    this.dot.style.left = `${this.currentX}px`;
    this.dot.style.top = `${this.currentY}px`;
    this.dot.style.opacity = this.isVisible ? '1' : '0';
    
    // Update ring position
    this.ring.style.left = `${this.ringX}px`;
    this.ring.style.top = `${this.ringY}px`;
    this.ring.style.opacity = this.isVisible ? '1' : '0';
    
    // Update trails with smooth interpolation
    this.frameCount++;
    if (this.frameCount % this.trailInterval === 0) {
      this.trailPositions.unshift({ x: this.currentX, y: this.currentY });
      if (this.trailPositions.length > this.trailCount * 2) {
        this.trailPositions.pop();
      }
    }
    
    // Smooth trail rendering with lerped positions
    this.trails.forEach((trail, index) => {
      const positionIndex = Math.min((index + 1) * this.trailInterval, this.trailPositions.length - 1);
      const targetPos = this.trailPositions[positionIndex] || { x: this.currentX, y: this.currentY };
      
      trail.x = lerp(trail.x, targetPos.x, 0.25);
      trail.y = lerp(trail.y, targetPos.y, 0.25);
      trail.opacity = this.isVisible ? lerp(trail.opacity, 0.25 - (index * 0.025), 0.1) : 0;
      
      trail.element.style.left = `${trail.x}px`;
      trail.element.style.top = `${trail.y}px`;
      trail.element.style.opacity = trail.opacity;
    });
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
}

// ============================================================
// PARALLAX BACKGROUND SYSTEM
// ============================================================
class ParallaxSystem {
  constructor() {
    this.layers = document.querySelectorAll('.gradient-orb');
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.animationFrame = null;
    
    if (prefersReducedMotion || !this.layers.length) return;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.animate();
  }
  
  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    // Scroll-based parallax
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      this.layers.forEach((layer, index) => {
        const speed = 0.02 + (index * 0.01);
        layer.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  }
  
  animate() {
    // Slower, smoother movement with lerp
    this.targetX = lerp(this.targetX, this.mouseX, 0.02);
    this.targetY = lerp(this.targetY, this.mouseY, 0.02);
    
    this.layers.forEach((layer, index) => {
      // Subtle movement intensity
      const baseMove = 8 + (index * 6);
      const moveX = this.targetX * baseMove;
      const moveY = this.targetY * baseMove;
      
      layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
}

// ============================================================
// NAV SLIDING INDICATOR
// ============================================================
class NavIndicator {
  constructor() {
    this.nav = document.querySelector('.nav-satellites');
    this.pills = document.querySelectorAll('.nav-pill');
    this.indicator = null;
    
    if (!this.nav || !this.pills.length) return;
    
    this.init();
  }
  
  init() {
    this.createIndicator();
    this.updatePosition();
    this.bindEvents();
  }
  
  createIndicator() {
    this.indicator = document.createElement('div');
    this.indicator.className = 'nav-indicator';
    this.nav.appendChild(this.indicator);
    
    // Style the indicator
    const style = document.createElement('style');
    style.textContent = `
      .nav-indicator {
        position: absolute;
        height: calc(100% - 12px);
        background: rgba(0, 212, 255, 0.12);
        border: 1px solid rgba(0, 212, 255, 0.25);
        border-radius: var(--radius-full);
        pointer-events: none;
        z-index: 0;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
    `;
    document.head.appendChild(style);
  }
  
  updatePosition() {
    const activePill = this.nav.querySelector('.nav-pill.is-active') || this.pills[0];
    if (!activePill || !this.indicator) return;
    
    const navRect = this.nav.getBoundingClientRect();
    const pillRect = activePill.getBoundingClientRect();
    
    const left = pillRect.left - navRect.left;
    const width = pillRect.width;
    
    this.indicator.style.left = `${left}px`;
    this.indicator.style.width = `${width}px`;
    this.indicator.style.top = '6px';
  }
  
  bindEvents() {
    this.pills.forEach(pill => {
      pill.addEventListener('mouseenter', () => {
        const pillRect = pill.getBoundingClientRect();
        const navRect = this.nav.getBoundingClientRect();
        
        const left = pillRect.left - navRect.left;
        const width = pillRect.width;
        
        this.indicator.style.left = `${left}px`;
        this.indicator.style.width = `${width}px`;
      });
    });
    
    // Update on window resize
    window.addEventListener('resize', () => this.updatePosition());
    
    // Update on page load
    window.addEventListener('load', () => this.updatePosition());
  }
}

// ============================================================
// MAGNETIC BUTTON EFFECT
// ============================================================
class MagneticButtons {
  constructor() {
    this.buttons = document.querySelectorAll('.btn-magnetic, .btn-primary, .btn-outline');
    this.animationFrames = new Map();
    
    if (prefersReducedMotion || !this.buttons.length) return;
    
    this.init();
  }
  
  init() {
    this.buttons.forEach(button => {
      button.addEventListener('mouseenter', () => this.onEnter(button));
      button.addEventListener('mousemove', (e) => this.onMove(button, e));
      button.addEventListener('mouseleave', () => this.onLeave(button));
    });
  }
  
  onEnter(button) {
    button.style.transition = 'transform 0.1s ease-out';
  }
  
  onMove(button, e) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    const maxMove = 8;
    const moveX = clamp(deltaX * 0.2, -maxMove, maxMove);
    const moveY = clamp(deltaY * 0.2, -maxMove, maxMove);
    
    button.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }
  
  onLeave(button) {
    button.style.transform = '';
    button.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    
    setTimeout(() => {
      button.style.transition = '';
    }, 400);
  }
}

// ============================================================
// 3D TILT CARD EFFECT
// ============================================================
class TiltCard {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      maxRotation: options.maxRotation || 8,
      maxTranslate: options.maxTranslate || 15,
      perspective: options.perspective || 1000,
      glare: options.glare !== false,
      ...options
    };
    this.isActive = false;
    
    this.init();
  }
  
  init() {
    // Set perspective
    this.element.style.transformStyle = 'preserve-3d';
    this.element.style.perspective = `${this.options.perspective}px`;
    
    // Create glare effect
    if (this.options.glare) {
      this.createGlare();
    }
    
    this.bindEvents();
  }
  
  createGlare() {
    const glare = document.createElement('div');
    glare.className = 'tilt-glare';
    glare.style.cssText = `
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.15), transparent 60%);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
      border-radius: inherit;
    `;
    this.element.appendChild(glare);
    this.glare = glare;
  }
  
  bindEvents() {
    this.element.addEventListener('mouseenter', () => this.onEnter());
    this.element.addEventListener('mousemove', (e) => this.onMove(e));
    this.element.addEventListener('mouseleave', () => this.onLeave());
  }
  
  onEnter() {
    this.isActive = true;
    this.element.style.transition = 'transform 0.1s ease-out';
    if (this.glare) {
      this.glare.style.opacity = '1';
    }
  }
  
  onMove(e) {
    if (!this.isActive) return;
    
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -this.options.maxRotation;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * this.options.maxRotation;
    
    const moveX = ((e.clientX - centerX) / (rect.width / 2)) * this.options.maxTranslate;
    const moveY = ((e.clientY - centerY) / (rect.height / 2)) * this.options.maxTranslate;
    
    const rotate = `perspective(${this.options.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${moveX}px, ${moveY}px, 0)`;
    
    this.element.style.transform = rotate;
    
    // Update glare position
    if (this.glare) {
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      this.glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0, 212, 255, 0.2), transparent 60%)`;
    }
  }
  
  onLeave() {
    this.isActive = false;
    this.element.style.transform = '';
    this.element.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    
    if (this.glare) {
      this.glare.style.opacity = '0';
      this.glare.style.transition = 'opacity 0.3s';
    }
    
    setTimeout(() => {
      if (this.glare) {
        this.glare.style.transition = '';
      }
    }, 300);
  }
}

// ============================================================
// SCROLL REVEAL SYSTEM
// ============================================================
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal-on-scroll');
    this.threshold = 0.15;
    this.rootMargin = '0px 0px -10% 0px';
    
    if (!this.elements.length || prefersReducedMotion) {
      this.showAll();
      return;
    }
    
    this.init();
  }
  
  showAll() {
    this.elements.forEach(el => el.classList.add('is-visible'));
  }
  
  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: this.threshold, rootMargin: this.rootMargin }
    );
    
    this.elements.forEach(el => observer.observe(el));
  }
}

// ============================================================
// COUNTER ANIMATION
// ============================================================
class CounterAnimation {
  constructor(element, options = {}) {
    this.element = element;
    this.target = parseFloat(element.dataset.count || element.textContent);
    this.duration = options.duration || 2000;
    this.delay = options.delay || 0;
    this.decimals = options.decimals || 0;
    this.suffix = options.suffix || '';
    this.prefix = options.prefix || '';
    this.isNumber = typeof this.target === 'number';
    this.hasAnimated = false;
    
    if (!this.isNumber || prefersReducedMotion) {
      this.showFinal();
      return;
    }
    
    this.init();
  }
  
  showFinal() {
    this.element.textContent = this.prefix + this.target + this.suffix;
  }
  
  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            setTimeout(() => this.animate(), this.delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    observer.observe(this.element);
  }
  
  animate() {
    const startTime = performance.now();
    const startValue = 0;
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      const easedProgress = easings.outQuart(progress);
      
      const currentValue = startValue + (this.target - startValue) * easedProgress;
      
      this.element.textContent = this.prefix + 
        currentValue.toFixed(this.decimals) + this.suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  }
}

// ============================================================
// NAVBAR SCROLL BEHAVIOR
// ============================================================
class NavbarScroll {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.lastScrollY = 0;
    this.ticking = false;
    
    if (!this.header) return;
    
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.update();
  }
  
  onScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => this.update());
      this.ticking = true;
    }
  }
  
  update() {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class
    if (currentScrollY > 50) {
      this.header.classList.add('is-scrolled');
    } else {
      this.header.classList.remove('is-scrolled');
    }
    
    // Hide on scroll down, show on scroll up
    if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
      this.header.classList.add('is-hidden');
    } else {
      this.header.classList.remove('is-hidden');
    }
    
    this.lastScrollY = currentScrollY;
    this.ticking = false;
  }
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
class SmoothScroll {
  constructor() {
    this.links = document.querySelectorAll('a[href^="#"]');
    
    if (!this.links.length) return;
    
    this.init();
  }
  
  init() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => this.onClick(e, link));
    });
  }
  
  onClick(e, link) {
    const href = link.getAttribute('href');
    
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (!target) return;
    
    e.preventDefault();
    
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// ============================================================
// PAGE TRANSITIONS
// ============================================================
class PageTransitions {
  constructor() {
    this.links = document.querySelectorAll('a[href$=".html"]');
    this.transition = null;
    
    this.init();
  }
  
  init() {
    // Don't animate external links or links with target="_blank"
    this.links.forEach(link => {
      if (link.target === '_blank') return;
      
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        
        e.preventDefault();
        this.transitionOut(href);
      });
    });
  }
  
  transitionOut(href) {
    // Create transition overlay
    this.transition = document.createElement('div');
    this.transition.className = 'page-transition is-entering';
    document.body.appendChild(this.transition);
    
    // After animation, navigate
    setTimeout(() => {
      window.location.href = href;
    }, 400);
  }
}

// ============================================================
// RIPPLE EFFECT ENHANCED
// ============================================================
class RippleEffect {
  constructor() {
    this.buttons = document.querySelectorAll('.btn-primary, .btn-outline, .btn-ghost');
    
    if (!this.buttons.length || prefersReducedMotion) return;
    
    this.init();
  }
  
  init() {
    this.buttons.forEach(button => {
      button.addEventListener('click', (e) => this.createRipple(button, e));
    });
  }
  
  createRipple(button, event) {
    // Remove existing ripples
    button.querySelectorAll('.ripple').forEach(r => r.remove());
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    // Calculate position
    let x, y;
    if (event.clientX && event.clientY) {
      x = event.clientX - rect.left - size / 2;
      y = event.clientY - rect.top - size / 2;
    } else {
      x = rect.width / 2 - size / 2;
      y = rect.height / 2 - size / 2;
    }
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => ripple.remove());
  }
}

// ============================================================
// PROGRESS BAR ANIMATION
// ============================================================
class ProgressAnimation {
  constructor() {
    this.bars = document.querySelectorAll('.bar-track[data-progress]');
    this.radials = document.querySelectorAll('.radial-progress[data-progress]');
    
    if (!this.bars.length && !this.radials.length) return;
    
    this.init();
  }
  
  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    
    this.bars.forEach(bar => {
      bar.classList.add('progress-init');
      observer.observe(bar);
    });
    
    this.radials.forEach(radial => {
      observer.observe(radial);
    });
  }
  
  activate(element) {
    const progress = parseFloat(element.dataset.progress) || 0;
    
    if (element.classList.contains('bar-track')) {
      element.style.setProperty('--target-width', `${progress}%`);
      element.classList.add('is-active');
    } else if (element.classList.contains('radial-progress')) {
      element.style.setProperty('--progress', progress);
    }
  }
}

// ============================================================
// INITIALIZE ALL SYSTEMS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cursor system
  new CursorSystem();
  
  // Initialize parallax
  new ParallaxSystem();
  
  // Initialize nav indicator
  new NavIndicator();
  
  // Initialize magnetic buttons
  new MagneticButtons();
  
  // Initialize tilt cards
  document.querySelectorAll('.project-row, .metric-card, .skill-card, .profile-card').forEach(el => {
    new TiltCard(el, {
      maxRotation: 5,
      maxTranslate: 8,
      glare: true
    });
  });
  
  // Initialize scroll reveal
  new ScrollReveal();
  
  // Initialize counters
  document.querySelectorAll('.metric-value[data-count]').forEach(el => {
    const text = el.textContent;
    const match = text.match(/[\d.]+/);
    if (match) {
      const num = parseFloat(match[0]);
      const suffix = text.replace(/[\d.]+/, '');
      new CounterAnimation(el, {
        duration: 2000,
        delay: 0,
        suffix: suffix
      });
    }
  });
  
  // Initialize navbar scroll
  new NavbarScroll();
  
  // Initialize smooth scroll
  new SmoothScroll();
  
  // Initialize ripple effect
  new RippleEffect();
  
  // Initialize progress animations
  new ProgressAnimation();
  
  // Initialize page transitions (optional, uncomment if needed)
  // new PageTransitions();
  
  console.log('%c✨ DuwcsAnh Portfolio 2026', 
    'background: linear-gradient(135deg, #00d4ff, #8b5cf6); color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: bold;');
});

// ============================================================
// EXPORTS FOR DEBUGGING
// ============================================================
window.Portfolio2026 = {
  CursorSystem,
  ParallaxSystem,
  NavIndicator,
  MagneticButtons,
  TiltCard,
  ScrollReveal,
  CounterAnimation,
  NavbarScroll,
  SmoothScroll,
  RippleEffect,
  ProgressAnimation
};
