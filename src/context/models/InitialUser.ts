import { User } from "../../interfaces/User";

export const initialUser: User | null = {
    lojaInfo: "",
    storeCode: "",
    username: "",
    permission: {
      admin: 0,
      auth: 0,
      cdge: 0,
      cdxp: 0,
      con: 0,
      crm: 0,
      dir: 0,
      exp: 0,
      fat: 0,
      fin: 0,
      fis: 0,
      ger: 0,
      lidv: 0,
      log: 0,
      loja: 0,
      mkt: 0,
      nfe: 0
    }
  }