import _ from 'lodash';
import dns from 'dns';

export const isNullOrUndefined = (obj: any) => {
  return _.isNull(obj) || _.isUndefined(obj);
};

/**
 * @function isEmail Permette la validazione di una striga che rappresenta un indirizzo email
 * Possibile anche utilizzare i validatori della libreria class-validator (@IsEmail())
 */
export const isEmail = (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (_.isUndefined(email) || _.isNull(email) || _.isEmpty(email)) {
      reject('The email is required');
    }
    const predomain = email.split('@')[0];
    if (_.isUndefined(predomain) || _.isNull(predomain) || _.isEmpty(predomain)) {
      reject('The email is required');
    }

    let mxDomain = email.split('@')[1];
    if (_.isUndefined(mxDomain) || _.isNull(mxDomain) || _.isEmpty(mxDomain)) {
      reject('The domain is required');
    }

    dns.resolveMx(mxDomain, async (err, adresses) => {
      if (err) reject(err);
      resolve();
    });
  });
};
