// src/redux/projects/ProjectSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE + "/Projects";

// 🔑 Helper: Auth header
const getAuthHeader = (getState) => {
  const token = getState().auth?.token;
  return {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// ✅ Get all projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue, getState }) => {
    try {
      const res = await axios.get(API_URL, getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Get by ID
export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`, getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Create Project (managerId = null, metadata object, command field required)
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue, getState }) => {
    try {
      const payload = {
        ...projectData,
      };

      const res = await axios.post(API_URL, payload, getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Update Project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, updatedData }, { rejectWithValue, getState }) => {
    try {
      const res = await axios.put(
        `${API_URL}/${id}`,
        updatedData,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Delete Project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue, getState }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader(getState));
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    items: [],
    currentProject: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })

      .addCase(createProject.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateProject.fulfilled, (state, action) => {
        state.items = state.items.map((proj) =>
          proj.id === action.payload.id ? action.payload : proj
        );
      })

      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((proj) => proj.id !== action.payload);
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
