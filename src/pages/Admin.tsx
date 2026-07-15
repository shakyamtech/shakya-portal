import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Eye, EyeOff, LayoutDashboard, FolderKanban, PlusSquare, LogOut, Menu, X } from 'lucide-react';
import '../index.css';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // CMS State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'add_project'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [tag, setTag] = useState('WEB APP');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');

  // Manage Projects State
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedProjects: any[] = [];
      querySnapshot.forEach((document) => {
        fetchedProjects.push({ id: document.id, ...document.data() });
      });
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects: ", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error: any) {
      alert(`Error deleting project: ${error.message}`);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setLoginError(err.message || 'Failed to login');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLink('');
    setTag('WEB APP');
    setImageFile(null);
    setEditingId(null);
    setExistingImageUrl('');
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    setMessage('');
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setLink(project.link);
    setTag(project.tag);
    setExistingImageUrl(project.imageUrl || '');
    setMessage('');
    setActiveTab('add_project'); // Switch to form
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !link || !tag) {
      setMessage('Please fill all text fields.');
      return;
    }
    
    if (!editingId && !imageFile) {
      setMessage('Please select an image for a new project.');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      let downloadURL = existingImageUrl;

      if (imageFile) {
        setUploadProgress(50);
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'portfolio_preset');
        
        const cloudinaryRes = await fetch('https://api.cloudinary.com/v1_1/drwjzsbdw/image/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!cloudinaryRes.ok) {
          throw new Error('Failed to upload image to Cloudinary. Check your upload preset!');
        }
        
        const cloudinaryData = await cloudinaryRes.json();
        downloadURL = cloudinaryData.secure_url;
        setUploadProgress(80);
      }

      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), {
          title,
          description,
          link,
          tag,
          imageUrl: downloadURL,
        });
        setMessage('Project updated successfully!');
      } else {
        await addDoc(collection(db, 'projects'), {
          title,
          description,
          link,
          tag,
          imageUrl: downloadURL,
          createdAt: new Date(),
        });
        setMessage('Project uploaded successfully!');
      }

      setUploading(false);
      setUploadProgress(0);
      fetchProjects();
      
      if (editingId) {
        setTimeout(() => {
          resetForm();
          setActiveTab('projects');
        }, 1500);
      } else {
        setTimeout(() => {
          resetForm();
        }, 1500);
      }

    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <form onSubmit={handleLogin} className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ color: 'var(--accent)', textAlign: 'center', marginBottom: '10px' }}>Admin Login</h2>
          {loginError && <p style={{ color: '#ff4d4d', fontSize: '0.9rem', textAlign: 'center' }}>{loginError}</p>}
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            required 
          />
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '12px', paddingRight: '45px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              required 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Login</button>
        </form>
      </div>
    );
  }

  const sidebarItemStyle = (tabId: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    background: activeTab === tabId ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
    color: activeTab === tabId ? 'var(--accent)' : 'var(--text-secondary)',
    transition: 'all 0.3s ease',
    fontWeight: activeTab === tabId ? 600 : 400,
    border: '1px solid',
    borderColor: activeTab === tabId ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <style>
        {`
          .admin-sidebar {
            width: 280px;
            left: 0;
          }
          .admin-main-content {
            margin-left: 280px;
          }
          .mobile-only-btn {
            display: none !important;
          }
          .admin-table th, .admin-table td {
            padding: 15px;
          }
          .admin-table tbody tr:hover {
            background: rgba(255,255,255,0.03);
          }
          @media (max-width: 768px) {
            .admin-sidebar {
              left: ${isSidebarOpen ? '0' : '-300px'} !important;
            }
            .admin-main-content {
              margin-left: 0 !important;
              padding: 80px 20px 20px 20px !important;
            }
            .mobile-only-btn {
              display: flex !important;
            }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100, background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '8px', alignItems: 'center', justifyItems: 'center', cursor: 'pointer' }}
        className="mobile-only-btn"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Navigation */}
      <aside 
        className="glass-panel admin-sidebar"
        style={{ 
          borderRight: '1px solid rgba(255,255,255,0.05)', 
          padding: '30px 20px',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          transition: 'left 0.3s ease',
          zIndex: 90,
          borderRadius: 0,
          background: 'var(--bg-secondary)',
        }}
      >
        <div style={{ marginBottom: '50px', textAlign: 'center', marginTop: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800 }}>Admin <span style={{ color: 'var(--accent)' }}>CMS</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Portfolio Management</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <div style={sidebarItemStyle('dashboard')} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}>
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div style={sidebarItemStyle('projects')} onClick={() => { setActiveTab('projects'); setIsSidebarOpen(false); }}>
            <FolderKanban size={20} /> Manage Projects
          </div>
          <div style={sidebarItemStyle('add_project')} onClick={() => { resetForm(); setActiveTab('add_project'); setIsSidebarOpen(false); }}>
            <PlusSquare size={20} /> {editingId ? 'Edit Project' : 'Add New Project'}
          </div>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#ff4d4d', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.3s' }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            onClick={handleLogout}
          >
            <LogOut size={20} /> Logout
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        style={{ 
          flex: 1, 
          padding: '40px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.3s ease'
        }}
        className="admin-main-content"
      >
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="animate-premium-fade-up">
            <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '10px' }}>Welcome Back, Admin</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Here is an overview of your portfolio metrics.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '20px', borderRadius: '12px', color: 'var(--accent)' }}>
                  <FolderKanban size={32} />
                </div>
                <div>
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Total Projects</h3>
                  <p style={{ color: 'white', fontSize: '2rem', fontWeight: 800 }}>{loadingProjects ? '...' : projects.length}</p>
                </div>
              </div>
              
              <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: 'rgba(97, 218, 251, 0.1)', padding: '20px', borderRadius: '12px', color: '#61DAFB' }}>
                  <Eye size={32} />
                </div>
                <div>
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Portfolio Status</h3>
                  <p style={{ color: '#00ED64', fontSize: '1.2rem', fontWeight: 600 }}>Active & Live</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manage Projects View */}
        {activeTab === 'projects' && (
          <div className="animate-premium-fade-up" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
              <div>
                <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '5px' }}>Manage Projects</h1>
                <p style={{ color: 'var(--text-secondary)' }}>View, edit, or delete your portfolio items.</p>
              </div>
              <button 
                className="btn-primary" 
                style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => { resetForm(); setActiveTab('add_project'); }}
              >
                <PlusSquare size={18} /> Add New Project
              </button>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {loadingProjects ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                  <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
              ) : projects.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Image</th>
                        <th style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Title</th>
                        <th style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Tag</th>
                        <th style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Link</th>
                        <th style={{ color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }}>
                          <td>
                            {project.imageUrl ? (
                              <img src={project.imageUrl} alt={project.title} style={{ width: '70px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
                            ) : (
                              <div style={{ width: '70px', height: '45px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}></div>
                            )}
                          </td>
                          <td style={{ color: 'white', fontWeight: 600 }}>{project.title}</td>
                          <td>
                            <span style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>{project.tag}</span>
                          </td>
                          <td>
                            <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: '#61DAFB', textDecoration: 'none', fontSize: '0.9rem' }}>View App ↗</a>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleEdit(project)}
                                style={{ background: 'rgba(255, 196, 0, 0.1)', color: '#FFC400', border: '1px solid rgba(255, 196, 0, 0.3)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}
                                onMouseOver={e => {e.currentTarget.style.background = '#FFC400'; e.currentTarget.style.color = 'black';}}
                                onMouseOut={e => {e.currentTarget.style.background = 'rgba(255, 196, 0, 0.1)'; e.currentTarget.style.color = '#FFC400';}}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(project.id)}
                                style={{ background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', border: '1px solid rgba(255, 77, 77, 0.3)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}
                                onMouseOver={e => {e.currentTarget.style.background = '#ff4d4d'; e.currentTarget.style.color = 'white';}}
                                onMouseOut={e => {e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)'; e.currentTarget.style.color = '#ff4d4d';}}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
                  <FolderKanban size={64} style={{ opacity: 0.2, margin: '0 auto 20px auto' }} />
                  <p style={{ fontSize: '1.1rem' }}>No projects found. Add some to build your portfolio!</p>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}
                    onClick={() => { resetForm(); setActiveTab('add_project'); }}
                  >
                    <PlusSquare size={18} /> Upload Your First Project
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Project Form View */}
        {activeTab === 'add_project' && (
          <div className="animate-premium-fade-up" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div style={{ marginBottom: '30px' }}>
              <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '5px' }}>{editingId ? 'Edit Project' : 'Upload New Project'}</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Fill out the details below to {editingId ? 'update the' : 'publish a new'} project.</p>
            </div>

            <form onSubmit={handleUpload} className="glass-panel" style={{ padding: '40px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {message && <p style={{ color: message.includes('Error') || message.includes('failed') ? '#ff4d4d' : '#00ED64', textAlign: 'center', fontWeight: 'bold', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: `1px solid ${message.includes('Error') ? 'rgba(255, 77, 77, 0.3)' : 'rgba(0, 237, 100, 0.3)'}` }}>{message}</p>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Project Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none' }} placeholder="e.g. NextGen LMS System" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Project Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} style={{ padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', resize: 'vertical', outline: 'none' }} placeholder="Briefly describe the project, tools used, and the problem it solves..." />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Project Link (URL)</label>
                  <input type="url" value={link} onChange={(e) => setLink(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none' }} placeholder="https://" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Tag (e.g., WEB APP)</label>
                  <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none' }} placeholder="WEB APP" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Thumbnail Image {editingId && <span style={{fontSize: '0.8rem', opacity: 0.7, fontWeight: 400}}>(Leave empty to keep current)</span>}</label>
                  {editingId && existingImageUrl && (
                    <div style={{ marginBottom: '10px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'inline-block' }}>
                      <img src={existingImageUrl} alt="Current" style={{ width: '120px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                    </div>
                  )}
                  <div style={{ position: 'relative' }}>
                    <input id="image-upload" type="file" accept="image/*" onChange={(e) => setImageFile(e.target?.files?.[0] || null)} required={!editingId} style={{ padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', width: '100%', cursor: 'pointer' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button type="submit" disabled={uploading} className="btn-primary" style={{ flex: 1, opacity: uploading ? 0.7 : 1, padding: '16px', fontSize: '1.05rem' }}>
                  {uploading ? (editingId ? `Updating... ${Math.round(uploadProgress)}%` : `Uploading... ${Math.round(uploadProgress)}%`) : (editingId ? 'Save Changes' : 'Publish Project')}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => { resetForm(); setActiveTab('projects'); }} 
                    disabled={uploading} 
                    style={{ padding: '16px 30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s', fontSize: '1.05rem', fontWeight: 600 }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;
