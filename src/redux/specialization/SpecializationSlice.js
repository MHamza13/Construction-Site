// src/redux/specialization/SpecializationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE + "/Specializations";

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

// ✅ GET All Specializations
export const fetchSpecializations = createAsyncThunk(
  "specializations/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const res = await axios.get(`${API_URL}/GetAll`, getAuthHeader(getState));


      const data = res.data;
      let items = [];

      if (Array.isArray(data)) {
        items = data.map((item) => ({
          id: item.id ?? item.value?.id,
          name: item.name ?? item.value?.name,
        }));
      }
      else if (data?.isSuccess && Array.isArray(data.value)) {
        items = data.value.map((item) => ({
          id: item.id,
          name: item.name,
        }));
      }
      else if (data?.isSuccess && data.value) {
        items = [
          {
            id: data.value.id,
            name: data.value.name,
          },
        ];
      }


      return items;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Error fetching specializations";
      console.error("Fetch Specializations Error:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ POST Create Specialization
export const addSpecialization = createAsyncThunk(
  "specializations/add",
  async (newSpec, { dispatch, rejectWithValue, getState }) => {
    try {
      const res = await axios.post(
        `${API_URL}/Create`,
        { name: newSpec.name },
        getAuthHeader(getState)
      );
      console.log("Add Specialization Response:", res.data); // Debug the response
      dispatch(fetchSpecializations());
      return res.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Error adding specialization";
      console.error("Add Specialization Error:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ DELETE Specialization
export const deleteSpecialization = createAsyncThunk(
  "specializations/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader(getState));
      return id;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Error deleting specialization";
      console.error("Delete Specialization Error:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const specializationSlice = createSlice({
  name: "specializations",
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchSpecializations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecializations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastUpdated = new Date().toISOString(); // 06:06 PM PKT, Sep 17, 2025
      })
      .addCase(fetchSpecializations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // POST
      .addCase(addSpecialization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSpecialization.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addSpecialization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DELETE
      .addCase(deleteSpecialization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSpecialization.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((s) => s.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteSpecialization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default specializationSlice.reducer;
