import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";
import worldMap from "../assets/region/worldmap.png";
import Input from "../components/ui/Input";

const RegionMap = () => {
  const navigate = useNavigate();
  const { cityName } = useSelector((state) => state.game);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCityClick = () => {
    navigate("/");
  };

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold text-text-main mb-6">Region Map</h1>
      <div className="text-text-secondary mb-8">
        Explore the known lands and locate other cities.
      </div>

      {/* Map Container */}
      <div className="relative inline-block rounded-lg shadow-2xl border border-border-main overflow-hidden bg-bg-panel">
        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-4 z-20 w-64 bg-bg-panel/90 backdrop-blur-sm p-2 rounded border border-border-main shadow-lg">
          <div className="relative">
            <Input
              placeholder="Find a city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>
        </div>

        <img
          src={worldMap}
          alt="World Map"
          className="max-w-full h-auto block"
        />

        {/* Clickable City Title Overlay */}
        <div
          onClick={handleCityClick}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-panel/90 border border-brand px-4 py-2 rounded shadow-xl cursor-pointer hover:scale-110 transition-transform group"
          style={{ top: "40%", left: "60%" }}
        >
          <span className="font-bold text-brand text-lg group-hover:text-accent transition-colors">
            {cityName || "Your City"}
          </span>
          <div className="text-xs text-text-muted text-center mt-1">
            Capital City
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionMap;
