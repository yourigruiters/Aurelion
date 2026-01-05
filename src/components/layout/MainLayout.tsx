import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Footer from "./Footer";
import DayProgressBar from "./DayProgressBar";

import { useSelector, useDispatch } from "react-redux";
import GameStartModal from "../GameStartModal";
import { RootState, AppDispatch } from "../../store/store";
// import { advanceDay } from "../../store/resourcesSlice";
import { handleDayRollover } from "../../store/gameThunks";
import { toggleRightSidebar, tickTime } from "../../store/gameSlice";
import { DAY_DURATION_MS } from "../../helpers/game";
// ...

const MainLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { gameStarted, dayTime, isRightSidebarOpen } = useSelector(
    (state: RootState) => state.game
  );
  // Removed local state

  // Game Loop
  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameStarted) {
      interval = setInterval(() => {
        dispatch(tickTime(100)); // Tick every 100ms

        // Check for day rollover
        // Note: dayTime is updated in Redux, but we need to check the state.
        // However, since we are inside useEffect with only gameStarted dependency (initially),
        // we might have stale state if we don't depend on dayTime.
        // BETTER APPROACH: Check this in the reducer or pass current time to tickTime?
        // OR: Just rely on the component re-rendering with new dayTime.
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, dispatch]);

  // Check for day rollover in a separate effect that tracks dayTime
  React.useEffect(() => {
    if (gameStarted && dayTime >= DAY_DURATION_MS) {
      dispatch(handleDayRollover());
    }
  }, [dayTime, gameStarted, dispatch]);

  const handleToggleRightSidebar = () => {
    dispatch(toggleRightSidebar());
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg-main text-text-main font-sans">
      {!gameStarted && <GameStartModal />}
      {/* Top Navigation - Fixed height */}
      <div className="h-16 flex-none z-50 shadow-md">
        <TopBar
          isRightSidebarOpen={isRightSidebarOpen}
          onToggleRightSidebar={handleToggleRightSidebar}
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
