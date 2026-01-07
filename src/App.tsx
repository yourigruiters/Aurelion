import { Routes, Route, Navigate } from "react-router-dom";
import Buildings from "./pages/Buildings";
import Overview from "./pages/Overview";
import People from "./pages/People";
import Market from "./pages/Market";
import Military from "./pages/Military";
import Activities from "./pages/Activities";
import MainLayout from "./components/layout/MainLayout";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="people" element={<People />} />
        <Route path="buildings" element={<Buildings />} />
        <Route path="market" element={<Market />} />
        <Route path="military" element={<Military />} />
        <Route path="activities" element={<Activities />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
