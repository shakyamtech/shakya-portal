import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import '../index.css';
import { fallbackProjects } from '../data/fallbackProjects';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      let foundProject = null;
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          foundProject = { id: docSnap.id, ...docSnap.data() };
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }

      if (foundProject) {
        setProject(foundProject);
      } else {
        // Fallback: search in fallbackProjects (case-insensitive and tolerant of l/I/1 mixups)
        const normalizeId = (s: string) => s.toLowerCase().replace(/[il1]/g, 'l');
        const localProject = fallbackProjects.find(p => normalizeId(p.id) === normalizeId(id));
        if (localProject) {
          setProject(localProject);
        } else {
          setProject(null);
        }
      }
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Project Not Found</h2>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '10px 20px' }}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="animate-page-reveal" style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', paddingBottom: '100px' }}>
      
      {/* Header / Navigation */}
      <nav style={{ padding: '30px 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, transition: 'color 0.3s' }}
          onMouseOver={(e) => e.currentTarget.style.color = 'white'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={20} /> Back to Portfolio
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>Mahesh <span style={{ color: 'white' }}>Shakya</span></h1>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1000px', margin: '60px auto 0 auto', padding: '0 20px' }}>
        
        <div className="animate-premium-fade-up">
          {/* Cover Image */}
          {project.imageUrl && (
            <div className="project-detail-image-wrapper">
              <div style={{ position: 'relative', width: '100%', borderRadius: '21px', overflow: 'hidden', zIndex: 2, background: '#000' }}>
                <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>
          )}

          {/* Project Details */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
              {project.tag}
            </span>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '30px', lineHeight: 1.1, color: 'var(--text-primary)' }}>
              {project.title}
            </h1>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '50px' }}>
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '15px 30px', fontSize: '1.1rem' }}
              >
                Visit Live Project <ExternalLink size={20} />
              </a>
            </div>

            <div className="glass-panel" style={{ padding: '40px', borderRadius: '20px', width: '100%' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '20px' }}>About The Project</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {project.description}
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ProjectDetails;
