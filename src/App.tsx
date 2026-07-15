import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProjectDetails from './pages/ProjectDetails';
import AnimusBackground from './components/AnimusBackground';

function App() {
  return (
    <>
      <AnimusBackground />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
