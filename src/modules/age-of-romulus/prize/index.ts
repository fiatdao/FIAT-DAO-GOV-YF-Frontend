import config from 'config';
import amphoraProd from 'modules/age-of-romulus/prize/prod/amphora.json';
import coronaProd from 'modules/age-of-romulus/prize/prod/corona.json';
import galeaProd from 'modules/age-of-romulus/prize/prod/galea.json';
import gladiusProd from 'modules/age-of-romulus/prize/prod/gladius.json';
import kitharaProd from 'modules/age-of-romulus/prize/prod/kithara.json';
import amphoraTest from 'modules/age-of-romulus/prize/test/amphora.json';
import coronaTest from 'modules/age-of-romulus/prize/test/corona.json';
import galeaTest from 'modules/age-of-romulus/prize/test/galea.json';
import gladiusTest from 'modules/age-of-romulus/prize/test/gladius.json';
import kitharaTest from 'modules/age-of-romulus/prize/test/kithara.json';

export default config.web3.chainId === 4
  ? {
      amphora: amphoraTest,
      corona: coronaTest,
      galea: galeaTest,
      gladius: gladiusTest,
      kithara: kitharaTest,
    }
  : {
      amphora: amphoraProd,
      corona: coronaProd,
      galea: galeaProd,
      gladius: gladiusProd,
      kithara: kitharaProd,
    };
