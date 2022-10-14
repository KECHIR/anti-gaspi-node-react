import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import OfferCreator from './pages/OfferCreator.js';
import Offers from './pages/Offers.js';
import Header from './components/Header.js';
import About from './pages/About.js';
import Offer from './pages/Offer.js';

function App() {
  return (
    <div className='app-main'>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/create-offer" replace />} />
          <Route path="/create-offer" element={<OfferCreator />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/about" element={<About />} />
          <Route path="/offer/:offerId" element={<Offer />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;