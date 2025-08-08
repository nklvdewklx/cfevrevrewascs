import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux'; // NEW: Import useSelector
import AppRouter from './routes/AppRouter';
import { Toaster } from 'react-hot-toast';

function App() {
  const theme = useSelector((state) => state.settings.items.theme); // NEW: Get the current theme

  return (
    <BrowserRouter>
      {/* NEW: Apply the theme class to a wrapper div */}
      <div className={`app-container ${theme === 'light' ? 'theme-light' : ''}`}>
        <AppRouter />
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;