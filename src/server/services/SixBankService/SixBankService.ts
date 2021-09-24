const apiUrl = 'https://api.six-group.com/api/epcd/bankmaster/v2/public';
import axios from 'axios';
import { ISixBankModel } from './SixBankModel';

export const getSixBanks = async (): Promise<ISixBankModel[]> => {
  try {
    const response = await axios.get(`${apiUrl}`);
    const jsonData = response.data;
    if (!jsonData || !jsonData.entries) throw `Six Banks Service - getSixBanks data undefined`;
    const jkeys = Object.keys(jsonData.entries);
    const banks: ISixBankModel[] = [];
    for (const key in jkeys) {
      banks.push(jsonData.entries[key]);
    }
    return banks;
  } catch (error) {
    console.log(error);
  }
};
