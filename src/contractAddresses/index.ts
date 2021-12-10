import * as dev from './devAddrs';
import * as prod from './prodAddrs';

export default Number(process.env.REACT_APP_WEB3_CHAIN_ID) === 4 ? dev : prod;
