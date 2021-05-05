import { GetCypherKey } from './ConfigService';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const algorithm = 'aes256';
const bufferEncoding = 'latin1';
const randomBytesSize = 16;
const outputEncoding = 'hex';
const inputEncoding = 'utf8';
const initVetorDataSeparator = ':';

/**
 * Data cypher
 * @param data Can be any base object ex. {userid: 1, expiration: '2234556', sessionid: 'nwljkcnlndclwnwle'}
 * @returns string
 */
export const cypherData = (data: any): string => {
  const cypherKey = GetCypherKey();
  const keyBuffer = Buffer.from(cypherKey, bufferEncoding);
  const initVector = randomBytes(randomBytesSize);
  const encrypt = createCipheriv(algorithm, keyBuffer, initVector);
  const encrypted = encrypt.update(JSON.stringify(data), inputEncoding, outputEncoding);
  const encryptedFinal = encrypted + encrypt.final(outputEncoding);
  return initVector.toString(outputEncoding) + ':' + encryptedFinal;
};

/**
 * Data decypher
 * @param cypherdata Most a already cyphered data
 * @returns json data object
 */
export const decypherData = (cypherdata: string): string => {
  const cypherKey = GetCypherKey();
  const keyBuffer = Buffer.from(cypherKey, bufferEncoding);
  const initVectorToken = getCypherDataInitVector(cypherdata);
  const initVector = Buffer.from(initVectorToken, outputEncoding);
  const cypgherContent = getCypherData(cypherdata);
  const decipher = createDecipheriv(algorithm, keyBuffer, initVector);
  const deciphered = decipher.update(cypgherContent, outputEncoding, inputEncoding);
  const decipheredFinal = deciphered + decipher.final(inputEncoding);
  return JSON.parse(decipheredFinal);
};

export const getCypherDataInitVector = (cypherdata: string) => {
  if (!cypherdata) throw 'GetCypherDataInitVector: invalid cypherdata parameter!';

  if (!cypherdata.includes(initVetorDataSeparator))
    throw 'GetCypherDataInitVector: invalid cypherdata separator parameter!';

  const splittedCypherData = cypherdata.split(initVetorDataSeparator);
  if (!splittedCypherData || splittedCypherData.length < 1)
    throw 'GetCypherDataInitVector: impossible to split the cypherdata!';

  return splittedCypherData[0];
};

export const getCypherData = (cypherdata: string) => {
  if (!cypherdata) throw 'GetCypherDataInitVector: invalid cypherdata parameter!';

  if (!cypherdata.includes(initVetorDataSeparator))
    throw 'GetCypherDataInitVector: invalid cypherdata separator parameter!';

  const splittedCypherData = cypherdata.split(initVetorDataSeparator);
  if (!splittedCypherData || splittedCypherData.length < 1)
    throw 'GetCypherDataInitVector: impossible to split the cypherdata!';

  return splittedCypherData[1];
};
