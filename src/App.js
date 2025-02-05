import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hero from './components/Hero';
import TypewriterEffect from './components/TypewriterEffect';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/typewriter-effect" element={<TypewriterEffect />} />
      </Routes>
    </Router>
  );
}

export default App;
