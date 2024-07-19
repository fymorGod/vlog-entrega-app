import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth/authSlice';
import nfeReducer from '../features/nfe/nfeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    nfe: nfeReducer,
  },
});

type GetStateType = typeof store.getState

export type RootState = ReturnType<GetStateType>
