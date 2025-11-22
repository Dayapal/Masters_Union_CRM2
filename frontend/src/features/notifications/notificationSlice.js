import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNotificationsAPI,
  getUnreadNotificationsAPI,
  markAsReadAPI,
  markAllAsReadAPI,
  deleteNotificationAPI
} from "./notificationAPI";

// GET ALL
export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (userId, thunkAPI) => {
    try {
      const res = await getNotificationsAPI(userId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// GET UNREAD
export const fetchUnreadNotifications = createAsyncThunk(
  "notifications/fetchUnread",
  async (userId, thunkAPI) => {
    try {
      const res = await getUnreadNotificationsAPI(userId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// MARK AS READ
export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id, thunkAPI) => {
    try {
      const res = await markAsReadAPI(id);
      return res.data.notification;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// MARK ALL READ
export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (userId, thunkAPI) => {
    try {
      const res = await markAllAsReadAPI(userId);
      return res.data.updated;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// DELETE
export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id, thunkAPI) => {
    try {
      await deleteNotificationAPI(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unread: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.unread = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.items = state.items.map((n) =>
          n.id === action.payload.id ? action.payload : n
        );
        state.unread = state.unread.filter((n) => n.id !== action.payload.id);
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, isRead: true }));
        state.unread = [];
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n.id !== action.payload);
        state.unread = state.unread.filter((n) => n.id !== action.payload);
      });
  }
});

export default notificationSlice.reducer;
