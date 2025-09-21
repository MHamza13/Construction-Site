import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE +"/Invoices";

// ------- Thunks (API calls) -------

// Create new invoice
export const createInvoice = createAsyncThunk(
  "invoices/createInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, invoiceData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get all invoices
export const fetchInvoices = createAsyncThunk(
  "invoices/fetchInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get invoice by id
export const fetchInvoiceById = createAsyncThunk(
  "invoices/fetchInvoiceById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update invoice
export const updateInvoice = createAsyncThunk(
  "invoices/updateInvoice",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete invoice (soft delete)
export const deleteInvoice = createAsyncThunk(
  "invoices/deleteInvoice",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update invoice status
export const updateInvoiceStatus = createAsyncThunk(
  "invoices/updateInvoiceStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/status`, { status });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Mark invoice as paid
export const payInvoice = createAsyncThunk(
  "invoices/payInvoice",
  async ({ id, payment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${id}/pay`, payment);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ------- Slice -------
const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    items: [],
    selectedInvoice: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.items = state.items.map((inv) =>
          inv.id === action.payload.id ? action.payload : inv
        );
        if (state.selectedInvoice?.id === action.payload.id) {
          state.selectedInvoice = action.payload;
        }
      })

      // Delete
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.items = state.items.filter((inv) => inv.id !== action.payload);
      })

      // Update Status
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
        state.items = state.items.map((inv) =>
          inv.id === action.payload.id ? action.payload : inv
        );
      })

      // Pay
      .addCase(payInvoice.fulfilled, (state, action) => {
        state.items = state.items.map((inv) =>
          inv.id === action.payload.id ? action.payload : inv
        );
      });
  },
});

export const { clearSelectedInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
