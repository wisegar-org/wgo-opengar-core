export interface ILanguage {
  id: number;
  code: string;
  enabled: boolean;
  default: boolean;
  logoId: number;
}

export type TransaltionsType = {
  [key: string]: string;
};

export type CultureTranslation = {
  [key: string]: string;
};

export type TranslationsByCulture = {
  [key: string]: CultureTranslation;
};
