import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createLeadAPI,
  getLeadsAPI,
  getLeadByIdAPI,
  updateLeadAPI,
  deleteLeadAPI,
  assignLeadAPI,
  updateLeadStatusAPI,
  addLeadNoteAPI
} from "./leadAPI";

// FETCH ALL LEADS
export const fetchLeads = createAsyncThunk(
  "leads/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await getLeadsAPI();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// FETCH SINGLE LEAD
export const fetchLeadById = createAsyncThunk(
  "leads/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await getLeadByIdAPI(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// CREATE LEAD
export const createLead = createAsyncThunk(
  "leads/create",
  async (leadData, thunkAPI) => {
    try {
      const res = await createLeadAPI(leadData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// UPDATE LEAD
export const updateLead = createAsyncThunk(
  "leads/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateLeadAPI(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// DELETE LEAD
export const deleteLead = createAsyncThunk(
  "leads/delete",
  async (id, thunkAPI) => {
    try {
      await deleteLeadAPI(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ASSIGN LEAD
export const assignLead = createAsyncThunk(
  "leads/assign",
  async ({ id, ownerId }, thunkAPI) => {
    try {
      const res = await assignLeadAPI(id, { ownerId });
      return res.data.lead;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// UPDATE STATUS
export const updateLeadStatus = createAsyncThunk(
  "leads/status",
  async ({ id, status, changedById }, thunkAPI) => {
    try {
      const res = await updateLeadStatusAPI(id, { status, changedById });
      return res.data.lead;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ADD NOTE TO LEAD
export const addLeadNote = createAsyncThunk(
  "leads/addNote",
  async ({ id, content, authorId }, thunkAPI) => {
    try {
      const res = await addLeadNoteAPI(id, { content, authorId });
      return { leadId: id, note: res.data.note };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ===================================================
// SLICE
// ===================================================

const leadSlice = createSlice({
  name: "leads",
  initialState: {
    leads: [],
    selectedLead: null,
    loading: false,
    error: null
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH ALL LEADS
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH SINGLE
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.selectedLead = action.payload;
      })

      // CREATE
      .addCase(createLead.fulfilled, (state, action) => {
        state.leads.push(action.payload);
      })

      // UPDATE
      .addCase(updateLead.fulfilled, (state, action) => {
        state.leads = state.leads.map((l) =>
          l.id === action.payload.id ? action.payload : l
        );
      })

      // DELETE
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter((l) => l.id !== action.payload);
      })

      // ASSIGN
      .addCase(assignLead.fulfilled, (state, action) => {
        state.leads = state.leads.map((l) =>
          l.id === action.payload.id ? action.payload : l
        );
      })

      // UPDATE STATUS
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        state.leads = state.leads.map((l) =>
          l.id === action.payload.id ? action.payload : l
        );
      })

      // ADD NOTE
      .addCase(addLeadNote.fulfilled, (state, action) => {
        const lead = state.leads.find((l) => l.id === action.payload.leadId);
        if (lead) {
          lead.notes = [...(lead.notes || []), action.payload.note];
        }
      });
  }
});

export default leadSlice.reducer;
