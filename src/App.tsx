import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingPage from './components/BookingPage';

function App() {
  return (
    <Router>
      <div className="font-geist text-[#373a46] bg-white min-h-screen">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <Hero />
            </>
          } />
          <Route path="/book" element={<BookingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
