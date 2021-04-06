export interface Utente {
  id: number;
  name: string;
  roles: string[];
}

export interface ContextUser {
  sessionId: string;
  userId: string;
  email: string;
  roles: string[];
  permissions: { [key: string]: string };
  extra: { [key: string]: string };
  applicazioni: ISessionLicenze;
}

export interface Context {
  user?: ContextUser | undefined;
}

export interface ISessionLicenze {
  licenza: {
    applicazione: string;
    applicazioneId: number;
  };
  roles: string[];
}
