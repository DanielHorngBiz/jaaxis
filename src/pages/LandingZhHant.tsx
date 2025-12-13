import { useEffect, useRef } from "react";
import jaaxisLogo from "@/assets/jaxxis-logo.png";

const LandingZhHant = () => {
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

    // Language dropdown toggle
    const handleLangDropdownClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const langDropdown = document.getElementById('lang-dropdown');
      const langButton = document.getElementById('lang-button');
      
      // Toggle dropdown when clicking button
      if (langButton?.contains(target)) {
        e.preventDefault();
        langDropdown?.classList.toggle('open');
        return;
      }
      
      // Close dropdown when clicking outside
      if (!langDropdown?.contains(target)) {
        langDropdown?.classList.remove('open');
      }
    };
    
    document.addEventListener('click', handleLangDropdownClick);

    // GSAP ScrollTrigger for Features - only on desktop
    const initGSAP = () => {
      // Skip on mobile
      if (window.innerWidth < 1024) return;
      
      if (typeof window !== 'undefined' && (window as any).gsap && (window as any).ScrollTrigger) {
        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        const featuresSection = featuresRef.current;
        if (!featuresSection) return;

        const featureCards = featuresSection.querySelectorAll('.feature-card-wrapper');
        const featureVideos = featuresSection.querySelectorAll('.feature-video');
        const step = window.innerHeight * 1.2;
        const totalScrollDistance = featureCards.length * step;

        // Set first video and card as active initially
        featureCards[0]?.classList.add('feature-active');
        featureVideos[0]?.classList.add('opacity-100');
        (featureVideos[0] as HTMLVideoElement)?.play?.();

        ScrollTrigger.create({
          trigger: featuresSection,
          start: "top top",
          end: `+=${totalScrollDistance + window.innerHeight * 0.5}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self: any) => {
            const progress = self.progress;
            const exactPosition = progress * featureCards.length;
            const activeIndex = Math.min(
              Math.floor(exactPosition),
              featureCards.length - 1
            );
            // Calculate progress within current feature (0-400 for strokeDashoffset)
            const progressWithinFeature = (exactPosition - activeIndex) * 400;

            featureCards.forEach((card: Element, i: number) => {
              const progressRect = card.querySelector('rect') as SVGRectElement;
              
              if (i === activeIndex) {
                card.classList.add('feature-active');
                card.classList.remove('feature-inactive');
                // Animate the progress border
                if (progressRect) {
                  progressRect.style.strokeDashoffset = String(400 - progressWithinFeature);
                }
                // Play video
                const video = featureVideos[i] as HTMLVideoElement;
                if (video) {
                  video.classList.remove('opacity-0');
                  video.classList.add('opacity-100');
                  video.play?.();
                }
              } else if (i < activeIndex) {
                // Completed features - full border
                card.classList.remove('feature-active');
                card.classList.add('feature-inactive');
                if (progressRect) {
                  progressRect.style.strokeDashoffset = '0';
                }
                const video = featureVideos[i] as HTMLVideoElement;
                if (video) {
                  video.classList.add('opacity-0');
                  video.classList.remove('opacity-100');
                  video.pause?.();
                }
              } else {
                // Future features - no border
                card.classList.remove('feature-active');
                card.classList.remove('feature-inactive');
                if (progressRect) {
                  progressRect.style.strokeDashoffset = '400';
                }
                const video = featureVideos[i] as HTMLVideoElement;
                if (video) {
                  video.classList.add('opacity-0');
                  video.classList.remove('opacity-100');
                  video.pause?.();
                }
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
        stScript.onload = () => {
          // Small delay to ensure DOM is ready
          setTimeout(initGSAP, 100);
        };
        document.head.appendChild(stScript);
      };
      document.head.appendChild(gsapScript);
    } else {
      setTimeout(initGSAP, 100);
    }

    // Cleanup
    return () => {
      document.removeEventListener('click', handleLangDropdownClick);
      if ((window as any).ScrollTrigger) {
        (window as any).ScrollTrigger.getAll().forEach((t: any) => t.kill());
      }
    };
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
        
        .feature-card-wrapper.feature-active .feature-card {
          border-color: var(--wp-primary);
          background: rgba(var(--wp-primary-rgb), 0.05);
          box-shadow: 0 4px 20px rgba(var(--wp-primary-rgb), 0.1);
        }
        
        .feature-card-wrapper.feature-inactive .feature-card {
          opacity: 0.5;
        }
        
        .feature-card h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--wp-foreground);
          transition: color 0.3s;
        }
        
        .feature-card-wrapper.feature-inactive h3 {
          color: rgba(26, 26, 46, 0.7);
        }
        
        /* Progress border SVG */
        .feature-card-wrapper {
          position: relative;
        }
        
        .feature-progress-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .feature-card-wrapper:not(.feature-active) .feature-progress-svg {
          display: none;
        }
        
        /* Collapsible description */
        .feature-description {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease, margin-top 0.3s ease;
          margin-top: 0;
        }
        
        .feature-card-wrapper.feature-active .feature-description {
          grid-template-rows: 1fr;
          margin-top: 12px;
        }
        
        .feature-description-inner {
          overflow: hidden;
        }
        
        .feature-description p {
          font-size: 14px;
          color: var(--wp-muted);
          line-height: 1.6;
          margin: 0;
        }
        
        .wp-features-video-container {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--wp-border);
          background: var(--wp-foreground);
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
        
        .feature-video {
          width: 100%;
          height: auto;
          display: block;
          transition: opacity 0.5s;
        }
        
        .feature-video:not(:first-child) {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
        }
        
        .feature-video.opacity-0 {
          opacity: 0;
          pointer-events: none;
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
          border-top: 1px solid var(--wp-border);
          padding: 64px 24px;
          background: hsl(var(--secondary) / 0.3);
        }
        
        .wp-footer-inner {
          max-width: 1024px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }
        
        @media (min-width: 768px) {
          .wp-footer-inner {
            flex-direction: row;
            justify-content: space-between;
          }
        }
        
        .wp-footer-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .wp-footer-brand {
          margin-bottom: 24px;
        }
        
        .wp-footer-brand p {
          color: var(--wp-muted);
          font-size: 14px;
          margin-top: 24px;
        }
        
        .wp-footer-social {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .wp-lang-dropdown {
          position: relative;
        }
        
        .wp-lang-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--wp-background);
          border: 1px solid var(--wp-border);
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 14px;
          color: var(--wp-foreground);
          cursor: pointer;
          transition: all 0.2s;
          width: 110px;
        }
        
        .wp-lang-button:hover {
          border-color: var(--wp-primary);
          background: rgba(var(--wp-primary-rgb), 0.02);
        }
        
        .wp-lang-button svg {
          margin-left: auto;
          transition: transform 0.2s;
        }
        
        .wp-lang-dropdown.open .wp-lang-button svg {
          transform: rotate(180deg);
        }
        
        .wp-lang-menu {
          position: absolute;
          bottom: 100%;
          left: 0;
          margin-bottom: 4px;
          background: var(--wp-background);
          border: 1px solid var(--wp-border);
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          width: 110px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(8px);
          transition: all 0.2s;
          z-index: 100;
          overflow: hidden;
        }
        
        .wp-lang-dropdown.open .wp-lang-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .wp-lang-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          font-size: 14px;
          color: var(--wp-foreground);
          cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
        }
        
        .wp-lang-option:hover {
          background: var(--wp-secondary);
        }
        
        .wp-lang-option.active {
          background: rgba(var(--wp-primary-rgb), 0.08);
          color: var(--wp-primary);
        }
        
        .wp-lang-option:not(.active):hover {
          color: var(--wp-foreground);
        }
        
        .wp-lang-option svg {
          width: 16px;
          height: 16px;
          opacity: 0;
        }
        
        .wp-lang-option.active svg {
          opacity: 1;
        }
        
        .wp-footer-social a {
          color: var(--wp-primary);
          transition: opacity 0.2s;
        }
        
        .wp-footer-social a:hover {
          opacity: 0.8;
        }
        
        .wp-footer-nav {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 48px;
        }
        
        @media (min-width: 768px) {
          .wp-footer-nav {
            grid-template-columns: repeat(3, 1fr);
            gap: 64px;
          }
        }
        
        .wp-footer h3 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--wp-foreground);
        }
        
        .wp-footer-links {
          list-style: none;
        }
        
        .wp-footer-links li {
          margin-bottom: 12px;
        }
        
        .wp-footer-links a {
          color: var(--wp-muted);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        
        .wp-footer-links a:hover {
          color: var(--wp-foreground);
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
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 999;
        }
        
        .wp-mobile-menu.hidden {
          display: none;
        }
        
        .wp-mobile-menu a {
          color: var(--wp-muted);
          text-decoration: none;
          font-size: 14px;
          padding: 12px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        
        .wp-mobile-menu a:hover {
          color: var(--wp-foreground);
          background: var(--wp-secondary);
        }
      `}} />

      <div className="wp-landing">
        {/* ========== HEADER ========== */}
        <header>
        <nav className="wp-navbar">
          <div className="wp-navbar-inner">
            <a href="/zh-hant">
              <img src={jaaxisLogo} alt="Jaaxis" className="wp-logo" />
            </a>
            
            <ul className="wp-nav-links">
              <li><a href="#features">功能特色</a></li>
              <li><a href="#pricing">價格方案</a></li>
              <li><a href="#faq">使用指南</a></li>
            </ul>
            
            <div className="wp-nav-buttons">
              <a href="/auth" className="wp-btn wp-btn-ghost">登入</a>
              <a href="/auth" className="wp-btn wp-btn-primary">註冊</a>
            </div>
            
            <button className="wp-mobile-menu-btn" id="mobile-menu-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>
          
          <div className="wp-mobile-menu hidden" id="mobile-menu">
            <a href="#features">功能特色</a>
            <a href="#pricing">價格方案</a>
            <a href="#faq">使用指南</a>
            <a href="/auth">登入</a>
            <a href="/auth" className="wp-btn wp-btn-primary" style={{ marginTop: '12px' }}>註冊</a>
          </div>
        </nav>
        </header>

        {/* ========== HERO (Centered like original) ========== */}
        <section className="wp-hero">
          <div className="wp-hero-inner">
            <h1>
              AI 客服支援<br />
              <span>真正有效的解決方案</span>
            </h1>
            <p className="wp-hero-subtitle">
              透過智能 AI 自動化客戶對話，理解上下文、即時解決問題，並隨著您的業務規模擴展。
            </p>
            <div className="wp-hero-buttons">
              <a href="#pricing" className="wp-btn wp-btn-primary wp-btn-lg">
                免費開始使用
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
                <span>超過 10,000+ 團隊信賴使用</span>
              </div>
              <div className="wp-dot"></div>
              <span>★★★★★ 4.9/5 評分</span>
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
            <div className="wp-section-badge">功能特色</div>
            <h2>現代化客服的<br />強大功能</h2>
          </div>
          <div className="wp-features-grid">
            <div className="wp-features-list">
              <div className="feature-card-wrapper feature-active" data-progress="0">
                <svg className="feature-progress-svg" preserveAspectRatio="none">
                  <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" rx="12" fill="none" stroke="hsl(221, 83%, 53%)" strokeWidth="3" pathLength="400" strokeDasharray="400" strokeDashoffset="400" strokeLinecap="round" style={{ opacity: 0.8 }} />
                </svg>
                <div className="feature-card">
                  <h3>分鐘內快速上線</h3>
                  <div className="feature-description">
                    <div className="feature-description-inner">
                      <p>將您的文件轉換為 AI 智能客服，即時部署至網站、Messenger 和 Instagram。</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="feature-card-wrapper" data-progress="0">
                <svg className="feature-progress-svg" preserveAspectRatio="none">
                  <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" rx="12" fill="none" stroke="hsl(221, 83%, 53%)" strokeWidth="3" pathLength="400" strokeDasharray="400" strokeDashoffset="400" strokeLinecap="round" style={{ opacity: 0.8 }} />
                </svg>
                <div className="feature-card">
                  <h3>智慧電商整合</h3>
                  <div className="feature-description">
                    <div className="feature-description-inner">
                      <p>連接 Shopify 和 WooCommerce，讓 AI 自動處理訂單、退款和客戶支援。</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="feature-card-wrapper" data-progress="0">
                <svg className="feature-progress-svg" preserveAspectRatio="none">
                  <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" rx="12" fill="none" stroke="hsl(221, 83%, 53%)" strokeWidth="3" pathLength="400" strokeDasharray="400" strokeDashoffset="400" strokeLinecap="round" style={{ opacity: 0.8 }} />
                </svg>
                <div className="feature-card">
                  <h3>從對話中持續學習</h3>
                  <div className="feature-description">
                    <div className="feature-description-inner">
                      <p>編輯過去的對話來改善回應。無需額外訓練，修改即時生效。</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="feature-card-wrapper" data-progress="0">
                <svg className="feature-progress-svg" preserveAspectRatio="none">
                  <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" rx="12" fill="none" stroke="hsl(221, 83%, 53%)" strokeWidth="3" pathLength="400" strokeDasharray="400" strokeDashoffset="400" strokeLinecap="round" style={{ opacity: 0.8 }} />
                </svg>
                <div className="feature-card">
                  <h3>無縫真人接手</h3>
                  <div className="feature-description">
                    <div className="feature-description-inner">
                      <p>設定自訂規則，將複雜案例轉交給您的團隊，同時自動收集客戶資訊。</p>
                    </div>
                  </div>
                </div>
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
            <div className="wp-section-badge">價格方案</div>
            <h2>簡單透明的定價</h2>
            <p>選擇適合您業務的方案。所有方案都包含核心功能。</p>
          </div>
          <div className="wp-pricing-grid">
            <div className="wp-pricing-card">
              <h3>基本版</h3>
              <div className="price">$19<span>/月</span></div>
              <a href="/auth" className="wp-btn wp-btn-outline wp-btn-full">7 天免費試用</a>
              <ul className="wp-pricing-features">
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>每月 300 次回覆</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>1 個 AI 機器人</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>無限知識庫</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>所有整合功能</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>每 100 次額外回覆 $10</li>
              </ul>
            </div>
            <div className="wp-pricing-card popular">
              <div className="wp-popular-badge">最受歡迎</div>
              <h3>專業版</h3>
              <div className="price">$49<span>/月</span></div>
              <a href="/auth" className="wp-btn wp-btn-primary wp-btn-full">立即開始</a>
              <ul className="wp-pricing-features">
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>每月 3000 次回覆</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>3 個 AI 機器人</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>無限知識庫</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>所有整合功能</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>每 100 次額外回覆 $10</li>
              </ul>
            </div>
            <div className="wp-pricing-card">
              <h3>企業版</h3>
              <div className="price">$149<span>/月</span></div>
              <a href="/auth" className="wp-btn wp-btn-outline wp-btn-full">立即開始</a>
              <ul className="wp-pricing-features">
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>每月 15,000 次回覆</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>5 個 AI 機器人</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>無限知識庫</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>所有整合功能</li>
                <li><svg className="wp-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>每 100 次額外回覆 $10</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========== FAQ ========== */}
        <section className="wp-faq" id="faq" ref={faqRef}>
          <div className="wp-faq-header">
            <div className="wp-section-badge">常見問題</div>
            <h2>常見問題解答</h2>
            <p>關於 Jaaxis 您需要知道的一切。</p>
          </div>
          <div className="wp-faq-list">
            <div className="faq-item">
              <button className="faq-button">
                <h3>什麼是 Jaaxis？</h3>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-content" style={{ maxHeight: 0 }}>
                <p>Jaaxis 是一個先進的 AI 驅動客服聊天機器人平台，幫助企業自動化客戶互動、提供即時回應，並有效擴展客服營運規模。</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-button">
                <h3>Jaaxis 可以免費使用嗎？</h3>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-content" style={{ maxHeight: 0 }}>
                <p>我們提供免費試用讓您開始使用。之後，我們有彈性的定價方案，從小型企業的每月 $19 到大型組織的企業解決方案。</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-button">
                <h3>使用 Jaaxis 需要安裝軟體嗎？</h3>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-content" style={{ maxHeight: 0 }}>
                <p>不需要安裝！Jaaxis 是雲端解決方案，直接在您的網頁瀏覽器中運作。只需在您的網站上嵌入我們的聊天機器人小工具，或與您偏好的平台整合即可。</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-button">
                <h3>我的資料在 Jaaxis 中有多安全？</h3>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-content" style={{ maxHeight: 0 }}>
                <p>安全是我們的首要任務。我們使用銀行級加密，符合 GDPR 和 SOC 2 等行業標準，並以先進的安全措施確保您的資料受到保護。</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-button">
                <h3>我會擁有自己的資料嗎？</h3>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-content" style={{ maxHeight: 0 }}>
                <p>是的，絕對是！您保留所有資料、對話和內容的完整所有權。我們永遠不會使用您的資料來訓練其他客戶的模型。</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== FOOTER ========== */}
        <footer className="wp-footer">
          <div className="wp-footer-inner">
            <div className="wp-footer-left">
              <div className="wp-footer-brand">
                <img src={jaaxisLogo} alt="Jaaxis" className="wp-logo" style={{ height: '32px' }} />
                <p>© 2025 版權所有。</p>
              </div>
              
              <div className="wp-footer-social">
                <div className="wp-lang-dropdown" id="lang-dropdown">
                  <button className="wp-lang-button" id="lang-button" type="button">
                    <span id="lang-current">繁體中文</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div className="wp-lang-menu">
                    <a href="/" className="wp-lang-option">
                      <span>English</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </a>
                    <a href="/zh-hant" className="wp-lang-option active">
                      <span>繁體中文</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>
                <a href="#">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="#">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="wp-footer-nav">
              <div>
                <h3>產品</h3>
                <ul className="wp-footer-links">
                  <li><a href="#pricing">價格方案</a></li>
                  <li><a href="#features">功能特色</a></li>
                  <li><a href="#">成功案例</a></li>
                </ul>
              </div>

              <div>
                <h3>資源</h3>
                <ul className="wp-footer-links">
                  <li><a href="#">聯絡我們</a></li>
                  <li><a href="#">使用指南</a></li>
                </ul>
              </div>

              <div>
                <h3>公司</h3>
                <ul className="wp-footer-links">
                  <li><a href="#">隱私權政策</a></li>
                  <li><a href="#">服務條款</a></li>
                  <li><a href="#">信任與安全</a></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingZhHant;
