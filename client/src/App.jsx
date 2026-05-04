import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Debug from './pages/Debug';
import FileChat from './pages/FileChat';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="/chat" element={<FileChat />} />
      </Routes>
    </div>
  );
}