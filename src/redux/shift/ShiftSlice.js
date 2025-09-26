// src/redux/shifts/shiftsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE + "/Shifts";

// Helper: Get token from Redux state
const getAuthHeader = (getState) => {
  const token = getState().auth?.token;
  return token
    ? {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    : { headers: { accept: "*/*" } };
};

// ✅ 1. Check-in
export const checkInShift = createAsyncThunk(
  "shifts/checkIn",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const res = await axios.post(
        `${API_URL}/checkin`,
        payload,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ 2. End shift
export const endShift = createAsyncThunk(
  "shifts/endShift",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const res = await axios.post(
        `${API_URL}/endshift`,
        payload,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ 3. Get all shifts (Admin only)
export const fetchAllShifts = createAsyncThunk(
  "shifts/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const res = await axios.get(`${API_URL}/all`, getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ 4. Get shifts by workerId
export const fetchWorkerShifts = createAsyncThunk(
  "shifts/fetchWorker",
  async (workerId, { rejectWithValue, getState }) => {
    try {
      const res = await axios.get(
        `${API_URL}/worker/${workerId}`,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ 5. Get shifts by workerId + date
export const fetchWorkerShiftsByDate = createAsyncThunk(
  "shifts/fetchWorkerByDate",
  async ({ workerId, shiftDate }, { rejectWithValue, getState }) => {
    try {
      const res = await axios.get(
        `${API_URL}/worker/${workerId}/date/${shiftDate}`,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const shiftsSlice = createSlice({
  name: "shifts",
  initialState: {
    shifts: [],
    workerShifts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Checkin
      .addCase(checkInShift.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkInShift.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts.push(action.payload);
      })
      .addCase(checkInShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ EndShift
      .addCase(endShift.pending, (state) => {
        state.loading = true;
      })
      .addCase(endShift.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(endShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch All
      .addCase(fetchAllShifts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload;
      })
      .addCase(fetchAllShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Worker shifts
      .addCase(fetchWorkerShifts.fulfilled, (state, action) => {
        state.workerShifts = action.payload;
      })

      // ✅ Worker shifts by date
      .addCase(fetchWorkerShiftsByDate.fulfilled, (state, action) => {
        state.workerShifts = action.payload;
      });
  },
});

export default shiftsSlice.reducer;
