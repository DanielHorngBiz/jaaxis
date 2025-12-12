import { useEffect, useRef } from "react";
import jaaxisLogo from "@/assets/jaxxis-logo.png";

const Landing = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FAQ Accordion - Vanilla JS
    const faqItems = faqRef.current?.querySelectorAll('.faq-item');
    faqItems?.forEach(item => {
      const button = item.querySelector('.faq-button');
      const content = item.querySelector('.faq-content') as HTMLElement;
      const icon = item.querySelector('.faq-icon');
      
      button?.addEventListener('click', () => {
        const isOpen = content.style.maxHeight !== '0px' && content.style.maxHeight !== '';
        
        // Close all others
        faqItems.forEach(otherItem => {
          const otherContent = otherItem.querySelector('.faq-content') as HTMLElement;
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherContent) otherContent.style.maxHeight = '0px';
          if (otherIcon) otherIcon.textContent = '+';
        });
        
        // Toggle current
        if (!isOpen) {
          content.style.maxHeight = content.scrollHeight + 'px';
          if (icon) icon.textContent = '−';
        }
      });
    });

    // Mobile menu toggle
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    menuButton?.addEventListener('click', () => {
      mobileMenu?.classList.toggle('hidden');
    });

    // GSAP ScrollTrigger for Features
    const initGSAP = () => {
      if (typeof window !== 'undefined' && (window as any).gsap && (window as any).ScrollTrigger) {
        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        const featuresSection = featuresRef.current;
        if (!featuresSection) return;

        const featureCards = featuresSection.querySelectorAll('.feature-card');
        const featureVideos = featuresSection.querySelectorAll('.feature-video');

        ScrollTrigger.create({
          trigger: featuresSection,
          start: "top top",
          end: `+=${featureCards.length * 100}%`,
          pin: true,
          scrub: 1,
          onUpdate: (self: any) => {
            const progress = self.progress;
            const activeIndex = Math.min(
              Math.floor(progress * featureCards.length),
              featureCards.length - 1
            );

            featureCards.forEach((card: Element, i: number) => {
              if (i === activeIndex) {
                card.classList.add('feature-active');
                card.classList.remove('feature-inactive');
              } else {
                card.classList.remove('feature-active');
                card.classList.add('feature-inactive');
              }
            });

            featureVideos.forEach((video: Element, i: number) => {
              if (i === activeIndex) {
                video.classList.remove('opacity-0');
                video.classList.add('opacity-100');
                (video as HTMLVideoElement).play?.();
              } else {
                video.classList.add('opacity-0');
                video.classList.remove('opacity-100');
              }
            });
          }
        });
      }
    };

    // Load GSAP from CDN
    if (!(window as any).gsap) {
      const gsapScript = document.createElement('script');
      gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
      gsapScript.onload = () => {
        const stScript = document.createElement('script');
        stScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
        stScript.onload = initGSAP;
        document.head.appendChild(stScript);
      };
      document.head.appendChild(gsapScript);
    } else {
      initGSAP();
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ========== CSS VARIABLES (matching design system) ========== */
        :root {
          --wp-primary: hsl(216, 100%, 61%);
          --wp-primary-rgb: 59, 130, 246;
          --wp-foreground: hsl(240, 10%, 10%);
          --wp-muted: hsl(240, 3.8%, 50%);
          --wp-border: hsl(240, 6%, 93%);
          --wp-background: hsl(0, 0%, 100%);
          --wp-card: hsl(0, 0%, 100%);
          --wp-secondary: hsl(240, 6%, 97%);
        }

        /* ========== BASE STYLES ========== */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .wp-landing {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: var(--wp-foreground);
          line-height: 1.6;
          background: var(--wp-background);
        }
        
        .wp-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        /* ========== NAVBAR STYLES ========== */
        .wp-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--wp-border);
          z-index: 1000;
          height: 64px;
        }
        
        .wp-navbar-inner {
          max-width: 1152px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          position: relative;
        }
        
        .wp-logo {
          height: 32px;
          width: auto;
        }
        
        .wp-nav-links {
          display: flex;
          gap: 4px;
          list-style: none;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .wp-nav-links a {
          color: var(--wp-muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        
        .wp-nav-links a:hover {
          color: var(--wp-foreground);
          background: var(--wp-secondary);
        }
        
        .wp-nav-buttons {
          display: flex;
          gap: 8px;
        }
        
        .wp-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .wp-btn-ghost {
          background: transparent;
          color: var(--wp-foreground);
        }
        
        .wp-btn-ghost:hover {
          background: var(--wp-secondary);
        }
        
        .wp-btn-primary {
          background: var(--wp-primary);
          color: white;
        }
        
        .wp-btn-primary:hover {
          filter: brightness(1.1);
        }
        
        .wp-btn-outline {
          background: transparent;
          border: 1px solid var(--wp-border);
          color: var(--wp-foreground);
        }
        
        .wp-btn-outline:hover {
          background: var(--wp-secondary);
        }
        
        .wp-mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        
        @media (max-width: 768px) {
          .wp-nav-links, .wp-nav-buttons { display: none; }
          .wp-mobile-menu-btn { display: block; }
        }
        
        /* ========== HERO STYLES (Centered layout like original) ========== */
        .wp-hero {
          padding: 128px 24px 96px;
          position: relative;
          overflow: hidden;
        }
        
        .wp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(var(--wp-primary-rgb), 0.15), transparent);
          pointer-events: none;
        }
        
        .wp-hero-inner {
          max-width: 1024px;
          margin: 0 auto;
          text-align: center;
        }
        
        .wp-hero h1 {
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 24px;
          color: var(--wp-foreground);
          letter-spacing: -0.02em;
        }
        
        .wp-hero h1 span {
          color: var(--wp-primary);
        }
        
        .wp-hero-subtitle {
          font-size: 18px;
          color: var(--wp-muted);
          max-width: 640px;
          margin: 0 auto 32px;
          line-height: 1.6;
        }
        
        .wp-hero-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
        }
        
        .wp-btn-lg {
          padding: 11px 24px;
          font-size: 14px;
          height: 44px;
        }
        
        .wp-social-proof {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 24px;
          font-size: 14px;
          color: var(--wp-muted);
          padding-top: 32px;
        }
        
        .wp-avatars {
          display: flex;
          margin-right: 8px;
        }
        
        .wp-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid var(--wp-background);
          margin-left: -8px;
        }
        
        .wp-avatar:first-child { margin-left: 0; background: rgba(var(--wp-primary-rgb), 0.1); }
        .wp-avatar:nth-child(2) { background: rgba(var(--wp-primary-rgb), 0.2); }
        .wp-avatar:nth-child(3) { background: rgba(var(--wp-primary-rgb), 0.3); }
        
        .wp-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--wp-border);
        }
        
        .wp-hero-video-container {
          max-width: 1024px;
          margin: 80px auto 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--wp-border);
          background: var(--wp-card);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          position: relative;
        }
        
        .wp-hero-video-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(var(--wp-primary-rgb), 0.05), transparent);
          pointer-events: none;
        }
        
        .wp-hero-video {
          width: 100%;
          display: block;
        }
        
        @media (max-width: 768px) {
          .wp-hero { padding: 100px 24px 60px; }
          .wp-hero-buttons { flex-direction: column; align-items: center; }
          .wp-dot { display: none; }
        }
        
        /* ========== FEATURES STYLES ========== */
        .wp-features {
          padding: 96px 24px;
          min-height: 100vh;
          background: var(--wp-background);
        }
        
        .wp-section-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 100px;
          border: 1px solid var(--wp-border);
          background: rgba(240, 240, 245, 0.5);
          font-size: 12px;
          font-weight: 500;
          color: var(--wp-foreground);
          margin-bottom: 16px;
        }
        
        .wp-features-header {
          text-align: center;
          margin-bottom: 64px;
          max-width: 768px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .wp-features-header h2 {
          font-size: clamp(30px, 4vw, 48px);
          font-weight: 700;
          margin-bottom: 24px;
          color: var(--wp-foreground);
          line-height: 1.2;
        }
        
        .wp-features-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 64px;
          max-width: 1024px;
          margin: 0 auto;
        }
        
        .wp-features-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .feature-card {
          padding: 24px;
          border-radius: 12px;
          border: 1px solid var(--wp-border);
          background: var(--wp-card);
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .feature-card:hover,
        .feature-card.feature-active {
          border-color: var(--wp-primary);
          background: rgba(var(--wp-primary-rgb), 0.05);
          box-shadow: 0 4px 20px rgba(var(--wp-primary-rgb), 0.1);
        }
        
        .feature-card.feature-inactive {
          opacity: 0.5;
        }
        
        .feature-card h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--wp-foreground);
        }
        
        .feature-card p {
          font-size: 14px;
          color: var(--wp-muted);
          line-height: 1.6;
        }
        
        .wp-features-video-container {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--wp-border);
          background: var(--wp-foreground);
          position: sticky;
          top: 100px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
        
        .feature-video {
          width: 100%;
          height: auto;
          display: block;
          transition: opacity 0.5s;
        }
        
        .feature-video.opacity-0 {
          opacity: 0;
          position: absolute;
          inset: 0;
        }
        
        .feature-video.opacity-100 {
          opacity: 1;
        }
        
        @media (max-width: 1024px) {
          .wp-features-grid { grid-template-columns: 1fr; }
          .wp-features-video-container { position: relative; top: 0; margin-bottom: 40px; order: -1; }
        }
        
        /* ========== PRICING STYLES ========== */
        .wp-pricing {
          padding: 96px 24px;
          background: rgba(240, 240, 245, 0.3);
        }
        
        .wp-pricing-header {
          text-align: center;
          margin-bottom: 64px;
          max-width: 768px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .wp-pricing-header h2 {
          font-size: clamp(30px, 4vw, 48px);
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--wp-foreground);
        }
        
        .wp-pricing-header p {
          font-size: 18px;
          color: var(--wp-muted);
        }
        
        .wp-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1024px;
          margin: 0 auto;
        }
        
        .wp-pricing-card {
          background: var(--wp-card);
          border: 1px solid var(--wp-border);
          border-radius: 12px;
          padding: 32px;
          position: relative;
          transition: all 0.3s;
        }
        
        .wp-pricing-card:hover {
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }
        
        .wp-pricing-card.popular {
          border-color: var(--wp-primary);
          box-shadow: 0 4px 20px rgba(var(--wp-primary-rgb), 0.15);
          transform: scale(1.02);
        }
        
        .wp-popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--wp-primary);
          color: white;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .wp-pricing-card h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--wp-foreground);
          text-align: center;
        }
        
        .wp-pricing-card .price {
          font-size: 40px;
          font-weight: 700;
          color: var(--wp-foreground);
          text-align: center;
          margin-bottom: 24px;
        }
        
        .wp-pricing-card .price span {
          font-size: 16px;
          font-weight: 400;
          color: var(--wp-muted);
        }
        
        .wp-btn-full {
          width: 100%;
          margin-bottom: 24px;
        }
        
        .wp-pricing-features {
          list-style: none;
        }
        
        .wp-pricing-features li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 8px 0;
          font-size: 14px;
          color: var(--wp-foreground);
        }
        
        .wp-check {
          color: var(--wp-primary);
          flex-shrink: 0;
          margin-top: 2px;
        }
        
        @media (max-width: 968px) {
          .wp-pricing-grid { grid-template-columns: 1fr; max-width: 400px; }
          .wp-pricing-card.popular { transform: none; }
        }
        
        /* ========== FAQ STYLES ========== */
        .wp-faq {
          padding: 96px 24px;
          background: var(--wp-background);
        }
        
        .wp-faq-header {
          text-align: center;
          margin-bottom: 64px;
          max-width: 768px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .wp-faq-header h2 {
          font-size: clamp(30px, 4vw, 48px);
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--wp-foreground);
        }
        
        .wp-faq-header p {
          font-size: 18px;
          color: var(--wp-muted);
        }
        
        .wp-faq-list {
          max-width: 768px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .faq-item {
          border: 1px solid var(--wp-border);
          border-radius: 12px;
          background: var(--wp-card);
          overflow: hidden;
          transition: border-color 0.2s;
        }
        
        .faq-item:hover {
          border-color: rgba(var(--wp-primary-rgb), 0.2);
        }
        
        .faq-button {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        
        .faq-button h3 {
          font-size: 16px;
          font-weight: 500;
          color: var(--wp-foreground);
        }
        
        .faq-icon {
          font-size: 20px;
          color: var(--wp-muted);
          font-weight: 300;
          transition: transform 0.2s;
        }
        
        .faq-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        
        .faq-content p {
          padding: 0 24px 20px;
          color: var(--wp-muted);
          font-size: 14px;
          line-height: 1.7;
        }
        
        /* ========== FOOTER STYLES ========== */
        .wp-footer {
          background: hsl(240, 10%, 10%);
          color: white;
          padding: 80px 24px 40px;
        }
        
        .wp-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 60px;
          max-width: 1024px;
          margin: 0 auto 60px;
        }
        
        .wp-footer-brand p {
          color: hsl(240, 5%, 65%);
          font-size: 14px;
          margin-top: 16px;
          max-width: 280px;
          line-height: 1.6;
        }
        
        .wp-footer h4 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          color: hsl(240, 5%, 65%);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .wp-footer-links {
          list-style: none;
        }
        
        .wp-footer-links li {
          margin-bottom: 12px;
        }
        
        .wp-footer-links a {
          color: hsl(240, 5%, 85%);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        
        .wp-footer-links a:hover {
          color: var(--wp-primary);
        }
        
        .wp-footer-bottom {
          border-top: 1px solid hsl(240, 5%, 20%);
          padding-top: 32px;
          max-width: 1024px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .wp-footer-bottom p {
          color: hsl(240, 5%, 45%);
          font-size: 14px;
        }
        
        @media (max-width: 768px) {
          .wp-footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
        }
        
        @media (max-width: 480px) {
          .wp-footer-grid { grid-template-columns: 1fr; }
        }
        
        /* ========== MOBILE MENU ========== */
        .wp-mobile-menu {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          background: var(--wp-background);
          border-bottom: 1px solid var(--wp-border);
          padding: 16px 24px;
          z-index: 999;
        }
        
        .wp-mobile-menu.hidden {
          display: none;
        }
        
        .wp-mobile-menu a {
          display: block;
          padding: 12px 0;
          color: var(--wp-muted);
          text-decoration: none;
          font-size: 14px;
        }
        
        .wp-mobile-menu a:hover {
          color: var(--wp-foreground);
        }
      `}} />

      <div className="wp-landing">
        {/* ========== NAVBAR ========== */}
        <nav className="wp-navbar">
          <div className="wp-navbar-inner">
            <a href="/">
              <img src={jaaxisLogo} alt="Jaaxis" className="wp-logo" />
            </a>
            
            <ul className="wp-nav-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#faq">Guide</a></li>
            </ul>
            
            <div className="wp-nav-buttons">
              <a href="/auth" className="wp-btn wp-btn-ghost">Log In</a>
              <a href="/auth" className="wp-btn wp-btn-primary">Sign Up</a>
            </div>
            
            <button className="wp-mobile-menu-btn" id="mobile-menu-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>
          
          <div className="wp-mobile-menu hidden" id="mobile-menu">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">Guide</a>
            <a href="/auth">Log In</a>
            <a href="/auth" className="wp-btn wp-btn-primary" style={{ marginTop: '12px' }}>Sign Up</a>
          </div>
        </nav>

        {/* ========== HERO (Centered like original) ========== */}
        <section className="wp-hero">
          <div className="wp-hero-inner">
            <h1>
              AI Customer Support<br />
              <span>That Actually Works</span>
            </h1>
            <p className="wp-hero-subtitle">
              Automate customer conversations with intelligent AI that understands context, resolves issues instantly, and scales with your business.
            </p>
            <div className="wp-hero-buttons">
              <a href="#pricing" className="wp-btn wp-btn-primary wp-btn-lg">
                Get Started Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="wp-social-proof">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="wp-avatars">
                  <div className="wp-avatar"></div>
                  <div className="wp-avatar"></div>
                  <div className="wp-avatar"></div>
                </div>
                <span>Trusted by 10,000+ teams</span>
              </div>
              <div className="wp-dot"></div>
              <span>★★★★★ 4.9/5 rating</span>
            </div>
          </div>
          
          <div className="wp-hero-video-container">
            <video className="wp-hero-video" autoPlay muted loop playsInline>
              <source src="https://jaaxis.com/wp-content/uploads/2025/06/GIF-5.webm" type="video/webm" />
            </video>
          </div>
        </section>

        {/* ========== FEATURES ========== */}
        <section className="wp-features" id="features" ref={featuresRef}>
          <div className="wp-features-header">
            <div className="wp-section-badge">Features</div>
            <h2>Powerful Features for<br />Modern Customer Support</h2>
          </div>
          <div className="wp-features-grid">
            <div className="wp-features-list">
              <div className="feature-card feature-active">
                <h3>Launch in Minutes</h3>
                <p>Turn your docs into an AI agent and deploy across web, Messenger, and Instagram instantly.</p>
              </div>
              <div className="feature-card">
                <h3>Smart Store Integration</h3>
                <p>Connect with Shopify and WooCommerce so your AI handles orders, refunds, and support automatically.</p>
              </div>
              <div className="feature-card">
                <h3>Learn From Every Chat</h3>
                <p>Edit past conversations to improve responses. No training required, changes apply instantly.</p>
              </div>
              <div className="feature-card">
                <h3>Seamless Human Handoff</h3>
                <p>Set custom rules to route complex cases to your team while capturing customer details automatically.</p>
              </div>
            </div>
            <div className="wp-features-video-container">
              <video className="feature-video opacity-100" muted loop playsInline>
                <source src="https://jaaxis.com/wp-content/uploads/2025/06/GIF-1.webm" type="video/webm" />
              </video>
              <video className="feature-video opacity-0" muted loop playsInline>
                <source src="https://jaaxis.com/wp-content/uploads/2025/06/GIF-2.webm" type="video/webm" />
              </video>
              <video className="feature-video opacity-0" muted loop playsInline>
                <source src="https://jaaxis.com/wp-content/uploads/2025/06/GIF-3.webm" type="video/webm" />
              </video>
              <video className="feature-video opacity-0" muted loop playsInline>
                <source src="https://jaaxis.com/wp-content/uploads/2025/06/GIF-04-V2.webm" type="video/webm" />
              </video>
            </div>
          </div>
        </section>

        {/* ========== PRICING ========== */}
        <section className="wp-pricing" id="pricing">
          <div className="wp-pricing-header">
            <div className="wp-section-badge">Pricing</div>
            <h2>Simple, transparent pricing</h2>
            <p>Choose the plan that's right for your business. All plans include our core features.</p>
          </div>
          <div className="wp-pricing-grid">
            <div className="wp-pricing-card">
              <h3>Basic</h3>
              <div className="price">$19<span>/month</span></div>
              <a href="/auth" className="wp-btn wp-btn-outline wp-btn-full">7-Day Free Trial</a>
              <ul className="wp-pricing-features">
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>300 replies per month</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>1 AI bot</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>Unlimited knowledge</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>Access to all integrations</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>$10 per 100 additional replies</li>
              </ul>
            </div>
            <div className="wp-pricing-card popular">
              <div className="wp-popular-badge">Most Popular</div>
              <h3>Pro</h3>
              <div className="price">$49<span>/month</span></div>
              <a href="/auth" className="wp-btn wp-btn-primary wp-btn-full">Get Started</a>
              <ul className="wp-pricing-features">
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>3000 replies per month</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>3 AI bots</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>Unlimited knowledge</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>Access to all integrations</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>$10 per 100 additional replies</li>
              </ul>
            </div>
            <div className="wp-pricing-card">
              <h3>Enterprise</h3>
              <div className="price">$149<span>/month</span></div>
              <a href="/auth" className="wp-btn wp-btn-outline wp-btn-full">Get Started</a>
              <ul className="wp-pricing-features">
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>15,000 replies per month</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>5 AI bots</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>Unlimited knowledge</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>Access to all integrations</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>$10 per 100 additional replies</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========== FAQ ========== */}
        <section className="wp-faq" id="faq" ref={faqRef}>
          <div className="wp-faq-header">
            <div className="wp-section-badge">FAQ</div>
            <h2>Frequently asked questions</h2>
            <p>Everything you need to know about Jaaxis.</p>
          </div>
          <div className="wp-faq-list">
            <div className="faq-item">
              <button className="faq-button">
                <h3>What is Jaaxis?</h3>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-content" style={{ maxHeight: 0 }}>
                <p>Jaaxis is an advanced AI-powered customer support chatbot platform that helps businesses automate customer interactions, provide instant responses, and scale their support operations efficiently.</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-button">
                <h3>Is Jaaxis free to use?</h3>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-content" style={{ maxHeight: 0 }}>
                <p>We offer a free trial to get you started. After that, we have flexible pricing plans starting from $19/month for small businesses to enterprise solutions for larger organizations.</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-button">
                <h3>Do I need to install software to use Jaaxis?</h3>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-content" style={{ maxHeight: 0 }}>
                <p>No installation required! Jaaxis is a cloud-based solution that works directly in your web browser. Simply embed our chatbot widget on your website or integrate with your preferred platforms.</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-button">
                <h3>How secure is my data in Jaaxis?</h3>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-content" style={{ maxHeight: 0 }}>
                <p>Security is our top priority. We use bank-grade encryption, comply with industry standards like GDPR and SOC 2, and ensure your data is protected with advanced security measures.</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-button">
                <h3>Will I own my data?</h3>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-content" style={{ maxHeight: 0 }}>
                <p>Yes, absolutely! You retain full ownership of all your data, conversations, and content. We never use your data to train models for other customers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== FOOTER ========== */}
        <footer className="wp-footer">
          <div className="wp-footer-grid">
            <div className="wp-footer-brand">
              <img src={jaaxisLogo} alt="Jaaxis" className="wp-logo" style={{ filter: 'brightness(0) invert(1)' }} />
              <p>Transform your customer support with AI-powered chatbots that understand your business.</p>
            </div>
            <div>
              <h4>Product</h4>
              <ul className="wp-footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul className="wp-footer-links">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul className="wp-footer-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="wp-footer-bottom">
            <p>© 2024 Jaaxis. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
