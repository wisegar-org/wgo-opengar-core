import { GetCypherKey } from './EnvService';
import { createCipheriv, randomBytes } from 'crypto';

const algorithm = 'aes256';
const bufferEncoding = 'latin1';
const randomBytesSize = 16;
const outputEncoding = 'hex';
const inputEncoding = 'utf8';

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
