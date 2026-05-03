import { lazy, Suspense } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Lazy load components for better performance
const Hero = lazy(() => import('./components/Hero'));
const BookingPage = lazy(() => import('./components/BookingPage'));

// Loading fallback component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="font-geist text-[#373a46] bg-white min-h-screen">
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/book" element={<BookingPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;

