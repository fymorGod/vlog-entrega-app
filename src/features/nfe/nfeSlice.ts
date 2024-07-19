import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NfeProps {
  clienteE: {
    id: number;
    cpfCliente: string;
    nome: string;
  }
  nfe: string;
  notaFiscal: number | null;
  numeroDav: string | null;
  numeroPreNota: string | null;
  romaneio: number | null;
  status: string | null;
}

interface NfeState {
  nfeData: NfeProps[];
}

const initialState: NfeState = {
  nfeData: [],
};

const nfeSlice = createSlice({
  name: 'nfe',
  initialState,
  reducers: {
    setNfeData(state, action: PayloadAction<NfeProps[]>) {
      state.nfeData = action.payload;
    },
    clearNfeData(state) {
      state.nfeData = [];
    },
  },
});

export const { setNfeData, clearNfeData } = nfeSlice.actions;

export default nfeSlice.reducer;
