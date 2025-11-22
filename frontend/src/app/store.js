import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authslice";
import leadReducer from "../features/leads/leadSlice";
import taskReducer from "../features/tasks/taskSlice";
import dealReducer from "../features/deals/dealSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import statsReducer from "../features/stats/statsSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    
    leads: leadReducer,
    tasks: taskReducer,
    deals: dealReducer,
    notifications: notificationReducer,
    stats: statsReducer,
    dashboard: dashboardReducer,
  },
});
