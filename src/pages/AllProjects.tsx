import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { translations } from '../translations';
import type { Language } from '../translations';
import { fallbackProjects } from '../data/fallbackProjects';
import '../index.css';

const AllProjects = () => {
  const [lang] = useState<Language>('ENG');
  const t = translations[lang];
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 12;

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('sortOrder', 'asc'));
        const querySnapshot = await getDocs(q);
        const fetchedProjects: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProjects.push({ id: doc.id, ...doc.data() });
        });
        if (fetchedProjects.length === 0) {
          setProjects(fallbackProjects);
        } else {
          setProjects(fetchedProjects);
        }
      } catch (error) {
        console.error("Error fetching projects: ", error);
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Pagination Logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '100px 20px', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '10px' }}>
              <span className="gradient-text">{t.work.allProjectsTitle || 'All Portfolio Projects'}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>{t.work.allProjectsSubtitle || 'Explore the complete archive of my works and systems.'}</p>
          </div>
          <button 
            className="btn-primary" 
            onClick={() => window.history.back()}
            style={{ padding: '10px 20px' }}
          >
            ← Back to Home
          </button>
        </div>

        {/* Project Grid */}
        <div className="project-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="glass-panel" style={{ height: '400px', borderRadius: '24px', animation: 'pulse 1.5s infinite', background: 'rgba(255,255,255,0.02)' }}></div>
            ))
          ) : currentProjects.length > 0 ? (
            currentProjects.map((project: any) => (
              <div key={project.id} className="premium-project-card animate-premium-fade-up">
                <div className="premium-project-card-inner">
                  <div className="premium-image-wrapper">
                    <img src={project.imageUrl} alt={project.title} loading="lazy" width="800" height="240" />
                  </div>
                  <div className="premium-card-content">
                    <div className="project-badge">{project.tag}</div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px 0', color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.3 }}>{project.title}</h3>
                    <p className="line-clamp-3" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, fontSize: '0.9rem', marginBottom: '0' }}>{project.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', alignItems: 'center' }}>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-live-app" title={t.work.btnViewApp}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1 / -1', padding: '40px 0' }}>No projects found.</div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && projects.length > projectsPerPage && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '60px' }}>
            <button 
              onClick={handlePrev} 
              disabled={currentPage === 1}
              className="btn-primary"
              style={{ padding: '10px 20px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              {t.work.btnPrev || 'Previous'}
            </button>
            <span style={{ color: 'var(--text-secondary)' }}>Page <strong style={{ color: 'white' }}>{currentPage}</strong> of <strong style={{ color: 'white' }}>{totalPages}</strong></span>
            <button 
              onClick={handleNext} 
              disabled={currentPage === totalPages}
              className="btn-primary"
              style={{ padding: '10px 20px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              {t.work.btnNext || 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;
