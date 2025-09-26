import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import specializationReducer from "./specialization/SpecializationSlice";
import projectReducer from "./projects/ProjectSlice";
import workersReducer from "./worker/WorkerSlice";
import taskReducer from "./task/TaskSlice";
import subtaskReducer from "./subTask/SubTaskSlice";
import invoiceReducer from "./invoice/InvoiceSlice";
import payrollReducer from "./payRole/PayRole";
import shiftsReducer from "./shift/ShiftSlice";

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
import { sub } from "date-fns";

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  specializations: specializationReducer,
  projects: projectReducer,
  workers: workersReducer,
  tasks: taskReducer,
  subtasks: subtaskReducer,
  invoices: invoiceReducer,
  payroll: payrollReducer,
  shifts: shiftsReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persist store
export const persistor = persistStore(store);
