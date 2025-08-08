import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppRouter from './routes/AppRouter';
import { Toaster } from 'react-hot-toast';
import SettingsMenu from './components/common/SettingsMenu'; 

function App() {
  const theme = useSelector((state) => state.settings.items.theme);

  return (
    <BrowserRouter>
      <div className={`app-container ${theme === 'light' ? 'theme-light' : ''}`}>
        <AppRouter />
        <Toaster position="top-right" />
        <SettingsMenu /> {/* NEW: Add the SettingsMenu component here */}
      </div>
    </BrowserRouter>
  );
}

export default App;