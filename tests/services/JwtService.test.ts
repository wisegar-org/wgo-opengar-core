import { IJwtSettings, IUser, TokenResult } from "../../src";
import { JwtService } from "../../src/services/JwtService";
import { privateKey, publicKey } from "../../configs/test-settings";
describe("Testing JWTService", () => {
  const jwtSettings: IJwtSettings = {
    privateKey: privateKey,
    publicKey: publicKey,
  };
  const user: IUser = {
    email: "info@wisegar.org",
    name: "Wisegar",
    lastname: "Org",
    username: "wisegar",
  };
  const jwtService = new JwtService(jwtSettings);
  let result = new TokenResult();
  test("Token Generation Test", (done) => {
    result = jwtService.generateToken(user);
    expect(result).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.username).toBeDefined();
    expect(result.isExpiring).toBeFalsy();
    done();
  });
  test("Token Validation Test", (done) => {
    const resultValidation = jwtService.verifyToken(result.token);
    expect(resultValidation).toBeDefined();
    expect(resultValidation.token).toBeDefined();
    expect(resultValidation.username).toBeDefined();
    expect(resultValidation.isExpiring).toBeFalsy();
    done();
  });
});
