import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
    token: string | null;
    authenticated: boolean | null;
    storeData: string | null;
    username: string | null;
    lojaInfo: string | null;
}

const initialState: AuthState = {
    token: null,
    authenticated: null,
    storeData: null,
    username: null,
    lojaInfo: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setAuthState(state, action: PayloadAction<AuthState>) {
        state.token = action.payload.token;
        state.authenticated = action.payload.authenticated;
        state.storeData = action.payload.storeData;
        state.username = action.payload.username;
        state.lojaInfo = action.payload.lojaInfo;
      },
      clearAuthState(state) {
        state.token = null;
        state.authenticated = false;
        state.storeData = null;
        state.username = null;
        state.lojaInfo = null;
      },
    },
  });

export const { setAuthState, clearAuthState } = authSlice.actions;

export const authReducer = authSlice.reducer;