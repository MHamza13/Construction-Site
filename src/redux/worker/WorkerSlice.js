"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 Base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE + "/Workers";

// 🔑 Auth header helper
const getAuthHeader = (getState) => {
  const token = getState().auth?.token;
  return {
    headers: {
      accept: "*/*", // 👈 added
      Authorization: `Bearer ${token}`,
    },
  };
};

// 🔹 Async Thunks

export const fetchWorkers = createAsyncThunk(
  "workers/fetchWorkers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { lastFetched, cacheExpiry, items } = state.workers;
      
      // Check if we have cached data that's still valid
      if (items.length > 0 && lastFetched && 
          (Date.now() - lastFetched) < cacheExpiry) {
        console.log("Using cached workers data");
        return { data: items, fromCache: true };
      }
      
      const res = await axios.get(BASE_URL, getAuthHeader(getState));
      return { data: res.data, fromCache: false };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createWorker = createAsyncThunk(
  "workers/createWorker",
  async (workerData, { rejectWithValue, getState }) => {
    try {
      const res = await axios.post(
        BASE_URL,
        workerData,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchWorkerById = createAsyncThunk(
  "workers/fetchWorkerById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`, getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateWorker = createAsyncThunk(
  "workers/updateWorker",
  async ({ id, data }, { rejectWithValue, getState }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/${id}`,
        data,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteWorker = createAsyncThunk(
  "workers/deleteWorker",
  async (id, { rejectWithValue, getState }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`, getAuthHeader(getState));
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateWorkerStatus = createAsyncThunk(
  "workers/updateWorkerStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/${id}/status`,
        { status },
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Slice
const workersSlice = createSlice({
  name: "workers",
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
    lastFetched: null,
    cacheExpiry: 5 * 60 * 1000, // 5 minutes cache
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchWorkers
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        if (!action.payload.fromCache) {
          state.lastFetched = Date.now();
        }
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createWorker
      .addCase(createWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorker.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchWorkerById
      .addCase(fetchWorkerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkerById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchWorkerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateWorker
      .addCase(updateWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorker.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((w) =>
          w.id === action.payload.id ? action.payload : w
        );
      })
      .addCase(updateWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteWorker
      .addCase(deleteWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorker.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((w) => w.id !== action.payload);
      })
      .addCase(deleteWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateWorkerStatus
      .addCase(updateWorkerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkerStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((w) =>
          w.id === action.payload.id ? action.payload : w
        );
      })
      .addCase(updateWorkerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default workersSlice.reducer;
