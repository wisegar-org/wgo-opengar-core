import { getGlobalCurrencies } from '../../src/server/services/CurrencyFurterService/CurrencyFurterService';

describe('Test CurrencyFurterService', () => {
  test('Getting Currency list', async (done) => {
    const currencies = await getGlobalCurrencies();
    expect(currencies).toBeDefined();
    expect(currencies.length).toBeGreaterThan(0);
    done();
  });
});
