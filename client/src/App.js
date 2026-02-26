import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import SearchScreen from './components/SearchScreen';
import DashboardScreen from './components/DashboardScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchScreen />} />
        <Route path="/dashboard/:placeId" element={<DashboardScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
