import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { startGame } from "../store/gameSlice";
import { initializeResources } from "../store/resourcesSlice";
import regionsImage from "../assets/region/regions.png";

const GameStartModal = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    cityName: "[Aurelion placeholder]",
    region: "Forest Realm",
    bonus: "Building",
    mode: "Friendly",
    speed: "Regular",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.cityName.trim()) {
      alert("Please enter a city name");
      return;
    }

    // Dispatch actions to start game
    dispatch(startGame(formData));
    dispatch(initializeResources(formData));
  };

  const getOptionDescription = (type, value) => {
    switch (type) {
      case "region":
        if (value === "Forest Realm") return "25% wood production";
        if (value === "Riverlands") return "25% food from fishing";
        if (value === "Highland pass") return "15% stone & iron";
        break;
      case "bonus":
        if (value === "Building") return "Start with more resources";
        if (value === "Gathering") return "Start with higher population";
        if (value === "Fighting") return "Start with better gear";
        break;
      case "mode":
        if (value === "Friendly") return "Building, trading, expanding";
        if (value === "Aggressive") return "Also includes fighting";
        break;
      case "speed":
        if (value === "Active") return "Have some hours to play now";
        if (value === "Regular") return "Playing multiple times a day";
        if (value === "Idle") return "Playing daily";
        break;
      default:
        return "";
    }
    return "";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
      <div className="bg-zinc-900 border border-zinc-700 p-8 rounded-lg shadow-2xl max-w-2xl w-full text-white max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-amber-500">
          Start Your Journey
        </h2>

        <div className="mb-6 flex justify-center">
          <img
            src={regionsImage}
            alt="Regions"
            className="rounded border border-zinc-600 max-h-48 object-cover"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* City Name */}
          <div>
            <label className="block text-zinc-300 mb-2 font-medium">
              City Name
            </label>
            <input
              type="text"
              name="cityName"
              value={formData.cityName}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-600 rounded p-3 text-white focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="Enter your city's name..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Region */}
            <div>
              <label className="block text-zinc-300 mb-2 font-medium">
                Region
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-600 rounded p-3 text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Forest Realm">Forest Realm</option>
                <option value="Riverlands">Riverlands</option>
                <option value="Highland pass">Highland pass</option>
              </select>
              <p className="text-xs text-zinc-400 mt-1">
                {getOptionDescription("region", formData.region)}
              </p>
            </div>

            {/* Bonus */}
            <div>
              <label className="block text-zinc-300 mb-2 font-medium">
                Starting Bonus
              </label>
              <select
                name="bonus"
                value={formData.bonus}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-600 rounded p-3 text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Building">Building</option>
                <option value="Gathering">Gathering</option>
                <option value="Fighting">Fighting</option>
              </select>
              <p className="text-xs text-zinc-400 mt-1">
                {getOptionDescription("bonus", formData.bonus)}
              </p>
            </div>

            {/* Gameplay Mode */}
            <div>
              <label className="block text-zinc-300 mb-2 font-medium">
                Gameplay Mode
              </label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-600 rounded p-3 text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Friendly">Friendly</option>
                <option value="Aggressive">Aggressive</option>
              </select>
              <p className="text-xs text-zinc-400 mt-1">
                {getOptionDescription("mode", formData.mode)}
              </p>
            </div>

            {/* Gameplay Speed */}
            <div>
              <label className="block text-zinc-300 mb-2 font-medium">
                Gameplay Speed
              </label>
              <select
                name="speed"
                value={formData.speed}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-600 rounded p-3 text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Regular">Regular</option>
                <option value="Idle">Idle</option>
              </select>
              <p className="text-xs text-zinc-400 mt-1">
                {getOptionDescription("speed", formData.speed)}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded transition-colors mt-8 shadow-lg transform cursor-pointer hover:scale-[1.02]"
          >
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameStartModal;
