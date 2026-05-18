import { useEffect, useState } from 'react';
import { Globe, Smartphone, Palette, Calculator, Video } from 'lucide-react';
import { FaWhatsapp, FaFacebookMessenger, FaGithub, FaPhone } from 'react-icons/fa6';
import './index.css';

const rolesData = [
  { name: "Web Developer", icon: <Globe size={40} strokeWidth={1.5} /> },
  { name: "Apps Developer", icon: <Smartphone size={40} strokeWidth={1.5} /> },
  { name: "Graphic Designer", icon: <Palette size={40} strokeWidth={1.5} /> },
  { name: "Account Book Keeper", icon: <Calculator size={40} strokeWidth={1.5} /> },
  { name: "Video Editor", icon: <Video size={40} strokeWidth={1.5} /> }
];

const roles = rolesData.map(r => r.name);

function App() {
  const [activeRole, setActiveRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRole((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav className="glass-panel nav-container">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>Mahesh <span style={{color: 'white'}}>Shakya</span></h1>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="animate-fade-up hero-content-wrapper">
          
          <div className="hero-text">
            <h2 style={{ fontSize: '1.2rem', color: 'var(--accent)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' }}>Hello, I am Mahesh Shakya</h2>
            <h1 className="hero-title">
              I craft experiences as a <br/>
              <span key={activeRole} className="gradient-text role-animate">{roles[activeRole]}</span>
            </h1>
            <p className="hero-subtitle">
              A multidisciplinary professional bridging the gap between design, development, business accounts, and visual storytelling.
            </p>
            <div className="hero-buttons">
              <a href="#work" className="btn-primary">View My Work</a>
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

          <div className="hero-image-wrapper">
            <div className="glass-panel hero-image-container">
              <div className="hero-image-crop">
                <img src="/images/profile_avatar.jpg" alt="Mahesh Shakya Avatar" className="hero-image" />
              </div>
            </div>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="animate-fade-up delay-2 roles-grid">
          {rolesData.map((role, idx) => (
            <div key={idx} className="glass-panel role-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: 'var(--accent)', marginBottom: '15px' }}>
                {role.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{role.name}</h3>
            </div>
          ))}
        </div>
      </main>

      {/* Selected Work Section */}
      <section id="work" style={{ padding: '100px 20px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title"><span className="gradient-text">Selected Work</span></h2>
          
          <div className="work-grid">
            
            {/* Project 1 */}
            <div className="glass-panel project-card" style={{ overflow: 'hidden', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}>
              <img src="/images/project_web.png" alt="Premium Restaurant System" style={{ width: '100%', height: '250px', objectFit: 'cover', borderBottom: '1px solid rgba(255,255,255,0.05)' }} />
              <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Web App</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '10px 0', color: 'var(--text-primary)' }}>Premium Restaurant System</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>A fully responsive web application for restaurant management and digital ordering featuring a beautiful dark mode UI.</p>
                <a href="https://restaurant.easyapps.workers.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px', fontSize: '0.95rem', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-primary)'}>View Live App <span style={{ color: 'var(--accent)' }}>↗</span></a>
              </div>
            </div>

            {/* Project 2 */}
            <div className="glass-panel project-card" style={{ overflow: 'hidden', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}>
              <img src="/images/project_app.png" alt="Hamro Sabzi Mobile App" style={{ width: '100%', height: '250px', objectFit: 'cover', borderBottom: '1px solid rgba(255,255,255,0.05)' }} />
              <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Mobile App</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '10px 0', color: 'var(--text-primary)' }}>Hamro Sabzi</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>A robust and user-friendly mobile application designed for browsing and ordering fresh vegetables and groceries online.</p>
                <a href="https://hamrosabzi.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px', fontSize: '0.95rem', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-primary)'}>View App <span style={{ color: 'var(--accent)' }}>↗</span></a>
              </div>
            </div>

            {/* Project 3 */}
            <div className="glass-panel project-card" style={{ overflow: 'hidden', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}>
              <img src="/images/project_design.png" alt="M Silverlight" style={{ width: '100%', height: '250px', objectFit: 'cover', borderBottom: '1px solid rgba(255,255,255,0.05)' }} />
              <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Business Website</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '10px 0', color: 'var(--text-primary)' }}>M Silverlight</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>The official website and digital presence for my office, demonstrating professional web design and development.</p>
                <a href="https://msilverlight.com.np/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px', fontSize: '0.95rem', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-primary)'}>Visit Office Site <span style={{ color: 'var(--accent)' }}>↗</span></a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <footer id="contact" style={{ padding: '80px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'var(--bg-primary)' }}>
        <h2 className="section-title" style={{ marginBottom: '20px' }}>Let's Create Something <span className="gradient-text">Amazing</span></h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
          Ready to elevate your digital presence? Reach out to discuss your next project, be it a web app, design work, or video editing.
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
        <p style={{ color: 'var(--text-secondary)', marginTop: '60px', fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} Mahesh Shakya. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
