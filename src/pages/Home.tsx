import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, setDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Globe, Smartphone, Palette, Calculator, Video, Camera, Aperture, Navigation, Sliders, MonitorPlay } from 'lucide-react';
import { FaWhatsapp, FaFacebookMessenger, FaGithub, FaPhone } from 'react-icons/fa6';
import '../index.css';
import { translations } from '../translations';
import type { Language } from '../translations';
import { Link } from 'react-router-dom';
import { fallbackProjects } from '../data/fallbackProjects';

function Home() {
  const [lang, setLang] = useState<Language>('ENG');
  const t = translations[lang];

  useEffect(() => {
    const trackVisitor = async () => {
      const hasVisited = sessionStorage.getItem('hasVisited');
      // Check for common web crawlers/bots
      const isBot = /bot|googlebot|crawler|spider|robot|crawling|bingbot|yandex|duckduckbot/i.test(navigator.userAgent);
      
      if (!hasVisited && !isBot) {
        try {
          const statsRef = doc(db, 'stats', 'visitors');
          await setDoc(statsRef, { count: increment(1) }, { merge: true });
          sessionStorage.setItem('hasVisited', 'true');
        } catch (error) {
          console.error("Error tracking visitor:", error);
        }
      }
    };
    trackVisitor();
  }, []);

  const rolesData = [
    { name: t.roles.webDeveloper, icon: <Globe size={40} strokeWidth={1.5} /> },
    { name: t.roles.appsDeveloper, icon: <Smartphone size={40} strokeWidth={1.5} /> },
    { name: t.roles.graphicDesigner, icon: <Palette size={40} strokeWidth={1.5} /> },
    { name: t.roles.accountBookKeeper, icon: <Calculator size={40} strokeWidth={1.5} /> },
    { name: t.roles.videoEditor, icon: <Video size={40} strokeWidth={1.5} /> },
    { name: t.roles.photographer, icon: <Camera size={40} strokeWidth={1.5} /> },
    { name: t.roles.instructor, icon: <MonitorPlay size={40} strokeWidth={1.5} /> }
  ];

  const gearData = [
    {
      id: "camera",
      name: t.toolkit.gear.camera.name,
      description: t.toolkit.gear.camera.desc,
      icon: <Camera size={36} strokeWidth={1.5} />,
      tags: ["4K Cinematic", "Full Frame", "Log Profiles"]
    },
    {
      id: "lenses",
      name: t.toolkit.gear.lenses.name,
      description: t.toolkit.gear.lenses.desc,
      icon: <Aperture size={36} strokeWidth={1.5} />,
      tags: ["F/1.8 Prime", "Wide & Zoom", "Crisp Focus"]
    },
    {
      id: "drone",
      name: t.toolkit.gear.drone.name,
      description: t.toolkit.gear.drone.desc,
      icon: <Navigation size={36} strokeWidth={1.5} style={{ transform: 'rotate(45deg)' }} />,
      tags: ["4K Bird's Eye", "Active Tracking", "60 FPS Video"]
    },
    {
      id: "gimbal",
      name: t.toolkit.gear.gimbal.name,
      description: t.toolkit.gear.gimbal.desc,
      icon: <Sliders size={36} strokeWidth={1.5} />,
      tags: ["3-Axis Balance", "Active Stabilization", "Dynamic Tracking"]
    }
  ];

  const roles = rolesData.map(r => r.name);

  const [activeRole, setActiveRole] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preloaderStage, setPreloaderStage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [dynamicProjects, setDynamicProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('sortOrder', 'asc'));
        const querySnapshot = await getDocs(q);
        const fetchedProjects: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProjects.push({ id: doc.id, ...doc.data() });
        });
        if (fetchedProjects.length === 0) {
          console.warn("No projects found in Firebase, using fallback static projects.");
          setDynamicProjects(fallbackProjects);
        } else {
          setDynamicProjects(fetchedProjects);
        }
      } catch (error) {
        console.error("Error fetching projects: ", error);
        console.warn("Fallback to static projects due to error.");
        setDynamicProjects(fallbackProjects);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRole((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [roles.length]);

  useEffect(() => {
    const startTime = Date.now();
    const MIN_DURATION = 600; // minimum aesthetic display time (ms)
    let pageReady = false;
    let intervalDone = false;

    const finish = () => {
      if (!pageReady || !intervalDone) return;
      setIsExiting(true);
      setTimeout(() => setIsLoaded(true), 400);
      setTimeout(() => setLoading(false), 900);
    };

    // Listen for the page to fully load (images + all resources)
    const onLoad = () => {
      pageReady = true;
      finish();
    };
    if (document.readyState === 'complete') {
      pageReady = true;
    } else {
      window.addEventListener('load', onLoad);
    }

    // Animate progress over MIN_DURATION, then signal interval done
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min(Math.floor((elapsed / MIN_DURATION) * 100), 100);

      setProgress(progressPercent);

      if (progressPercent < 30) {
        setPreloaderStage(1);
      } else if (progressPercent < 60) {
        setPreloaderStage(2);
      } else if (progressPercent < 85) {
        setPreloaderStage(3);
      } else {
        setPreloaderStage(4);
      }

      if (elapsed >= MIN_DURATION) {
        clearInterval(interval);
        intervalDone = true;
        finish();
      }
    }, 30);

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      const sections = ['about', 'frameworks', 'work', 'toolkit', 'contact'];
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal-element');
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [loading]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getStatusText = () => {
    if (preloaderStage === 0) return t.preloader.initializing;
    if (preloaderStage === 1) return t.preloader.loadingCreativeAssets;
    if (preloaderStage === 2) return t.preloader.optimizingLayout;
    if (preloaderStage === 3) return t.preloader.calibratingGear;
    return t.preloader.enteringPortfolio;
  }

  return (
    <div className={`${isLoaded ? 'animate-page-reveal' : ''} ${lang === 'NEP' ? 'lang-nep' : ''}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Premium Preloader Overlay */}
      {loading && (
        <div className={`preloader-overlay ${isExiting ? 'exit' : ''}`}>
          <div className="preloader-content">
            <h1 className="preloader-logo">
              Mahesh <span>Shakya</span>
            </h1>
            <div className="preloader-progress-container">
              <div
                className="preloader-progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="preloader-percentage">
              {progress.toString().padStart(3, '0')}%
            </div>
            <div className="preloader-status">
              {getStatusText()}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        className={`glass-panel nav-container ${isLoaded ? 'animate-slide-down' : 'init-hidden'}`}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>Mahesh <span style={{ color: 'white' }}>Shakya</span></h1>

        <div className="nav-center">
          <div className="nav-links">
            <a href="#about" className={activeSection === 'about' ? 'active' : ''}>{t.nav.about}</a>
            <a href="#frameworks" className={activeSection === 'frameworks' ? 'active' : ''}>{t.nav.frameworks}</a>
            <a href="#work" className={activeSection === 'work' ? 'active' : ''}>{t.nav.work}</a>
            <a href="#toolkit" className={activeSection === 'toolkit' ? 'active' : ''}>{t.nav.toolkit}</a>
            <a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>{t.nav.contact}</a>
          </div>
        </div>

        <div className="lang-toggle">
          <button
            className={`lang-btn ${lang === 'ENG' ? 'active' : ''}`}
            onClick={() => setLang('ENG')}
          >
            ENG
          </button>
          <div className="lang-divider">|</div>
          <button
            className={`lang-btn ${lang === 'NEP' ? 'active' : ''}`}
            onClick={() => setLang('NEP')}
          >
            NEP
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main id="about" className="hero-section">
        <div className="hero-content-wrapper">

          <div
            className={`hero-text ${isLoaded ? 'animate-premium-fade-up' : 'init-hidden'}`}
            style={{ animationDelay: '0.15s' }}
          >
            <h2 style={{ fontSize: '1.2rem', color: 'var(--accent)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' }}>{t.hero.greeting}</h2>
            <h1 className="hero-title">
              {t.hero.prefix} <br />
              <span key={activeRole} className="gradient-text role-animate">{roles[activeRole]}</span>
            </h1>
            <p className="hero-subtitle">
              {t.hero.subtitle}
            </p>
            <div className="hero-buttons">
              <a href="#work" className="btn-primary">{t.hero.btnWork}</a>
              <div className="social-links-group">
                <a href="https://github.com/shakyamtech" target="_blank" rel="noopener noreferrer" className="btn-social btn-github">
                  <FaGithub size={20} /> GitHub
                </a>
                <a href="https://wa.me/9779851180556" target="_blank" rel="noopener noreferrer" className="btn-social btn-whatsapp">
                  <FaWhatsapp size={20} /> WhatsApp
                </a>
                <a href="https://m.me/mahesh.shakya.official.np" target="_blank" rel="noopener noreferrer" className="btn-social btn-messenger">
                  <FaFacebookMessenger size={20} /> Messenger
                </a>
                <a href="tel:+9779851180556" className="btn-social btn-phone">
                  <FaPhone size={20} /> Call
                </a>
              </div>
            </div>
          </div>

          <div
            className={`hero-image-wrapper ${isLoaded ? 'animate-scale-in' : 'init-hidden'}`}
            style={{ animationDelay: '0.35s' }}
          >
            <div 
              className="glass-panel hero-image-container"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
            >
              <div className="hero-image-crop">
                <img src="/images/profile_avatar.jpg" alt="Mahesh Shakya Avatar" className="hero-image" />
              </div>
            </div>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="roles-grid">
          {rolesData.map((role, idx) => (
            <div
              key={idx}
              className={`glass-panel role-card ${isLoaded ? 'animate-stagger-fade-up' : 'init-hidden'}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animationDelay: `${0.55 + idx * 0.15}s`
              }}
            >
              <div style={{ color: 'var(--accent)', marginBottom: '15px' }}>
                {role.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>{role.name}</h3>
            </div>
          ))}
        </div>
      </main>

      {/* Frameworks & Technologies Section */}
      <section id="frameworks" className="reveal-element" style={{ padding: '100px 20px', background: 'var(--bg-secondary)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title"><span className="gradient-text">{t.frameworks.title}</span></h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '620px', margin: '-30px auto 60px auto', lineHeight: 1.7, fontSize: '1.1rem' }}>
            {t.frameworks.subtitle}
          </p>

          <div className="frameworks-grid">
            {/* React / React Native */}
            <div className="glass-panel framework-card">
              <div className="framework-icon-wrap" style={{ background: 'rgba(97, 218, 251, 0.08)', color: '#61DAFB' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 17.5c-4.14 0-7.5-3.36-7.5-7.5S7.86 4.5 12 4.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5Z" /></svg>
              </div>
              <span className="framework-name">React / React Native</span>
              <span className="framework-tag">{t.frameworks.tags.frontendMobile}</span>
            </div>

            {/* Next.js */}
            <div className="glass-panel framework-card">
              <div className="framework-icon-wrap" style={{ background: 'rgba(255,255,255,0.06)', color: '#FFFFFF' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0Z" /></svg>
              </div>
              <span className="framework-name">Next.js</span>
              <span className="framework-tag">{t.frameworks.tags.fullStack}</span>
            </div>

            {/* Vue.js */}
            <div className="glass-panel framework-card">
              <div className="framework-icon-wrap" style={{ background: 'rgba(66, 184, 131, 0.08)', color: '#42B883' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M24 1.61h-9.94L12 5.16 9.94 1.61H0l12 20.78L24 1.61ZM12 14.08 5.16 2.23H9.59L12 6.41l2.41-4.18h4.43L12 14.08Z" /></svg>
              </div>
              <span className="framework-name">Vue.js</span>
              <span className="framework-tag">{t.frameworks.tags.frontend}</span>
            </div>

            {/* Flutter */}
            <div className="glass-panel framework-card">
              <div className="framework-icon-wrap" style={{ background: 'rgba(84, 197, 248, 0.08)', color: '#54C5F8' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37zm.159 11.786l-6.729 6.734 6.729 6.72H21.7l-6.74-6.72 6.74-6.734h-7.227z" /></svg>
              </div>
              <span className="framework-name">Flutter</span>
              <span className="framework-tag">{t.frameworks.tags.crossPlatform}</span>
            </div>

            {/* Node.js */}
            <div className="glass-panel framework-card">
              <div className="framework-icon-wrap" style={{ background: 'rgba(104, 160, 99, 0.08)', color: '#68A063' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M11.998 24a2.01 2.01 0 0 1-1.006-.269l-3.204-1.898c-.479-.268-.245-.363-.087-.418.638-.222.765-.272 1.443-.657a.247.247 0 0 1 .239.017l2.462 1.461a.318.318 0 0 0 .296 0l9.598-5.54a.317.317 0 0 0 .148-.271V7.562a.317.317 0 0 0-.148-.272l-9.596-5.537a.317.317 0 0 0-.297 0L2.249 7.29a.317.317 0 0 0-.149.272v11.077c0 .111.06.215.149.271l2.628 1.518c1.427.713 2.301-.127 2.301-.972V8.358a.285.285 0 0 1 .285-.285h1.248a.285.285 0 0 1 .285.285v11.097c0 1.901-1.035 2.993-2.834 2.993-.553 0-.99 0-2.207-.6l-2.511-1.448A2.02 2.02 0 0 1 .24 18.638V7.562a2.02 2.02 0 0 1 1.007-1.75L10.845.274a2.096 2.096 0 0 1 2.011 0l9.598 5.538A2.02 2.02 0 0 1 23.76 7.562v11.077a2.02 2.02 0 0 1-1.007 1.75l-9.598 5.542A2.01 2.01 0 0 1 11.998 24Z" /></svg>
              </div>
              <span className="framework-name">Node.js / Express</span>
              <span className="framework-tag">{t.frameworks.tags.backendRuntime}</span>
            </div>

            {/* Laravel */}
            <div className="glass-panel framework-card">
              <div className="framework-icon-wrap" style={{ background: 'rgba(255, 45, 32, 0.08)', color: '#FF2D20' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M23.642 5.43a.364.364 0 0 1 .014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 0 1-.188.326L9.93 23.949a.316.316 0 0 1-.066.027.29.29 0 0 1-.146 0 .348.348 0 0 1-.069-.027L.534 18.755a.376.376 0 0 1-.19-.326V2.974c0-.036.003-.073.014-.11a.37.37 0 0 1 .014-.036l.002-.008a.354.354 0 0 1 .029-.048.381.381 0 0 1 .026-.03.336.336 0 0 1 .04-.033.41.41 0 0 1 .073-.05L4.916.17a.378.378 0 0 1 .378 0l4.378 2.528a.378.378 0 0 1 .19.326v4.934l3.944-2.272V1.152a.377.377 0 0 1 .188-.326L18.37.17a.378.378 0 0 1 .378 0l4.753 2.744a.378.378 0 0 1 .14.516z" /></svg>
              </div>
              <span className="framework-name">Laravel / PHP</span>
              <span className="framework-tag">{t.frameworks.tags.backend}</span>
            </div>

            {/* Django */}
            <div className="glass-panel framework-card">
              <div className="framework-icon-wrap" style={{ background: 'rgba(9, 46, 22, 0.3)', color: '#44B78B' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.097.535-4.791 0-7.288-2.166-7.288-6.32 0-4.002 2.65-6.6 6.753-6.6.637 0 1.121.05 1.708.204V0zm0 9.143a3.894 3.894 0 0 0-1.32-.204c-1.99 0-3.138 1.223-3.138 3.364 0 2.091 1.097 3.239 3.113 3.239.434 0 .789-.025 1.345-.102V9.142zM21.314 6.06v11.683c0 4.034-.306 5.97-1.218 7.637-.847 1.617-1.97 2.64-4.289 3.76l-3.644-1.72c2.319-1.07 3.442-2.04 4.136-3.506.745-1.49.992-3.16.992-7.663V6.06h4.023zM17.19 0h4.024v4.127H17.19z" /></svg>
              </div>
              <span className="framework-name">Django / Python</span>
              <span className="framework-tag">{t.frameworks.tags.backend}</span>
            </div>

            {/* Vite */}
            <div className="glass-panel framework-card">
              <div className="framework-icon-wrap" style={{ background: 'rgba(189, 52, 254, 0.08)', color: '#BD34FE' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M24 0L14.6161 21.7454L11.4576 15.1176L18.1176 0H24ZM7.17647 0L13.5294 13.0588L10.2353 20.2353L0 0H7.17647Z" /></svg>
              </div>
              <span className="framework-name">Vite</span>
              <span className="framework-tag">{t.frameworks.tags.buildTool}</span>
            </div>

            {/* Tailwind CSS */}
            <div className="glass-panel framework-card">
              <div className="framework-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.08)', color: '#06B6D4' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" /></svg>
              </div>
              <span className="framework-name">Tailwind CSS</span>
              <span className="framework-tag">{t.frameworks.tags.cssFramework}</span>
            </div>

            {/* Firebase */}
            <div className="glass-panel framework-card">
              <div className="framework-icon-wrap" style={{ background: 'rgba(255, 196, 0, 0.08)', color: '#FFC400' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M3.89 15.672L6.255.461A.542.542 0 0 1 7.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 0 0-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 0 0 1.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 0 0-.96 0L3.53 17.984z" /></svg>
              </div>
              <span className="framework-name">Firebase / Supabase</span>
              <span className="framework-tag">{t.frameworks.tags.baas}</span>
            </div>

            {/* MongoDB */}
            <div className="glass-panel framework-card">
              <div className="framework-icon-wrap" style={{ background: 'rgba(0, 237, 100, 0.08)', color: '#00ED64' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0 1 11.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 0 0 3.639-8.464c.01-.814-.103-1.662-.197-2.218z" /></svg>
              </div>
              <span className="framework-name">MongoDB / MySQL</span>
              <span className="framework-tag">{t.frameworks.tags.database}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Work Section */}
      <section id="work" className="reveal-element" style={{ padding: '100px 20px', background: 'var(--bg-primary)', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title"><span className="gradient-text">{t.work.title}</span></h2>

          <div className="work-grid">
            {loadingProjects ? (
               <div style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1 / -1', padding: '40px 0' }}>Loading projects...</div>
            ) : dynamicProjects.length > 0 ? (
              dynamicProjects.slice(0, 12).map((project) => (
                <div 
                  key={project.id} 
                  className="premium-project-card"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                  }}
                >
                  <div className="premium-project-card-inner">
                    <div className="premium-image-wrapper">
                      <img src={project.imageUrl} alt={project.title} loading="lazy" width="800" height="240" />
                    </div>
                    <div className="premium-card-content">
                      <div className="project-badge">{project.tag}</div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px 0', color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.3 }}>{project.title}</h3>
                      <p className="line-clamp-3" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, fontSize: '0.9rem', marginBottom: '0' }}>{project.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', alignItems: 'center' }}>
                        <Link to={`/project/${project.id}`} className="btn-read-more">Read More <span>→</span></Link>
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-live-app" title={t.work.btnViewApp}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
               <div style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1 / -1', padding: '40px 0' }}>No projects found. Please add some from the Admin Panel.</div>
            )}
          </div>
          
          {/* View All Projects Button */}
          {!loadingProjects && dynamicProjects.length > 12 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
              <Link to="/projects" className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem', letterSpacing: '1px' }}>
                {t.work.btnViewAll || 'View All Projects'} <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* The Creative Toolkit Section */}
      <section id="toolkit" className="reveal-element" style={{ padding: '100px 20px', background: 'var(--bg-secondary)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title"><span className="gradient-text">{t.toolkit.title}</span></h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '640px', margin: '-30px auto 60px auto', lineHeight: 1.7, fontSize: '1.1rem' }}>
            {t.toolkit.subtitle}
          </p>
          <div className="toolkit-grid">
            {gearData.map((gear, idx) => (
              <div key={idx} className="glass-panel toolkit-card">
                <div style={{ color: 'var(--accent)', display: 'inline-flex', padding: '15px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.05)', width: 'fit-content' }}>
                  {gear.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>{gear.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '20px' }}>{gear.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
                    {gear.tags.map((tag, tIdx) => (
                      <span key={tIdx} style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="reveal-element" style={{ padding: '60px 20px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'var(--bg-primary)' }}>
        <h2 className="section-title" style={{ marginBottom: '20px' }}>{t.contact.titlePrefix} <span className="gradient-text">{t.contact.titleHighlight}</span></h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
          {t.contact.subtitle}
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://github.com/shakyamtech" target="_blank" rel="noopener noreferrer" className="btn-social btn-github" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
            <FaGithub size={24} /> GitHub
          </a>
          <a href="https://wa.me/9779851180556" target="_blank" rel="noopener noreferrer" className="btn-social btn-whatsapp" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
            <FaWhatsapp size={24} /> WhatsApp
          </a>
          <a href="https://m.me/mahesh.shakya.official.np" target="_blank" rel="noopener noreferrer" className="btn-social btn-messenger" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
            <FaFacebookMessenger size={24} /> Messenger
          </a>
          <a href="tel:+9779851180556" className="btn-social btn-phone" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
            <FaPhone size={24} /> Call
          </a>
        </div>
      </section>

      {/* Premium Footer */}
      <footer style={{ 
        background: 'linear-gradient(to bottom, var(--bg-primary) 0%, #080808 100%)', 
        padding: '30px 20px 30px', 
        position: 'relative', 
        borderTop: '1px solid rgba(255,255,255,0.03)' 
      }}>
        {/* Glowing Top Line */}
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)' }}></div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '15px', letterSpacing: '-0.5px' }}>
              Mahesh <span style={{ color: 'var(--accent)' }}>Shakya</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', maxWidth: '400px' }}>
              {t.footer.description}
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', maxWidth: '400px', marginTop: '15px' }}>
              {t.footer.seoText}
            </p>
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '20px', fontSize: '1.1rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#about" className="footer-link">Home</a>
              <a href="#frameworks" className="footer-link">Skills</a>
              <a href="#work" className="footer-link">Work</a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: 0 }}>
            © {new Date().getFullYear()} {t.contact.copyright}
          </p>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', display: 'flex', gap: '15px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Back to top"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
        </button>
      )}
    </div>
  );
}

export default Home;
