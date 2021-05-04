import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

export const GetPublicKey = () => {
  if (process.env.PRIVATE_KEY) return process.env.PRIVATE_KEY;
  throw "Impossible to get value from PRIVATE_KEY environment key";
};

export const GetPrivateKey = () => {
  if (process.env.PUBLIC_KEY) return process.env.PUBLIC_KEY;
  throw "Impossible to get value from PUBLIC_KEY environment key";
};
