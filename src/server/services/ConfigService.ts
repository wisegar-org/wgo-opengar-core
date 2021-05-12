import dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

const configFilename = './settings.json';

export interface ISettings {
  PRIVATE_KEY: string;
  PUBLIC_KEY: string;
  CYPHER_KEY: string;
  TOKEN_EXPIRES_IN: string;
  TOKEN_TIME_TO_EXPIRE: string;
}

const defaultSettings: ISettings = {
  CYPHER_KEY: 'INSERT A CYPHER_KEY FOR DATA CYPHER HANDLER',
  PRIVATE_KEY: 'INSERT A PRIVATE_KEY FOR JWT TOKEN HANDLER',
  PUBLIC_KEY: 'INSERT A PUBLIC_KEY FOR JWT TOKEN HANDLER',
  TOKEN_EXPIRES_IN: '7d',
  TOKEN_TIME_TO_EXPIRE: '324000',
};

const GetConfig = (): ISettings => {
  const fs = require('fs-extra');
  if (!fs.existsSync(configFilename)) {
    console.error(`Settings file not found. File ${configFilename} will be created!`);
    fs.writeJsonSync(configFilename, defaultSettings);
  }
  const settingsReadContent = fs.readFileSync(configFilename);
  const settingsJsonReadContent = JSON.parse(settingsReadContent);
  return settingsJsonReadContent;
};

export const GetNodeEnvKey = () => {
  if (process.env.NODE_ENV) return process.env.NODE_ENV;
  throw 'Impossible to get value from NODE_ENV environment key';
};

export const GetPortKey = () => {
  if (process.env.PORT) return process.env.PORT;
  throw 'Impossible to get value from PORT environment key';
};

export const GetPublicKey = () => {
  const settings = GetConfig();
  if (settings.PUBLIC_KEY === defaultSettings.PUBLIC_KEY) throw 'Impossible to get value from PUBLIC_KEY settings key';
  return settings.PUBLIC_KEY;
};

export const GetPrivateKey = () => {
  const settings = GetConfig();
  if (settings.PRIVATE_KEY === defaultSettings.PRIVATE_KEY)
    throw 'Impossible to get value from PRIVATE_KEY settings key';
  return settings.PRIVATE_KEY;
};

export const GetExpiresInKey = () => {
  const settings = GetConfig();
  if (settings.TOKEN_EXPIRES_IN === '') throw 'Impossible to get value from TOKEN_EXPIRES_IN settings key';
  return settings.TOKEN_EXPIRES_IN;
};

/**
 * @description Time to token expiration. Default value 90 days (324000s)
 */
export const GetTimeToExpireKey = () => {
  const settings = GetConfig();
  if (settings.TOKEN_TIME_TO_EXPIRE === '') throw 'Impossible to get value from TOKEN_TIME_TO_EXPIRE settings key';
  return settings.TOKEN_TIME_TO_EXPIRE;
};

export const GetCypherKey = () => {
  const settings = GetConfig();
  if (settings.CYPHER_KEY === defaultSettings.CYPHER_KEY) throw 'Impossible to get value from CYPHER_KEY settings key';
  return settings.CYPHER_KEY;
};
