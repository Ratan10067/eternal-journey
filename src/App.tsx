import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { JourneyProvider } from './context/JourneyContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { FilmGrain } from './components/common/FilmGrain';

// Pages
import { HomePage } from './pages/HomePage';
import { JourneyTimelinePage } from './pages/JourneyTimelinePage';
import { JourneyDayPage } from './pages/JourneyDayPage';
import { AtlasMapPage } from './pages/AtlasMapPage';
import { PlaceDetailPage } from './pages/PlaceDetailPage';
import { MemoryMachinePage } from './pages/MemoryMachinePage';
import { PhotographyMuseumPage } from './pages/PhotographyMuseumPage';
import { CameraWarsPage } from './pages/CameraWarsPage';
import { CameraBattleDetailPage } from './pages/CameraBattleDetailPage';
import { GuestbookPage } from './pages/GuestbookPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Scroll to top upon route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <JourneyProvider>
      <Router>
        <ScrollToTop />
        <FilmGrain />
        <div className="flex flex-col min-h-screen bg-[#09090b] text-[#f7f4ee]">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/journey" element={<JourneyTimelinePage />} />
              <Route path="/journey/:day" element={<JourneyDayPage />} />
              <Route path="/atlas" element={<AtlasMapPage />} />
              <Route path="/places/:slug" element={<PlaceDetailPage />} />
              <Route path="/memories" element={<MemoryMachinePage />} />
              <Route path="/gallery" element={<PhotographyMuseumPage />} />
              <Route path="/camera-wars" element={<CameraWarsPage />} />
              <Route path="/camera-wars/:battleId" element={<CameraBattleDetailPage />} />
              <Route path="/guestbook" element={<GuestbookPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </JourneyProvider>
  );
};

export default App;
