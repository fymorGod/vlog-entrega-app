export interface Audititem {
    id: number ;
    romaneio: string;
    codProduto: string;
    descricao: string;
    emb: string | null;
    eanProduto: string | null;
    qtdItens: number;
    qtdConferida: number | null;
    conferida: string;
    qtdAuditada: number | null;
    auditado: string;
    codBarrasIu: string;
}