import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { startGame } from "../store/gameSlice";
import { initializeResources } from "../store/resourcesSlice";
import { generateDailyActivities } from "../store/activitiesSlice";
import { constructHouse } from "../store/buildingsSlice";
import regionsImage from "../assets/region/regions.png";
import region1 from "../assets/region/region1.png";
import region2 from "../assets/region/region2.png";
import region3 from "../assets/region/region3.png";
import {
  Crown,
  Users,
  Apple,
  Wheat,
  Mountain,
  Hammer,
  Gem,
} from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ResourceItem from "./ui/ResourceItem";
import { getResourceDetails } from "../helpers/resource";
import { Focus, Region } from "../types";

interface FormData {
  cityName: string;
  region?: Region;
  focus?: Focus;
}

const GameStartModal: React.FC = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    cityName: "",
    region: undefined,
    focus: undefined,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.cityName.trim() || !formData.region || !formData.focus) {
      alert("Please enter all details");
      return;
    }

    if (!formData.region || !formData.focus) {
      alert("Please select a region and focus");
      return;
    }

    // Dispatch actions to start game
    dispatch(
      startGame({
        cityName: formData.cityName,
        region: formData.region as Region,
        focus: formData.focus as Focus,
        gameStarted: true,
        dayTime: 0,
        level: 1,
        experience: 0,
        maxExperience: 100,
      })
    );

    dispatch(
      initializeResources({ region: formData.region!, focus: formData.focus! })
    );

    if (formData.focus === "Gathering") {
      dispatch(constructHouse({ plotId: 1, type: "homestead" }));
    }

    dispatch(generateDailyActivities({ day: 1 }));
  };

  const getImage = () => {
    if (formData.region === "Forest Realm") return region1;
    if (formData.region === "Riverlands") return region2;
    if (formData.region === "Highland pass") return region3;
    return regionsImage;
  };

  const resourceDetails = getResourceDetails(formData.region, formData.focus);
  const currentImage = getImage();

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-70 flex items-center justify-center z-[100] p-4">
      <div className="bg-bg-main border border-border-main rounded-lg shadow-2xl max-w-5xl w-full text-white max-h-[95vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Visuals & Preview */}
        <div className="relative bg-bg-panel p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border-main">
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-8 space-y-2">
            <Crown size={48} className="text-accent" />
            <h2 className="text-4xl font-bold text-center text-accent">
              Aurelion
            </h2>
          </div>

          {/* Mini TopBar Preview */}
          <div className="mb-0 p-4 bg-bg-main rounded border border-border-main">
            <h3 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider text-center">
              Starting Status
            </h3>

            <div className="space-y-4">
              {/* Core Resources */}
              <div>
                <h4 className="text-xs text-text-dim mb-2 font-medium">Core</h4>
                <div className="flex gap-3">
                  <ResourceItem
                    icon={Users}
                    value={resourceDetails.population}
                    color="text-info"
                    tooltipLabel="Population"
                    className="bg-bg-panel flex-1"
                  />
                  <ResourceItem
                    icon={Apple}
                    value={resourceDetails.resources.food}
                    color="text-danger-light"
                    tooltipLabel="Food"
                    className="bg-bg-panel flex-1"
                  />
                </div>
              </div>

              {/* Secondary Resources */}
              <div>
                <h4 className="text-xs text-text-dim mb-2 font-medium">
                  Secondary
                </h4>
                <div className="flex gap-3">
                  <ResourceItem
                    icon={Wheat}
                    value={resourceDetails.resources.wood}
                    color="text-brand"
                    tooltipLabel="Wood"
                    className="bg-bg-panel flex-1"
                  />
                  <ResourceItem
                    icon={Mountain}
                    value={resourceDetails.resources.stone}
                    color="text-text-muted"
                    tooltipLabel="Stone"
                    className="bg-bg-panel flex-1"
                  />
                  <ResourceItem
                    icon={Hammer}
                    value={resourceDetails.resources.iron}
                    color="text-text-secondary"
                    tooltipLabel="Iron"
                    className="bg-bg-panel flex-1"
                  />
                  <ResourceItem
                    icon={Gem}
                    value={resourceDetails.resources.gold}
                    color="text-accent"
                    tooltipLabel="Gold"
                    className="bg-bg-panel flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Valid Bonuses Text */}
            {resourceDetails.bonuses.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border-main">
                <h4 className="text-xs text-text-dim mb-2 font-medium">
                  Selected starting gains:
                </h4>
                <ul className="text-xs text-success space-y-1">
                  {resourceDetails.bonuses.map((bonus, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="mr-2">•</span> {bonus}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center py-4">
            <img
              src={currentImage}
              alt="Region Preview"
              className="rounded-lg border border-border-light shadow-lg w-full object-cover h-48 lg:h-56 transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="p-8 flex flex-col justify-center bg-bg-main">
          <h2 className="text-3xl font-bold mb-8 text-center text-text-main">
            City creation
          </h2>

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

            {/* Region */}
            <Select
              label="Select your region"
              name="region"
              value={formData.region || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a region...
              </option>
              <option value="Forest Realm">Forest Realm</option>
              <option value="Riverlands">Riverlands</option>
              <option value="Highland pass">Highland pass</option>
            </Select>

            {/* Focus */}
            <Select
              label="Select your starting focus"
              name="focus"
              value={formData.focus || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a focus...
              </option>
              <option value="Building">Building</option>
              <option value="Gathering">Gathering</option>
              <option value="Fighting">Fighting</option>
            </Select>

            <Button type="submit" className="mt-8">
              Create city
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GameStartModal;
