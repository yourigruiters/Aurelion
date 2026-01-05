import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Footer from "./Footer";
import DayProgressBar from "./DayProgressBar";

import { useSelector, useDispatch } from "react-redux";
import GameStartModal from "../GameStartModal";
import { RootState } from "../../store/store";
import { advanceDay } from "../../store/resourcesSlice";
import { tickTime, resetDayTime } from "../../store/gameSlice";
import { useEffect } from "react";
import { DAY_DURATION_MS } from "../../helpers/game";

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { gameStarted, dayTime } = useSelector(
    (state: RootState) => state.game
  );
  const [isRightSidebarOpen, setIsRightSidebarOpen] = React.useState(true);

  // Game Loop: Tick Time
  useEffect(() => {
    if (!gameStarted) return;

    const intervalId = setInterval(() => {
      dispatch(tickTime(1000));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [gameStarted, dispatch]);

  // Game Loop: Check Day End
  useEffect(() => {
    if (dayTime >= DAY_DURATION_MS) {
      dispatch(advanceDay());
      dispatch(resetDayTime());
    }
  }, [dayTime, dispatch]);

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg-main text-text-main font-sans">
      {!gameStarted && <GameStartModal />}
      {/* Top Navigation - Fixed height */}
      <div className="h-16 flex-none z-50 shadow-md">
        <TopBar
          isRightSidebarOpen={isRightSidebarOpen}
          onToggleRightSidebar={toggleRightSidebar}
        />
      </div>

      <div className="flex-none">
        <DayProgressBar />
      </div>

      {/* Middle Section - Flex row, takes remaining height */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Fixed width */}
        <aside className="w-auto flex-none border-r border-border-main bg-bg-panel z-40 shadow-lg lg:w-64">
          <LeftSidebar />
        </aside>

        {/* Central Map Area - Flexible */}
        <main className="flex-1 bg-bg-main relative overflow-hidden z-10 flex">
          <Outlet />
        </main>

        {/* Right Sidebar - Flexible width based on toggle */}
        {isRightSidebarOpen && (
          <aside className="w-auto flex-none border-l border-border-main bg-bg-panel z-40 shadow-lg transition-all duration-300 lg:w-64">
            <RightSidebar />
          </aside>
        )}
      </div>

      {/* Bottom Footer - Fixed height (optional/minimal) */}
      <footer className="h-8 flex-none border-t border-border-main bg-bg-dark text-xs flex items-center px-4 z-50">
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
