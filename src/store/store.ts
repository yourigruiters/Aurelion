import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import resourcesReducer from "./resourcesSlice";
import uiReducer from "./uiSlice";
import gameReducer from "./gameSlice";

const rootReducer = combineReducers({
  resources: resourcesReducer,
  ui: uiReducer,
  game: gameReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  migrate: (_state: any) => {
    // Simple migration: if version changed (or undefined), just return undefined to reset
    return Promise.resolve(undefined);
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
