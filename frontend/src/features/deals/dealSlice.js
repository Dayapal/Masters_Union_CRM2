// src/features/deals/dealSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchDealsAPI,
  fetchDealByIdAPI,
  createDealAPI,
  updateDealAPI,
  changeDealStatusAPI,
  addDealNoteAPI,
  deleteDealAPI,
} from "./dealAPI";

/** Thunks **/
export const fetchDeals = createAsyncThunk("deals/fetchDeals", async (_, { rejectWithValue }) => {
  try {
    return await fetchDealsAPI();
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchDealById = createAsyncThunk("deals/fetchDealById", async (id, { rejectWithValue }) => {
  try {
    return await fetchDealByIdAPI(id);
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createDeal = createAsyncThunk("deals/createDeal", async (payload, { rejectWithValue }) => {
  try {
    return await createDealAPI(payload);
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateDeal = createAsyncThunk("deals/updateDeal", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateDealAPI({ id, data });
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const changeDealStatus = createAsyncThunk(
  "deals/changeDealStatus",
  async ({ id, status, authorId }, { rejectWithValue }) => {
    try {
      return await changeDealStatusAPI({ id, status, authorId });
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addDealNote = createAsyncThunk("deals/addDealNote", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await addDealNoteAPI({ id, data });
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteDeal = createAsyncThunk("deals/deleteDeal", async (id, { rejectWithValue }) => {
  try {
    return await deleteDealAPI(id);
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

/** Slice **/
const initialState = {
  deals: [],
  deal: null,
  loading: false,
  error: null,
};

const dealSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    // local-only reducers if needed
    clearDeal(state) {
      state.deal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDeals
      .addCase(fetchDeals.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchDeals.fulfilled, (s, a) => {
        s.loading = false;
        s.deals = a.payload || [];
      })
      .addCase(fetchDeals.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error?.message;
      })

      // fetchDealById
      .addCase(fetchDealById.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchDealById.fulfilled, (s, a) => {
        s.loading = false;
        s.deal = a.payload;
      })
      .addCase(fetchDealById.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error?.message;
      })

      // createDeal
      .addCase(createDeal.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createDeal.fulfilled, (s, a) => {
        s.loading = false;
        s.deals.unshift(a.payload); // add to top
      })
      .addCase(createDeal.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error?.message;
      })

      // updateDeal
      .addCase(updateDeal.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateDeal.fulfilled, (s, a) => {
        s.loading = false;
        // update deal in list and current
        s.deals = s.deals.map((d) => (d.id === a.payload.id ? a.payload : d));
        s.deal = a.payload;
      })
      .addCase(updateDeal.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error?.message;
      })

      // changeDealStatus
      .addCase(changeDealStatus.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(changeDealStatus.fulfilled, (s, a) => {
        s.loading = false;
        // backend may return the created activity or updated deal — handle both
        if (a.payload?.deal) {
          s.deal = a.payload.deal;
          s.deals = s.deals.map((d) => (d.id === a.payload.deal.id ? a.payload.deal : d));
        } else if (a.payload?.id) {
          s.deal = a.payload;
          s.deals = s.deals.map((d) => (d.id === a.payload.id ? a.payload : d));
        }
      })
      .addCase(changeDealStatus.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error?.message;
      })

      // addDealNote
      .addCase(addDealNote.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(addDealNote.fulfilled, (s, a) => {
        s.loading = false;
        // backend returns created note or updated deal — keep it flexible
        if (a.payload?.note) {
          // optionally push note into a separate activity slice — here we don't manage activity
        }
      })
      .addCase(addDealNote.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error?.message;
      })

      // deleteDeal
      .addCase(deleteDeal.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(deleteDeal.fulfilled, (s, a) => {
        s.loading = false;
        const deletedId = a.payload?.id ?? a.meta.arg;
        s.deals = s.deals.filter((d) => d.id !== deletedId);
        if (s.deal?.id === deletedId) s.deal = null;
      })
      .addCase(deleteDeal.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error?.message;
      });
  },
});

export const { clearDeal } = dealSlice.actions;
export default dealSlice.reducer;
