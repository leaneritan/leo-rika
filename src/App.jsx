import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UnitPage from './pages/UnitPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen bg-background text-text">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/unit/:id" element={<UnitPage />} />
        <Route path="/unit/:id/slides" element={<UnitPage mode="slides" />} />
        <Route path="/unit/:id/flashcards" element={<UnitPage mode="flashcards" />} />
        <Route path="/unit/:id/chart" element={<UnitPage mode="chart" />} />
        <Route path="/unit/:id/quiz" element={<UnitPage mode="quiz" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
