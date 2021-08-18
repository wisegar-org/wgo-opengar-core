import { existsSync, unlinkSync, writeFileSync } from 'fs-extra';
import { join, normalize } from 'path';
import { ITemplateArg, ITemplateTokens } from '../models/TemplateTokens';

export * from '../models/TemplateTokens';

export class ParseTemplateService {
  replaceTokens(body: string, tokens: ITemplateTokens) {
    let result = body;
    Object.keys(tokens).forEach((token: string) => {
      result = result.split(token).join(tokens[token]);
    });
    return result;
  }

  async parseDocumentBody(documentHTML: string, styleHTML: string, tokens: ITemplateTokens, config: ITemplateArg) {
    let documentResult = this.replaceTokens(documentHTML, <ITemplateTokens>{ '[STYLE]': styleHTML });
    const cicle = documentResult.split('[CICLE]');
    documentResult = cicle.splice(0, 1)[0];
    cicle.forEach((element: string) => {
      const strPatern = element.split('[/CICLE]');
      const patern = strPatern.splice(0, 1)[0];
      const result = config.cicleParse(patern, config.tokens, this);
      documentResult += `${result}${strPatern.join('[/CICLE]')}`;
    });
    documentResult = this.replaceTokens(documentResult, tokens);
    return documentResult;
  }

  createDocument(exportPath: string, titleDoc: string, documentHTML: string) {
    if (existsSync(exportPath)) {
      const pathFile = normalize(join(exportPath, titleDoc));
      if (existsSync(pathFile)) {
        unlinkSync(pathFile);
      }
      writeFileSync(pathFile, documentHTML, { encoding: 'utf-8' });
      return true;
    } else {
      return false;
    }
  }
}
