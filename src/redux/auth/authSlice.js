import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PURGE, REHYDRATE } from "redux-persist";
import { jwtDecode } from "jwt-decode";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// Generate chat ID
const generateChatId = (userId, activeChat) => {
  if (!activeChat) {
    throw new Error("activeChat is required for generating chat ID");
  }
  return `chat_${String(activeChat).trim()}`;
};

// Thunk: login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/Auth/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      // Decode JWT to extract role
      const decodedToken = jwtDecode(response.data.token);
      const role = decodedToken.role || null;

      // Generate chat ID using userId as activeChat
      const chatId = generateChatId(response.data.userId, response.data.userId);

      return {
        user: {
          userId: response.data.userId,
          email: response.data.user.email,
          name: response.data.user.name,
          surname: response.data.user.surname,
          role, // Add role from JWT
        },
        token: response.data.token,
        refreshToken: response.data.refreshToken || null,
        expiresAt:
          response.data.expiresAt ||
          new Date(decodedToken.exp * 1000).toISOString(),
        message: response.data.message,
        isGoToLogin: response.data.isGoToLogin,
        chatId, // Add chat ID
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunk: register user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/Auth/register`, userData, {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunk: fetch roles
export const fetchRoles = createAsyncThunk(
  "auth/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/Roles`, {
        headers: { accept: "*/*" },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunk: assign role
export const assignRole = createAsyncThunk(
  "auth/assignRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/Roles/assign`,
        { userId, role },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    refreshToken: null,
    expiresAt: null,
    chatId: null, // Add chatId to state
    loading: false,
    error: null,
    isAuthenticated: false,
    roles: [],
    roleAssignStatus: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.chatId = null; // Reset chatId
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.roles = [];
      state.roleAssignStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.chatId = action.payload.chatId; // Store chatId
        state.isAuthenticated = !!action.payload.token;
        state.error = null; // Clear any previous errors
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.chatId = null;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "User registered successfully";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })

      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload || [];
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch roles";
      })

      // Assign role
      .addCase(assignRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.roleAssignStatus = null;
      })
      .addCase(assignRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roleAssignStatus =
          action.payload.message || "Role assigned successfully";
      })
      .addCase(assignRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Role assignment failed";
        state.roleAssignStatus = null;
      })

      // Persist cleanup
      .addCase(PURGE, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.chatId = null; // Reset chatId
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
        state.roles = [];
        state.roleAssignStatus = null;
      })
      .addCase(REHYDRATE, (state, action) => {
        if (action.payload?.auth?.token) {
          state.user = action.payload.auth.user;
          state.token = action.payload.auth.token;
          state.refreshToken = action.payload.auth.refreshToken;
          state.expiresAt = action.payload.auth.expiresAt;
          state.chatId = action.payload.auth.chatId; // Rehydrate chatId
          state.isAuthenticated = true;
          state.roles = action.payload.auth.roles || [];
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
