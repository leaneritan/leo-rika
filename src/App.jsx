import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UnitPage from './pages/UnitPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/unit/:id" element={<UnitPage />} />
          <Route path="/unit/:id/slides" element={<UnitPage activeTab="slides" />} />
          <Route path="/unit/:id/flashcards" element={<UnitPage activeTab="flashcards" />} />
          <Route path="/unit/:id/timeline" element={<UnitPage activeTab="timeline" />} />
          <Route path="/unit/:id/quiz" element={<UnitPage activeTab="quiz" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
