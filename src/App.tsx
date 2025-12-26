import { Routes, Route, Navigate } from "react-router-dom";
import Buildings from "./pages/Buildings";
import Overview from "./pages/Overview";
import People from "./pages/People";
import Market from "./pages/Market";
import Military from "./pages/Military";
import Activities from "./pages/Activities";
import RegionMap from "./pages/RegionMap";
import MainLayout from "./components/layout/MainLayout";

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
        <Route path="activities" element={<Activities />} />
        <Route path="map" element={<RegionMap />} />
      </Route>
    </Routes>
  );
}

export default App;
