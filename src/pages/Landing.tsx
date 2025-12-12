import { useEffect, useRef } from "react";

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

    // GSAP ScrollTrigger for Features (if GSAP is loaded)
    const initGSAP = () => {
      if (typeof window !== 'undefined' && (window as any).gsap && (window as any).ScrollTrigger) {
        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        const featuresSection = featuresRef.current;
        if (!featuresSection) return;

        const featureCards = featuresSection.querySelectorAll('.feature-card');
        const featureVideos = featuresSection.querySelectorAll('.feature-video');

        // Pin the section and animate through features
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
      {/* ============================================
          WORDPRESS COPY-PASTE GUIDE
          ============================================
          
          1. Copy the <style> tag contents to your WordPress theme's CSS
          2. Copy each section's HTML (marked with comments)
          3. Copy the JavaScript at the bottom to your theme's JS file
          4. Add GSAP CDN links to your WordPress header:
             <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
             <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
          
          ============================================ */}

      <style dangerouslySetInnerHTML={{ __html: `
        /* ========== BASE STYLES ========== */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .wp-landing {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1a1a2e;
          line-height: 1.6;
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
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e5e7eb;
          z-index: 1000;
          padding: 16px 0;
        }
        
        .wp-navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .wp-logo {
          height: 32px;
          width: auto;
        }
        
        .wp-nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }
        
        .wp-nav-links a {
          color: #4b5563;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .wp-nav-links a:hover {
          color: #3B82F6;
        }
        
        .wp-nav-buttons {
          display: flex;
          gap: 12px;
        }
        
        .wp-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }
        
        .wp-btn-outline {
          background: transparent;
          border: 1px solid #e5e7eb;
          color: #1a1a2e;
        }
        
        .wp-btn-outline:hover {
          background: #f9fafb;
        }
        
        .wp-btn-primary {
          background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
          color: white;
          border: none;
        }
        
        .wp-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .wp-mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .wp-nav-links, .wp-nav-buttons { display: none; }
          .wp-mobile-menu-btn { display: block; }
        }
        
        /* ========== HERO STYLES ========== */
        .wp-hero {
          padding: 140px 0 80px;
          background: linear-gradient(180deg, #f8f7ff 0%, #ffffff 100%);
        }
        
        .wp-hero-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        
        .wp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(96, 165, 250, 0.1) 100%);
          border-radius: 100px;
          font-size: 13px;
          color: #3B82F6;
          font-weight: 500;
          margin-bottom: 24px;
        }
        
        .wp-hero h1 {
          font-size: 52px;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 24px;
          color: #1a1a2e;
        }
        
        .wp-hero h1 span {
          background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .wp-hero p {
          font-size: 18px;
          color: #6b7280;
          margin-bottom: 32px;
          max-width: 500px;
        }
        
        .wp-hero-buttons {
          display: flex;
          gap: 16px;
        }
        
        .wp-btn-large {
          padding: 14px 28px;
          font-size: 16px;
        }
        
        .wp-hero-video-container {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
        
        .wp-hero-video {
          width: 100%;
          height: auto;
          display: block;
        }
        
        @media (max-width: 968px) {
          .wp-hero-inner { grid-template-columns: 1fr; text-align: center; }
          .wp-hero p { margin: 0 auto 32px; }
          .wp-hero-buttons { justify-content: center; }
          .wp-hero h1 { font-size: 36px; }
        }
        
        /* ========== TRUST BADGES STYLES ========== */
        .wp-trust {
          padding: 60px 0;
          background: #fafafa;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .wp-trust p {
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
          margin-bottom: 32px;
        }
        
        .wp-trust-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 48px;
          flex-wrap: wrap;
        }
        
        .wp-trust-logo {
          height: 32px;
          opacity: 0.5;
          filter: grayscale(100%);
          transition: all 0.3s;
        }
        
        .wp-trust-logo:hover {
          opacity: 1;
          filter: grayscale(0%);
        }
        
        /* ========== FEATURES STYLES ========== */
        .wp-features {
          padding: 100px 0;
          min-height: 100vh;
        }
        
        .wp-features-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .wp-features-header h2 {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #1a1a2e;
        }
        
        .wp-features-header p {
          font-size: 18px;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .wp-features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        
        .wp-features-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .feature-card {
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .feature-card:hover,
        .feature-card.feature-active {
          border-color: #3B82F6;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
        }
        
        .feature-card.feature-inactive {
          opacity: 0.5;
        }
        
        .feature-card h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1a1a2e;
        }
        
        .feature-card p {
          font-size: 15px;
          color: #6b7280;
        }
        
        .wp-features-video-container {
          position: sticky;
          top: 100px;
          border-radius: 16px;
          overflow: hidden;
          background: #1a1a2e;
          aspect-ratio: 16/9;
        }
        
        .feature-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.5s;
        }
        
        .feature-video.opacity-0 {
          opacity: 0;
        }
        
        .feature-video.opacity-100 {
          opacity: 1;
        }
        
        @media (max-width: 968px) {
          .wp-features-grid { grid-template-columns: 1fr; }
          .wp-features-video-container { position: relative; top: 0; margin-bottom: 40px; }
        }
        
        /* ========== PRICING STYLES ========== */
        .wp-pricing {
          padding: 100px 0;
          background: linear-gradient(180deg, #f8f7ff 0%, #ffffff 100%);
        }
        
        .wp-pricing-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .wp-pricing-header h2 {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #1a1a2e;
        }
        
        .wp-pricing-header p {
          font-size: 18px;
          color: #6b7280;
        }
        
        .wp-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 1100px;
          margin: 0 auto;
        }
        
        .wp-pricing-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 40px;
          position: relative;
          transition: all 0.3s;
        }
        
        .wp-pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .wp-pricing-card.popular {
          border-color: #3B82F6;
          box-shadow: 0 0 0 1px #3B82F6;
        }
        
        .wp-popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
          color: white;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .wp-pricing-card h3 {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1a1a2e;
        }
        
        .wp-pricing-card .price {
          font-size: 48px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 16px 0;
        }
        
        .wp-pricing-card .price span {
          font-size: 16px;
          font-weight: 400;
          color: #6b7280;
        }
        
        .wp-pricing-card .description {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 24px;
        }
        
        .wp-pricing-features {
          list-style: none;
          margin-bottom: 32px;
        }
        
        .wp-pricing-features li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          font-size: 14px;
          color: #4b5563;
        }
        
        .wp-pricing-features li::before {
          content: "✓";
          color: #3B82F6;
          font-weight: 600;
        }
        
        .wp-btn-full {
          width: 100%;
          text-align: center;
        }
        
        @media (max-width: 968px) {
          .wp-pricing-grid { grid-template-columns: 1fr; max-width: 400px; }
        }
        
        /* ========== FAQ STYLES ========== */
        .wp-faq {
          padding: 100px 0;
        }
        
        .wp-faq-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .wp-faq-header h2 {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #1a1a2e;
        }
        
        .wp-faq-list {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .faq-item {
          border-bottom: 1px solid #e5e7eb;
        }
        
        .faq-button {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        
        .faq-button h3 {
          font-size: 18px;
          font-weight: 500;
          color: #1a1a2e;
        }
        
        .faq-icon {
          font-size: 24px;
          color: #3B82F6;
          font-weight: 300;
        }
        
        .faq-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        
        .faq-content p {
          padding-bottom: 24px;
          color: #6b7280;
          font-size: 16px;
          line-height: 1.7;
        }
        
        /* ========== FOOTER STYLES ========== */
        .wp-footer {
          background: #1a1a2e;
          color: white;
          padding: 80px 0 40px;
        }
        
        .wp-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }
        
        .wp-footer-brand p {
          color: #9ca3af;
          font-size: 14px;
          margin-top: 16px;
          max-width: 300px;
        }
        
        .wp-footer h4 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #9ca3af;
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
          color: #d1d5db;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        
        .wp-footer-links a:hover {
          color: #3B82F6;
        }
        
        .wp-footer-bottom {
          border-top: 1px solid #374151;
          padding-top: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .wp-footer-bottom p {
          color: #6b7280;
          font-size: 14px;
        }
        
        .wp-footer-social {
          display: flex;
          gap: 16px;
        }
        
        .wp-footer-social a {
          color: #6b7280;
          transition: color 0.2s;
        }
        
        .wp-footer-social a:hover {
          color: #3B82F6;
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
          top: 65px;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 20px;
          z-index: 999;
        }
        
        .wp-mobile-menu.hidden {
          display: none;
        }
        
        .wp-mobile-menu a {
          display: block;
          padding: 12px 0;
          color: #4b5563;
          text-decoration: none;
          font-size: 16px;
        }
      `}} />

      <div className="wp-landing">
        {/* ========== NAVBAR SECTION ========== */}
        <nav className="wp-navbar">
          <div className="wp-container wp-navbar-inner">
            <img src="/placeholder.svg" alt="Jaxxis Logo" className="wp-logo" />
            
            <ul className="wp-nav-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
            
            <div className="wp-nav-buttons">
              <a href="/auth" className="wp-btn wp-btn-outline">Login</a>
              <a href="/auth" className="wp-btn wp-btn-primary">Get Started</a>
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
            <a href="#faq">FAQ</a>
            <a href="/auth">Login</a>
            <a href="/auth" className="wp-btn wp-btn-primary" style={{ display: 'inline-block', marginTop: '12px' }}>Get Started</a>
          </div>
        </nav>

        {/* ========== HERO SECTION ========== */}
        <section className="wp-hero">
          <div className="wp-container wp-hero-inner">
            <div className="wp-hero-content">
              <div className="wp-hero-badge">
                <span>✨</span>
                <span>AI-Powered Customer Support</span>
              </div>
              <h1>
                Transform Your Support with <span>Intelligent AI</span>
              </h1>
              <p>
                Deploy AI chatbots that understand your business, answer customer questions instantly, and integrate seamlessly with your existing tools.
              </p>
              <div className="wp-hero-buttons">
                <a href="/auth" className="wp-btn wp-btn-primary wp-btn-large">Start Free Trial</a>
                <a href="#features" className="wp-btn wp-btn-outline wp-btn-large">See How It Works</a>
              </div>
            </div>
            <div className="wp-hero-video-container">
              <video className="wp-hero-video" autoPlay muted loop playsInline>
                <source src="/hero-demo.webm" type="video/webm" />
              </video>
            </div>
          </div>
        </section>

        {/* ========== TRUST BADGES SECTION ========== */}
        <section className="wp-trust">
          <div className="wp-container">
            <p>Trusted by leading companies worldwide</p>
            <div className="wp-trust-logos">
              <img src="/placeholder.svg" alt="Company 1" className="wp-trust-logo" />
              <img src="/placeholder.svg" alt="Company 2" className="wp-trust-logo" />
              <img src="/placeholder.svg" alt="Company 3" className="wp-trust-logo" />
              <img src="/placeholder.svg" alt="Company 4" className="wp-trust-logo" />
              <img src="/placeholder.svg" alt="Company 5" className="wp-trust-logo" />
            </div>
          </div>
        </section>

        {/* ========== FEATURES SECTION ========== */}
        <section className="wp-features" id="features" ref={featuresRef}>
          <div className="wp-container">
            <div className="wp-features-header">
              <h2>Powerful Features</h2>
              <p>Everything you need to deliver exceptional customer support with AI</p>
            </div>
            <div className="wp-features-grid">
              <div className="wp-features-list">
                <div className="feature-card feature-active">
                  <h3>Smart Training</h3>
                  <p>Train your chatbot on your website, documents, and FAQs. It learns your business inside and out.</p>
                </div>
                <div className="feature-card">
                  <h3>Multi-Channel Support</h3>
                  <p>Deploy on your website, Facebook Messenger, Instagram, and more from a single dashboard.</p>
                </div>
                <div className="feature-card">
                  <h3>Human Handoff</h3>
                  <p>Seamlessly transfer complex conversations to your support team when needed.</p>
                </div>
                <div className="feature-card">
                  <h3>Analytics Dashboard</h3>
                  <p>Track performance, identify trends, and optimize your support with detailed insights.</p>
                </div>
              </div>
              <div className="wp-features-video-container">
                <video className="feature-video opacity-100" muted loop playsInline>
                  <source src="/feature-1.webm" type="video/webm" />
                </video>
                <video className="feature-video opacity-0" muted loop playsInline>
                  <source src="/feature-2.webm" type="video/webm" />
                </video>
                <video className="feature-video opacity-0" muted loop playsInline>
                  <source src="/feature-3.webm" type="video/webm" />
                </video>
                <video className="feature-video opacity-0" muted loop playsInline>
                  <source src="/feature-4.webm" type="video/webm" />
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* ========== PRICING SECTION ========== */}
        <section className="wp-pricing" id="pricing">
          <div className="wp-container">
            <div className="wp-pricing-header">
              <h2>Simple, Transparent Pricing</h2>
              <p>Start free, upgrade when you're ready</p>
            </div>
            <div className="wp-pricing-grid">
              <div className="wp-pricing-card">
                <h3>Starter</h3>
                <div className="price">$0<span>/month</span></div>
                <p className="description">Perfect for trying out our AI chatbot</p>
                <ul className="wp-pricing-features">
                  <li>1 Chatbot</li>
                  <li>100 messages/month</li>
                  <li>Basic customization</li>
                  <li>Email support</li>
                </ul>
                <a href="/auth" className="wp-btn wp-btn-outline wp-btn-full">Get Started</a>
              </div>
              <div className="wp-pricing-card popular">
                <div className="wp-popular-badge">Most Popular</div>
                <h3>Professional</h3>
                <div className="price">$49<span>/month</span></div>
                <p className="description">For growing businesses</p>
                <ul className="wp-pricing-features">
                  <li>5 Chatbots</li>
                  <li>5,000 messages/month</li>
                  <li>Advanced customization</li>
                  <li>Priority support</li>
                  <li>Analytics dashboard</li>
                </ul>
                <a href="/auth" className="wp-btn wp-btn-primary wp-btn-full">Start Free Trial</a>
              </div>
              <div className="wp-pricing-card">
                <h3>Enterprise</h3>
                <div className="price">$199<span>/month</span></div>
                <p className="description">For large organizations</p>
                <ul className="wp-pricing-features">
                  <li>Unlimited Chatbots</li>
                  <li>Unlimited messages</li>
                  <li>White-label solution</li>
                  <li>Dedicated support</li>
                  <li>Custom integrations</li>
                  <li>SLA guarantee</li>
                </ul>
                <a href="/auth" className="wp-btn wp-btn-outline wp-btn-full">Contact Sales</a>
              </div>
            </div>
          </div>
        </section>

        {/* ========== FAQ SECTION ========== */}
        <section className="wp-faq" id="faq" ref={faqRef}>
          <div className="wp-container">
            <div className="wp-faq-header">
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="wp-faq-list">
              <div className="faq-item">
                <button className="faq-button">
                  <h3>How does the AI chatbot learn about my business?</h3>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-content" style={{ maxHeight: 0 }}>
                  <p>Our AI analyzes your website content, uploaded documents, and custom FAQs to understand your products, services, and common customer questions. The more information you provide, the smarter your chatbot becomes.</p>
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-button">
                  <h3>Can I customize the chatbot's appearance?</h3>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-content" style={{ maxHeight: 0 }}>
                  <p>Yes! You can fully customize colors, fonts, avatar, position, and even the chatbot's personality and tone to match your brand perfectly.</p>
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-button">
                  <h3>What happens when the AI can't answer a question?</h3>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-content" style={{ maxHeight: 0 }}>
                  <p>When the AI encounters a question it can't confidently answer, it can seamlessly hand off the conversation to a human agent, collect contact information, or create a support ticket.</p>
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-button">
                  <h3>Is there a free trial available?</h3>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-content" style={{ maxHeight: 0 }}>
                  <p>Yes! Our Starter plan is completely free with 100 messages per month. You can upgrade anytime as your needs grow.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== FOOTER SECTION ========== */}
        <footer className="wp-footer">
          <div className="wp-container">
            <div className="wp-footer-grid">
              <div className="wp-footer-brand">
                <img src="/placeholder.svg" alt="Jaxxis" className="wp-logo" style={{ filter: 'brightness(0) invert(1)' }} />
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
                  <li><a href="#">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="wp-footer-bottom">
              <p>© 2024 Jaxxis. All rights reserved.</p>
              <div className="wp-footer-social">
                <a href="#">Twitter</a>
                <a href="#">LinkedIn</a>
                <a href="#">GitHub</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
