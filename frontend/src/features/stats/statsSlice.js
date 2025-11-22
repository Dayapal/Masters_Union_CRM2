import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserStatsAPI } from "./statsAPI";

// thunk
export const fetchUserStats = createAsyncThunk(
  "stats/fetchUserStats",
  async (userId, thunkAPI) => {
    try {
      const res = await getUserStatsAPI(userId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const statsSlice = createSlice({
  name: "stats",
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {
    clearStats(state) {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearStats } = statsSlice.actions;
export default statsSlice.reducer;
