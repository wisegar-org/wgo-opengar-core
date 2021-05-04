import express from "express";
import { checkJwt, jwtUser } from "../services/JwtAuthService";

export const jwt = () => {
  return (req: express.Request, res: express.Response, next: () => void) => {
    const JWT = checkJwt(req, res) as jwtUser;
    if (JWT) {
      req.user = JWT;
    }
    next();
  };
};
