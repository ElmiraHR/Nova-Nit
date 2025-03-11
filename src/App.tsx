// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Landing from './pages/landing/Landing';
import Mission from './pages/mission/Mission';
import HowDoesItWork from './pages/howDoesItWork/HowDoesItWork';
import Partners from './pages/partners/Partners';
import GetInvolved from './pages/getInvolved/GetInvolved';
import ContactUs from './pages/contact/Contact';
import Volunteer from './pages/volunteer/Volunteer';
import { LanguageProvider } from './context/LanguageContext';
import FAQ from './pages/faq/FAQ';
import Logo from './components/logo/Logo';

const App: React.FC = () => {
  return (
    <LanguageProvider>
    <Router>
      <div className="app">
        <Header />
        <main>
          <Logo/>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/how-does-it-work" element={<HowDoesItWork />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </LanguageProvider>
  );
};

export default App;