import dotenv from 'dotenv';

dotenv.config({
  path: '.env',
});

export const GetNodeEnvKey = () => {
  if (process.env.NODE_ENV) return process.env.NODE_ENV;
  throw 'Impossible to get value from NODE_ENV environment key';
};

export const GetPortKey = () => {
  if (process.env.PORT) return process.env.PORT;
  throw 'Impossible to get value from PORT environment key';
};

export const GetPublicKey = () => {
  if (process.env.PRIVATE_KEY) return process.env.PRIVATE_KEY;
  throw 'Impossible to get value from PRIVATE_KEY environment key';
};

export const GetPrivateKey = () => {
  if (process.env.PUBLIC_KEY) return process.env.PUBLIC_KEY;
  throw 'Impossible to get value from PUBLIC_KEY environment key';
};
