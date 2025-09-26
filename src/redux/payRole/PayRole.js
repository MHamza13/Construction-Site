import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE + "/Payroll";

// Thunk for fetching payroll data with date range
export const fetchPayroll = createAsyncThunk(
  "payroll/fetchPayroll",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch payroll data"
      );
    }
  }
);

const payrollSlice = createSlice({
  name: "payroll",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default payrollSlice.reducer;
