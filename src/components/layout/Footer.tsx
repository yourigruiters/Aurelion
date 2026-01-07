import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, RefreshCw } from "lucide-react";
import { useDispatch } from "react-redux";
import { resetGame } from "../../store/gameSlice";
import { resetResources } from "../../store/resourcesSlice";

import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReset = () => {
    dispatch(resetGame());
    dispatch(resetResources());
    navigate("/overview");
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
        <Link
          to="/players-guide"
          className="hover:text-text-secondary transition-colors"
        >
          Players guide
        </Link>
        <span className="hidden md:inline text-border-main">|</span>
        <Link to="/players-guide">
          <HelpCircle
            size={14}
            className="cursor-pointer hover:text-text-secondary"
          />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
