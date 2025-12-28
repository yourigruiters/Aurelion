import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";
import worldMap from "../assets/region/worldmap.png";
import Input from "../components/ui/Input";
import { RootState } from "../store/store";
import { Link } from "react-router-dom";
import { MapPin, ArrowRightCircle } from "lucide-react";

interface CityLabelProps {
  name: string;
  type: string;
  x: number; // Percentage
  y: number; // Percentage
  isPlayer?: boolean;
}

const CityLabel: React.FC<CityLabelProps> = ({
  name,

  x,
  y,
  isPlayer,
}) => (
  <div
    className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <div
      className={`flex flex-col items-center cursor-pointer ${
        isPlayer ? "z-20" : "z-10"
      }`}
    >
      <div
        className={`p-1.5 rounded-full border-2 transition-transform group-hover:scale-110 ${
          isPlayer
            ? "bg-accent border-white text-white shadow-[0_0_15px_rgba(255,255,0,0.5)]"
            : "bg-bg-panel border-text-muted text-text-muted hover:border-white hover:text-white hover:bg-zinc-700"
        }`}
      >
        <MapPin
          size={isPlayer ? 24 : 16}
          fill={isPlayer ? "currentColor" : "none"}
        />
      </div>

      <div className="mt-1 flex flex-col items-center">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap ${
            isPlayer
              ? "bg-accent text-zinc-900"
              : "bg-bg-panel/90 text-text-main group-hover:bg-zinc-800"
          }`}
        >
          {name}
        </span>
        {isPlayer && (
          <Link
            to="/overview"
            className="mt-1 flex items-center gap-1 text-[10px] bg-bg-main/80 text-white px-2 py-0.5 rounded-full border border-white/20 hover:bg-white hover:text-zinc-900 transition-colors"
          >
            Your City <ArrowRightCircle size={10} />
          </Link>
        )}
      </div>
    </div>
  </div>
);

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

        {/* Labels - positioned roughly based on map visual */}

        <CityLabel name="Eldoria" type="Trade Hub" x={65} y={40} />
        <CityLabel name="Stormhold" type="Fortress" x={25} y={30} />
        <CityLabel name="Irondeep" type="Mining" x={35} y={70} />
        <CityLabel name="Sylvana" type="Elven" x={75} y={65} />
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
                  {city.name === (cityName || "Your City") && (
                    <Link
                      to="/overview"
                      className="ml-2 inline-flex items-center gap-1 text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full border border-accent/20 hover:bg-accent hover:text-zinc-900 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Go <ArrowRightCircle size={10} />
                    </Link>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-xs text-text-secondary">{city.type}</div>
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
