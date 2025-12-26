import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";
import worldMap from "../assets/region/worldmap.png";
import Input from "../components/ui/Input";
import { RootState } from "../store/store";

const RegionMap: React.FC = () => {
  const { cityName } = useSelector((state: RootState) => state.game);
  const [searchTerm, setSearchTerm] = useState("");

  const allCities = [
    { name: cityName || "Your City", type: "Capital", status: "Friendly" },
    { name: "Eldoria", type: "Trade Hub", status: "Neutral" },
    { name: "Stormhold", type: "Fortress", status: "Hostile" },
    { name: "Raven's Creek", type: "Village", status: "Friendly" },
    { name: "Irondeep", type: "Mining Colony", status: "Neutral" },
    { name: "Sylvana", type: "Elven Outpost", status: "Friendly" },
  ];

  const filteredCities = allCities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* Left Side: Map */}
      <div className="flex-1 bg-bg-panel p-4 flex items-center justify-center overflow-auto relative">
        <img
          src={worldMap}
          alt="World Map"
          className="max-h-full max-w-full rounded-lg shadow-2xl border border-border-main object-contain"
        />
      </div>

      {/* Right Side: Search & List */}
      <div className="w-80 flex-none bg-bg-main border-l border-border-main flex flex-col">
        <div className="p-6 border-b border-border-main">
          <h2 className="text-xl font-bold text-text-main mb-4">Known World</h2>
          <div className="relative">
            <Input
              placeholder="Find a city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredCities.length > 0 ? (
            filteredCities.map((city, idx) => (
              <div
                key={idx}
                className="p-3 bg-bg-panel border border-border-light rounded hover:border-brand transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-text-main group-hover:text-brand transition-colors">
                    {city.name}
                  </h3>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${
                      city.status === "Friendly"
                        ? "bg-success/10 text-success"
                        : city.status === "Hostile"
                        ? "bg-danger/10 text-danger"
                        : "bg-text-muted/10 text-text-muted"
                    }`}
                  >
                    {city.status}
                  </span>
                </div>
                <div className="text-xs text-text-secondary">{city.type}</div>
              </div>
            ))
          ) : (
            <div className="text-center text-text-dim italic mt-8">
              No cities found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionMap;
