import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Overview from "./pages/Overview";
import People from "./pages/People";
import Buildings from "./pages/Buildings";
import Market from "./pages/Market";
import Military from "./pages/Military";
import RegionMap from "./pages/RegionMap";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="people" element={<People />} />
        <Route path="buildings" element={<Buildings />} />
        <Route path="market" element={<Market />} />
        <Route path="military" element={<Military />} />
        <Route path="map" element={<RegionMap />} />
      </Route>
    </Routes>
  );
}

export default App;
