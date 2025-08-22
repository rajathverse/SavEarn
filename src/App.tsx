import React from 'react';
import { SavEarnProvider } from './context/SavEarnContext';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <SavEarnProvider>
      <div className="App">
        <Dashboard />
      </div>
    </SavEarnProvider>
  );
}

export default App;
