import React from "react";
import { HelpCircle } from "lucide-react";

const Footer = () => {
  return (
    <div className="w-full flex justify-between items-center text-zinc-500">
      <div className="flex items-center space-x-4">
        <span>Build 0.1.0-alpha</span>
        <span className="hidden md:inline text-zinc-700">|</span>
        <span className="hidden md:inline">Server: Europe-West</span>
      </div>

      <div className="flex items-center space-x-4">
        <a href="#" className="hover:text-zinc-300 transition-colors">
          Support
        </a>
        <a href="#" className="hover:text-zinc-300 transition-colors">
          Discord
        </a>
        <HelpCircle size={14} className="cursor-pointer hover:text-zinc-300" />
      </div>
    </div>
  );
};

export default Footer;
