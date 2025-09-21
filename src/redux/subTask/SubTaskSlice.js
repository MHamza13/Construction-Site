import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const SUBTASK_API_URL = process.env.NEXT_PUBLIC_API_BASE;

// 🔹 Helper: Get authentication header
const getAuthHeader = (getState) => {
  const token = getState().auth?.token;
  return {
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ===========================================================
   SUBTASKS THUNKS
=========================================================== */

// ✅ Fetch subtasks of a task
export const fetchSubtasks = createAsyncThunk(
  "subtasks/fetchSubtasks",
  async (taskId, { rejectWithValue, getState }) => {
    try {
      const res = await axios.get(
        `${SUBTASK_API_URL}/tasks/${taskId}/subtasks`,
        getAuthHeader(getState)
      );
      return { taskId, subtasks: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Create subtask under a task
export const createSubtask = createAsyncThunk(
  "subtasks/createSubtask",
  async ({ taskId, subtaskData }, { rejectWithValue, getState }) => {
    try {
      const res = await axios.post(
        `${SUBTASK_API_URL}/tasks/${taskId}/subtasks`,
        subtaskData,
        getAuthHeader(getState)
      );
      return { taskId, subtask: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Get subtask by ID
export const fetchSubtaskById = createAsyncThunk(
  "subtasks/fetchSubtaskById",
  async (subTaskId, { rejectWithValue, getState }) => {
    try {
      const res = await axios.get(
        `${SUBTASK_API_URL}/subtasks/${subTaskId}`,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===========================================================
   SUBTASK SLICE
=========================================================== */
const subtaskSlice = createSlice({
  name: "subtasks",
  initialState: {
    subtasks: {},
    currentSubtask: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentSubtask: (state) => {
      state.currentSubtask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* SUBTASKS REDUCERS */
      .addCase(fetchSubtasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubtasks.fulfilled, (state, action) => {
        state.loading = false;
        state.subtasks[action.payload.taskId] = action.payload.subtasks;
      })
      .addCase(fetchSubtasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createSubtask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSubtask.fulfilled, (state, action) => {
        const { taskId, subtask } = action.payload;
        if (!state.subtasks[taskId]) state.subtasks[taskId] = [];
        state.subtasks[taskId].push(subtask);
        state.loading = false;
      })
      .addCase(createSubtask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSubtaskById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubtaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubtask = action.payload;
      })
      .addCase(fetchSubtaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentSubtask } = subtaskSlice.actions;
export default subtaskSlice.reducer;
