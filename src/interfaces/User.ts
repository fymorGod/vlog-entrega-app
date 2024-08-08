interface Permissions {
    admin: number;
    auth: number;
    cdge: number;
    cdxp: number;
    con: number;
    crm: number;
    dir: number;
    exp: number;
    fat: number;
    fin: number;
    fis: number;
    ger: number;
    lidv: number;
    log: number;
    loja: number;
    mkt: number;
    nfe: number;
}

export interface User {
    username: string;
    lojaInfo: string;
    storeCode: string;
    permission: Permissions | null;
  }