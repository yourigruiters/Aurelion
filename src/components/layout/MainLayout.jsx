import React from "react";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import GameView from "./GameView";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-900 text-zinc-100 font-sans">
      {/* Top Navigation - Fixed height */}
      <div className="h-16 flex-none z-50 shadow-md">
        <TopBar />
      </div>

      {/* Middle Section - Flex row, takes remaining height */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Fixed width */}
        <aside className="w-64 flex-none border-r border-zinc-700 bg-zinc-800 z-40 shadow-lg">
          <LeftSidebar />
        </aside>

        {/* Central Map Area - Flexible */}
        <main className="flex-1 bg-zinc-900 relative overflow-hidden z-10">
          <GameView />
        </main>

        {/* Right Sidebar - Fixed width */}
        <aside className="w-72 flex-none border-l border-zinc-700 bg-zinc-800 z-40 shadow-lg">
          <RightSidebar />
        </aside>
      </div>

      {/* Bottom Footer - Fixed height (optional/minimal) */}
      <footer className="h-8 flex-none border-t border-zinc-700 bg-zinc-950 text-xs flex items-center px-4 z-50">
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
