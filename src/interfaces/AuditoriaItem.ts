export interface Audititem {
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
    qtdAuditada: number | null;
    auditado: string;
    codBarrasIu: string;
}