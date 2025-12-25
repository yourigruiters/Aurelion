import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route
          path="overview"
          element={
            <div className="flex-1 flex items-center justify-center text-4xl font-bold">
              Overview
            </div>
          }
        />
        <Route
          path="people"
          element={
            <div className="flex-1 flex items-center justify-center text-4xl font-bold">
              People
            </div>
          }
        />
        <Route
          path="buildings"
          element={
            <div className="flex-1 flex items-center justify-center text-4xl font-bold">
              Buildings
            </div>
          }
        />
        <Route
          path="market"
          element={
            <div className="flex-1 flex items-center justify-center text-4xl font-bold">
              Market Hall
            </div>
          }
        />
        <Route
          path="military"
          element={
            <div className="flex-1 flex items-center justify-center text-4xl font-bold">
              Military
            </div>
          }
        />
        <Route
          path="map"
          element={
            <div className="flex-1 flex items-center justify-center text-4xl font-bold">
              Region Map
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
