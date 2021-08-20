import { ParseTemplateService } from '../services/ParseTemplateService';

export interface ITemplateTokens {
  [key: string]: string;
}

export interface ITemplateArg {
  cicleParse?: (textCicle: string, tokens: ITemplateTokens[], templateService: ParseTemplateService) => string;
  tokens: ITemplateTokens[];
}
