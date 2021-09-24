const apiUrl = 'https://api.six-group.com/api/epcd/bankmaster/v2/public';
import axios from 'axios';
import { ISixBankModel } from './SixBankModel';

export const getSixBanks = async (): Promise<ISixBankModel[]> => {
  try {
    const response = await axios.get(`${apiUrl}`);
    const jsonData = response.data;
    if (!jsonData) throw `Six Banks Service - getSixBanks`;
    const jkeys = Object.keys(jsonData);
    const banks: ISixBankModel[] = [];
    for (const key in jkeys) {
      banks.push(jsonData[key]);
    }
    return banks;
  } catch (error) {
    console.log(error);
  }
};
