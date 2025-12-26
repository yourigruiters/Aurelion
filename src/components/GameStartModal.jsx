import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { startGame } from "../store/gameSlice";
import { initializeResources } from "../store/resourcesSlice";
import regionsImage from "../assets/region/regions.png";
import { Crown } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";

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
    <div className="fixed inset-0 bg-black/70 bg-opacity-70 flex items-center justify-center z-[100]">
      <div className="bg-bg-main border border-border-main p-8 rounded-lg shadow-2xl max-w-2xl w-full text-white max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center justify-center mb-6 space-y-2">
          <Crown size={32} className="text-accent" />
          <h2 className="text-3xl font-bold text-center text-accent">
            Start Your Journey
          </h2>
        </div>

        <div className="mb-6 flex justify-center">
          <img
            src={regionsImage}
            alt="Regions"
            className="rounded border border-border-light max-h-48 object-cover"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* City Name */}
          <Input
            label="City Name"
            name="cityName"
            value={formData.cityName}
            onChange={handleChange}
            placeholder="Enter your city's name..."
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Region */}
            <Select
              label="Region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              helperText={getOptionDescription("region", formData.region)}
            >
              <option value="Forest Realm">Forest Realm</option>
              <option value="Riverlands">Riverlands</option>
              <option value="Highland pass">Highland pass</option>
            </Select>

            {/* Bonus */}
            <Select
              label="Starting Bonus"
              name="bonus"
              value={formData.bonus}
              onChange={handleChange}
              helperText={getOptionDescription("bonus", formData.bonus)}
            >
              <option value="Building">Building</option>
              <option value="Gathering">Gathering</option>
              <option value="Fighting">Fighting</option>
            </Select>

            {/* Gameplay Mode */}
            <Select
              label="Gameplay Mode"
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              helperText={getOptionDescription("mode", formData.mode)}
            >
              <option value="Friendly">Friendly</option>
              <option value="Aggressive">Aggressive</option>
            </Select>

            {/* Gameplay Speed */}
            <Select
              label="Gameplay Speed"
              name="speed"
              value={formData.speed}
              onChange={handleChange}
              helperText={getOptionDescription("speed", formData.speed)}
            >
              <option value="Active">Active</option>
              <option value="Regular">Regular</option>
              <option value="Idle">Idle</option>
            </Select>
          </div>

          <Button type="submit" className="mt-8">
            Start Game
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GameStartModal;
