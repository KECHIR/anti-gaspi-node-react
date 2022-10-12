import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Offer from './pages/Offer.js';
import Offers from './pages/Offers.js';

function App() {
  return (
    <div >
      <div>
        <Router>
          <Routes>
            <Route path="/offer" element={<Offer />} />
            <Route path="/offers" element={<Offers />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;