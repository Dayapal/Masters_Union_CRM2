import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getActivityByLeadAPI,
  addNoteAPI,
  addStatusChangeAPI
} from "./activityAPI";

export const fetchActivity = createAsyncThunk(
  "activity/fetch",
  async (leadId, thunkAPI) => {
    try {
      const res = await getActivityByLeadAPI(leadId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ADD NOTE
export const addNote = createAsyncThunk(
  "activity/addNote",
  async ({ leadId, content, authorId }, thunkAPI) => {
    try {
      const res = await addNoteAPI(leadId, { content, authorId });
      return res.data.activity;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ADD STATUS CHANGE
export const addStatusChange = createAsyncThunk(
  "activity/status",
  async ({ leadId, status, authorId }, thunkAPI) => {
    try {
      const res = await addStatusChangeAPI(leadId, { status, authorId });
      return res.data.activity;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    timeline: [],
    loading: false,
    error: null
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchActivity.fulfilled, (state, action) => {
        state.timeline = action.payload;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.timeline.unshift(action.payload);
      })
      .addCase(addStatusChange.fulfilled, (state, action) => {
        state.timeline.unshift(action.payload);
      });
  }
});

export default activitySlice.reducer;
