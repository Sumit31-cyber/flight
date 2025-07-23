import { reduxPersistStorage } from "@/utils/MMKVStorage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import sharedReducer from "./slice/sharedSlice";

// Combine reducers
const rootReducer = combineReducers({
  shared: sharedReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: "root",
  storage: reduxPersistStorage,
  whitelist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/PURGE"],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };

export const clearAllPersistedData = async () => {
  try {
    await persistor.purge();
    console.log("All persisted data cleared successfully");
  } catch (error) {
    console.error("Error clearing persisted data:", error);
  }
};
