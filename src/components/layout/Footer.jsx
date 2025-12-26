import React from "react";
import { HelpCircle, RefreshCw } from "lucide-react";
import { useDispatch } from "react-redux";
import { resetGame } from "../../store/gameSlice";
import { resetResources } from "../../store/resourcesSlice";

const Footer = () => {
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetGame());
    dispatch(resetResources());
  };

  return (
    <div className="w-full flex justify-between items-center text-text-dim">
      <div className="flex items-center space-x-4">
        <span>Copyright © 2025 Aurelion</span>
        <span className="hidden md:inline text-border-main">|</span>
        <span className="hidden md:inline">Build 0.1.0-alpha</span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleReset}
          className="flex items-center space-x-1 hover:text-danger-light transition-colors mr-2 group"
        >
          <RefreshCw
            size={14}
            className="group-hover:rotate-180 transition-transform duration-500"
          />
          <span>Reset Game</span>
        </button>

        <span className="hidden md:inline text-border-main">|</span>
        <a href="#" className="hover:text-text-secondary transition-colors">
          Support
        </a>
        <span className="hidden md:inline text-border-main">|</span>
        <HelpCircle
          size={14}
          className="cursor-pointer hover:text-text-secondary"
        />
      </div>
    </div>
  );
};

export default Footer;
