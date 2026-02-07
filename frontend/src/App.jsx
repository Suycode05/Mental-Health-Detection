import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './mental_health_dashboard_overview/Home';
import Journal from './text_mood_journal/Journal';
import Voice from './voice_emotion_analysis/Voice';
import Resources from './mental_health_resources_&_support/Resources';
import Reports from './pages/Reports'; // Keeping Reports as is for now

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/voice" element={<Voice />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/resources" element={<Resources />} />
      </Route>
    </Routes>
  );
}

export default App;
