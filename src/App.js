import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hero from './components/Hero';
import TypewriterEffect from './components/TypewriterEffect';
import Animations from './components/Animation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/typewriter-effect" element={<TypewriterEffect />} />
        <Route path="/animations" element={<Animations />} />
    
      </Routes>
    </Router>
  );
}

export default App;
