import { Cliente } from "./Cliente";

export interface Nfe {
    clienteE: Cliente;
    nfe: string;
    notaFiscal: number;
    numeroDav: string;
    numeroPreNota: string;
    romaneio: string;
    status: string | null;
    dataEmissao: string;
  }
  