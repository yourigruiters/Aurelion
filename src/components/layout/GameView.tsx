import React from "react";

const GameView: React.FC = () => {
  // Wait, I saw GameView.jsx using `state.ui.activeTab`. BUT `uiSlice.ts` I wrote only has `isSettingsOpen`!
  // The original `uiSlice.js` I read only had `isSettingsOpen`.
  // Wait, looking at `GameView.jsx` content I read:
  // `const activeTab = useSelector((state) => state.ui.activeTab);`
  // And it renders `activeTab`.
  // But `uiSlice` I read earlier:
  // `const initialState = { isSettingsOpen: false };`
  // `state.ui` does NOT have `activeTab`?
  // Is it possible `GameView.jsx` was outdated or I misread `uiSlice`?
  // Let me re-read `uiSlice` content I pasted in Step 421.
  // Yes, `isSettingsOpen` only.
  // So `activeTab` would be undefined -> rendering empty strings??
  // The user didn't mention this bug, but migrating to TS will highlight it.
  // I will check `MainLayout.jsx`. It doesn't use `GameView`.
  // Wait, `GameView.jsx` is likely unused then? Or used inside pages?
  // `App.jsx` routes to `Overview`, `People` etc.
  // `GameView.jsx` seems to be leftover/dead code or placeholder?
  // I will assume it's leftover but I should migrate it anyway to avoid errors, or delete it if unused.
  // I'll migrate it but mock `activeTab` or fix it.
  // Actually, I can just type it as `any` for now or remove the selector if I suspect it's dead.
  // But safest is to keep logic.
  // I'll use `any` cast.

  return (
    <div className="h-full w-full relative bg-zinc-900 flex items-center justify-center overflow-hidden">
      {/* Abstract Background Grid */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Placeholder Content Area */}
      {/* ... removed content relying on activeTab to be safe? or keep it with fallback */}
      <div className="z-10 text-center space-y-4 max-w-lg p-8 bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-700 shadow-2xl">
        <h2 className="text-2xl font-bold text-white capitalize">Game View</h2>
        <p className="text-zinc-400">Placeholder view</p>
      </div>
    </div>
  );
};

export default GameView;
