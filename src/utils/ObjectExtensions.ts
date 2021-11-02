import * as dns from 'dns';
import moment from 'moment';

export const IsFuncAndDefined = (object: any) => {
  return !IsNullOrUndefined(object) && typeof object === 'function';
};

export const IsNotStringOrEmpty = (object: any) => {
  return typeof object !== 'string' || object === '';
};

export const IsFunc = (object: unknown) => {
  return typeof object === 'function';
};

export const IsDefinedFunc = (object: unknown) => {
  return !IsNullOrUndefined(object) && typeof object === 'function';
};

export const IsArray = (object: unknown) => {
  return Array.isArray(object);
};

export const IsNotArrayOrEmpty = (object: unknown) => {
  return IsNullOrUndefined(object) || !Array.isArray(object) || object.length === 0;
};

export const IsStringEmpty = (str: unknown) => {
  return (typeof str === 'string' || str instanceof String) && str.trim() === '';
};
export const IsObject = (object: any) => {
  typeof object === 'object' && object !== null;
};
export const ContainsById = (arrayObj: any[], id: any) => {
  if (IsNullOrUndefined(arrayObj) || IsNotArrayOrEmpty(arrayObj)) {
    return false;
  }
  const index = arrayObj.findIndex((obj: any) => {
    return obj.id === id;
  });

  return index !== -1;
};

export const StringToBoolean = (strObj: string) => {
  return IsStringEmptyNullOrUndefined(strObj) ? false : strObj === '1';
};

export const HtmlToText = (html: string) => {
  html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
  html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
  html = html.replace(/<\/div>/gi, '\n');
  html = html.replace(/<\/li>/gi, '\n');
  html = html.replace(/<li>/gi, '  *  ');
  html = html.replace(/<\/ul>/gi, '\n');
  html = html.replace(/<\/p>/gi, '\n');
  html = html.replace(/<br\s*[/]?>/gi, '\n');
  html = html.replace(/<[^>]+>/gi, '');
  return html;
};

export const SubString = (str: string, max: number) => {
  if (IsNullOrUndefined(str)) return '';
  if (str.length <= max) return str;
  return str.slice(0, max);
};
export const IsOnline = () => {
  return navigator.onLine;
};

export const StableSort = (array: any[], cmp: (arg0: any, arg1: any) => any) => {
  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: number[], b: number[]) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el: any[]) => el[0]);
};

export const GetSorting = (order: string, orderBy: any) => {
  return order === 'desc' ? (a: any, b: any) => Desc(a, b, orderBy) : (a: any, b: any) => Desc(a, b, orderBy);
};

export const Desc = (a: { [x: string]: number }, b: { [x: string]: number }, orderBy: string | number) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const EvaluateExpresion = (textToEval: string, objectEval: any, delimiterBefor: string, delimiterAfter: string) => {
  let _delimiterBfr = delimiterBefor || '[';
  let _delimiterAft = delimiterAfter || '[';
  if (IsNullOrUndefined(textToEval)) return '';
  if (IsNullOrUndefined(objectEval)) return textToEval;

  let resultTest = '';
  textToEval.split(_delimiterBfr).forEach((text: string) => {
    let temp = text.split(_delimiterAft);
    let prop = temp[0].charAt(0).toLowerCase() + temp[0].slice(1);
    if (temp.length >= 1 && prop in objectEval) {
      resultTest += objectEval[prop];
      temp.shift();
    }
    resultTest += temp.join(_delimiterAft);
  });

  return resultTest;
};

export const IsUndefined = (obj: object) => {
  return obj === undefined;
};
export const IsNull = (obj: any) => {
  return obj === null;
};
export const useNullableNumber = (obj: any) => {
  return obj === new Number() && obj === 0 ? null : (obj as number);
};
export const IsNullOrUndefined = (obj: any) => {
  return IsNull(obj) || IsUndefined(obj);
};
export const IsStringEmptyNullOrUndefined = (obj: string) => {
  return IsNullOrUndefined(obj) || obj === '';
};
export const IsString = (obj: any) => {
  return typeof obj === 'string';
};
export function getNameOf<T>(key: keyof T, instance?: T): keyof T {
  return key;
}
export function getValueOf<T>(key: keyof T, instance: T): keyof T {
  return instance[key.toString()];
}
export function IsKeyOf<T>(key: any, instance: T): key is keyof T {
  return key in instance;
}
export function getAsKeyOf<T>(key: string, instance: T): keyof T {
  if (IsKeyOf(key, instance)) return key as keyof T;
  throw new Error('Invalid keyof instance T');
}
/**
 * @class Estensione della classe Error per gestire errori di validazioni
 */
export class ValidationError extends Error {
  public data: ValidationError[];
  constructor(message, data) {
    super(message);
    this.data = data;
  }
}
export const stringToBoolean = (strObj: string): boolean => {
  return IsStringEmptyNullOrUndefined(strObj) ? false : strObj === '1';
};
export const stringToDate = (strObj: string): Date => {
  if (IsStringEmptyNullOrUndefined(strObj)) return null;
  const strDate = moment.utc(strObj, 'YYYYMMDD');
  if (!strDate.isValid()) return null;
  return strDate.toDate();
};
export const DateToString = (DateObj: Date): string => {
  if (IsNullOrUndefined(DateObj)) return '';
  return moment(DateObj).format('YYYYMMDD');
};

/**
 * @deprecated Utilizzare i validatori della libreria class-validator (@IsEmail())
 * @function EmailValidation Permette la validazione di una striga che rappresenta un indirizzo email
 */
export const EmailValidation = (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (IsStringEmptyNullOrUndefined(email)) {
      reject('The email is required');
    }
    const predomain = email.split('@')[0];
    if (IsStringEmptyNullOrUndefined(predomain)) {
      reject('The email is required');
    }

    let mxDomain = email.split('@')[1];
    if (IsStringEmptyNullOrUndefined(mxDomain)) {
      reject('The domain is required');
    }

    dns.resolveMx(mxDomain, async (err, adresses) => {
      if (err) reject(err);
      resolve();
    });
  });
};
