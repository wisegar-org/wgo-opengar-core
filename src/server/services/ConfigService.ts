import dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

const configFilename = './settings.json';

export interface ISettings {
  PRIVATE_KEY: string;
  PUBLIC_KEY: string;
  CYPHER_KEY: string;
}

const defaultSettings: ISettings = {
  CYPHER_KEY: 'INSERT A CYPHER_KEY',
  PRIVATE_KEY: 'INSERT A PRIVATE_KEY',
  PUBLIC_KEY: 'INSERT A PUBLIC_KEYFOT TOKEN 422',
};

const GetConfig = (): ISettings => {
  const fs = require('fs-extra');
  if (!fs.existsSync(configFilename)) {
    console.error(`Settings file not found. File ${configFilename} will be created!`);
    const settingsstringify = JSON.stringify(defaultSettings);
    fs.writeJsonSync(configFilename, settingsstringify);
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

export const GetCypherKey = () => {
  const settings = GetConfig();
  if (settings.CYPHER_KEY === defaultSettings.CYPHER_KEY) throw 'Impossible to get value from CYPHER_KEY settings key';
  return settings.CYPHER_KEY;
};
