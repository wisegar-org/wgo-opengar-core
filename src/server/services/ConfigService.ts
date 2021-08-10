import dotenv from 'dotenv';
import internal from 'node:stream';
dotenv.config({
  path: '.env',
});

export interface ISettings {
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_USERNAME: string;
  DB_PORT: any;
  DB_HOST: any;
  PRIVATE_KEY: string;
  PUBLIC_KEY: string;
  CYPHER_KEY: string;
  TOKEN_EXPIRES_IN: string;
  TOKEN_TIME_TO_EXPIRE: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_LOG: boolean;
  EMAIL_DEBUG: boolean;
  EMAIL_SECURE: boolean;
  EMAIL_SENDER_ADDRESS: string;
  EMAIL_SENDER_PASSWORD: string;
}

const defaultSettings: ISettings = {
  CYPHER_KEY: 'INSERT A CYPHER_KEY FOR DATA CYPHER HANDLER',
  PRIVATE_KEY: 'INSERT A PRIVATE_KEY FOR JWT TOKEN HANDLER',
  PUBLIC_KEY: 'INSERT A PUBLIC_KEY FOR JWT TOKEN HANDLER',
  TOKEN_EXPIRES_IN: '7d',
  TOKEN_TIME_TO_EXPIRE: '324000',
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USERNAME: 'postgres',
  DB_NAME: 'postgres',
  DB_PASSWORD: 'postgres',
  EMAIL_HOST: '',
  EMAIL_PORT: 587,
  EMAIL_LOG: true,
  EMAIL_DEBUG: true,
  EMAIL_SECURE: false, // Use SSL
  EMAIL_SENDER_ADDRESS: '',
  EMAIL_SENDER_PASSWORD: '',
};

export const GetNodeEnvKey = () => {
  if (process.env.NODE_ENV) return process.env.NODE_ENV;
  throw 'Impossible to get value from NODE_ENV environment key';
};

export const GetPortKey = () => {
  if (process.env.PORT) return process.env.PORT;
  throw 'Impossible to get value from PORT environment key';
};

const nodeEnv = GetNodeEnvKey();
const configFilename = nodeEnv === 'production' ? './settings.json' : `./settings.${nodeEnv}.json`;

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

/**
 * @deprecated Please use a typed defined & new implemented function for the specified setting!
 * @returns A not defined & not typed settings values
 */
export const GetGenericConfig = () => {
  const fs = require('fs-extra');
  if (!fs.existsSync(configFilename)) {
    console.error(`Settings file not found. File ${configFilename} will be created!`);
    fs.writeJsonSync(configFilename, defaultSettings);
  }
  const settingsReadContent = fs.readFileSync(configFilename);
  const settingsJsonReadContent = JSON.parse(settingsReadContent);
  return settingsJsonReadContent;
};

export const GetPublicKey = () => {
  const settings = GetConfig();
  if (settings.PUBLIC_KEY === defaultSettings.PUBLIC_KEY) throw 'Impossible to get value from PUBLIC_KEY settings key';
  return settings.PUBLIC_KEY;
};

export const GetGithubToken = () => {
  const settings = GetGenericConfig();
  if (settings.GITHUB_TOKEN === '' || settings.GITHUB_TOKEN === null)
    throw 'Impossible to get value from GITHUB_TOKEN settings key';
  return settings.GITHUB_TOKEN;
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

export const GetDBHostKey = () => {
  const settings = GetConfig();
  if (settings.DB_HOST === '') throw 'Impossible to get value from DB_HOST settings key';
  return settings.DB_HOST;
};

export const GetDBPortKey = () => {
  const settings = GetConfig();
  if (settings.DB_PORT === '') throw 'Impossible to get value from DB_PORT settings key';
  return settings.DB_PORT;
};

export const GetDBUserNameKey = () => {
  const settings = GetConfig();
  if (settings.DB_USERNAME === '') throw 'Impossible to get value from DB_USERNAME settings key';
  return settings.DB_USERNAME;
};

export const GetDBPasswordKey = () => {
  const settings = GetConfig();
  if (settings.DB_PASSWORD === '') throw 'Impossible to get value from DB_PASSWORD settings key';
  return settings.DB_PASSWORD;
};

export const GetDBNameKey = () => {
  const settings = GetConfig();
  if (settings.DB_NAME === '') throw 'Impossible to get value from DB_NAME settings key';
  return settings.DB_NAME;
};

export const GetEmailHostKey = () => {
  if (process.env.EMAIL_HOST) return process.env.EMAIL_HOST;
  const settings = GetConfig();
  if (!settings.EMAIL_HOST || settings.EMAIL_HOST === '')
    throw 'Impossible to get value from EMAIL_HOST env variable and settings key';
  return settings.EMAIL_HOST;
};
export const GetEmailPortKey = () => {
  if (process.env.EMAIL_PORT) return parseInt(process.env.EMAIL_PORT);
  const settings = GetConfig();
  if (!settings.EMAIL_PORT) throw 'Impossible to get value from EMAIL_PORT env variable and settings key';
  return settings.EMAIL_PORT;
};

export const GetEmailLogKey = () => {
  if (process.env.EMAIL_LOG) return process.env.EMAIL_LOG === 'true';
  const settings = GetConfig();
  if (!settings.EMAIL_LOG) throw 'Impossible to get value from EMAIL_LOG env variable and settings key';
  return settings.EMAIL_LOG;
};

export const GetEmailDebugKey = () => {
  if (process.env.EMAIL_DEBUG) return process.env.EMAIL_DEBUG === 'true';
  const settings = GetConfig();
  if (!settings.EMAIL_DEBUG) throw 'Impossible to get value from EMAIL_DEBUG env variable and settings key';
  return settings.EMAIL_DEBUG;
};

export const GetEmailSecureKey = () => {
  if (process.env.EMAIL_SECURE) return process.env.EMAIL_SECURE === 'true';
  const settings = GetConfig();
  if (!settings.EMAIL_SECURE) throw 'Impossible to get value from EMAIL_SECURE env variable and settings key';
  return settings.EMAIL_SECURE;
};

export const GetEmailSenderKey = () => {
  if (process.env.EMAIL_SENDER_ADDRESS) return process.env.EMAIL_SENDER_ADDRESS;
  const settings = GetConfig();
  if (!settings.EMAIL_SENDER_ADDRESS || settings.EMAIL_SENDER_ADDRESS === '')
    throw 'Impossible to get value from EMAIL_SENDER_ADDRESS env variable and settings key';
  return settings.EMAIL_SENDER_ADDRESS;
};

export const GetEmailSenderPassKey = () => {
  if (process.env.EMAIL_SENDER_PASSWORD) return process.env.EMAIL_SENDER_PASSWORD;
  const settings = GetConfig();
  if (!settings.EMAIL_SENDER_PASSWORD || settings.EMAIL_SENDER_PASSWORD === '')
    throw 'Impossible to get value from EMAIL_SENDER_PASSWORD env variable and settings key';
  return settings.EMAIL_SENDER_PASSWORD;
};
