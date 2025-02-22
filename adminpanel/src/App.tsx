import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminPanel from './components/AdminPanel/AdminPanel';

const App = () => {
  return (
    <Router>
      <AdminPanel />
    </Router>
  );
};

export default App;
