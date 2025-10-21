/**
 * Main App Component
 * 
 * Sets up routing for the application.
 * Routes:
 * - / : Home page (game selection)
 * - /game/:gameId : Chat page for a specific game
 */

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page - shows all games */}
        <Route path="/" element={<HomePage />} />
        
        {/* Chat page - interactive chat for a specific game */}
        <Route path="/game/:gameId" element={<ChatPage />} />
        
        {/* 404 - Redirect to home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

