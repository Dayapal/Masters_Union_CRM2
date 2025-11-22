import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTaskAPI,
  getTasksAPI,
  getTaskByIdAPI,
  updateTaskAPI,
  deleteTaskAPI,
  getTasksByLeadAPI
} from "./taskAPI";

// GET ALL TASKS
export const fetchTasks = createAsyncThunk("tasks/fetch", async (_, thunkAPI) => {
  try {
    const res = await getTasksAPI();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// GET TASK BY ID
export const fetchTaskById = createAsyncThunk(
  "tasks/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await getTaskByIdAPI(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// GET TASKS OF A LEAD
export const fetchTasksByLead = createAsyncThunk(
  "tasks/byLead",
  async (leadId, thunkAPI) => {
    try {
      const res = await getTasksByLeadAPI(leadId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// CREATE
export const createTask = createAsyncThunk(
  "tasks/create",
  async (data, thunkAPI) => {
    try {
      const res = await createTaskAPI(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// UPDATE
export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateTaskAPI(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// DELETE
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id, thunkAPI) => {
    try {
      await deleteTaskAPI(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    selectedTask: null,
    loading: false,
    error: null
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.selectedTask = action.payload;
      })
      .addCase(fetchTasksByLead.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      });
  }
});

export default taskSlice.reducer;
