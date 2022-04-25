/**
 * The Frankfurter API tracks foreign exchange references rates published by the European Central Bank.
 * https://www.frankfurter.app/docs/
 */
const apiUrl = 'https://api.frankfurter.app';
import axios from 'axios';
import { CurrencyModel } from './CurrencyModel';
/**
 * @deprecated use -> npm i  @wisegar-org/wgo-databank
 */
export const getGlobalCurrencies = async () => {
  const response = await axios.get(`${apiUrl}/currencies`);
  const jsonData = response.data;
  if (!jsonData) throw `Currency Service - getGlobalCurrencies: Impossible to retrieve currency list from api.`;
  const jkeys = Object.keys(jsonData);
  const currencies: CurrencyModel[] = [];
  for (let i = 0; i < jkeys.length; i++) {
    const key = jkeys[i];
    const description = jsonData[key];
    if (!description) {
      console.error(`Currency Service - getGlobalCurrencies: invalid description on currency: ${key}`);
      return;
    }
    currencies.push({
      code: key,
      description: description,
    });
  }
  return currencies;
};
