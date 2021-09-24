import { getSixBanks } from '../../src/server/services/SixBankService/SixBankService';

describe('Test SixBankService', () => {
  test('Getting Bank list', async (done) => {
    try {
      const banks = await getSixBanks();
      expect(banks).toBeDefined();
      expect(banks.length).toBeGreaterThan(0);
    } catch (error) {
      console.log(error);
    }
    done();
  });
});
