import { create } from 'zustand';

type AuditoriaItem = {
    id: number ;
    romaneio: string;
    codProduto: string;
    descricao: string;
    emb: string | null;
    eanProduto: string | null;
    useLog: string | null;
    qtdItens: number;
    qtdConferida: number | null;
    qtdTentativa: number | null;
    conferida: string;
    observation: string | null;
    qtdAuditada: number | null;
    auditado: string;
    codBarrasIu: string;
}

type RomaneioStore = {
    auditoria: AuditoriaItem[];
    getAuditoria: (auditoria: AuditoriaItem[]) => void;
}

export const useRomaneioStore = create<RomaneioStore>((set) => ({
    auditoria: [],
    getAuditoria: (auditoria) => set((state) => ({
        auditoria: auditoria
    })) 
})) 