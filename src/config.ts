function toLowerCase(value: any): string {
  return String(value ?? '').toLowerCase();
}

const config = {
  env: String(process.env.REACT_APP_ENV),
  isDev: String(process.env.REACT_APP_ENV) === 'development',
  isProd: String(process.env.REACT_APP_ENV) === 'production',
  isTestnet: String(process.env.REACT_APP_ENV) === 'testnet',
  graph: {
    primaryUrl: String(process.env.REACT_APP_PRIMARY_GRAPH_URL),
    fallbackUrl: String(process.env.REACT_APP_FALLBACK_GRAPH_URL)
  },
  zapper: {
    baseUrl: String(process.env.REACT_APP_ZAPPER_URL),
    apiKey: String(process.env.REACT_APP_ZAPPER_API_KEY)
  },
  tokens: {
    fdt: toLowerCase(process.env.REACT_APP_TOKEN_FDT_ADDR),
    usdc: toLowerCase(process.env.REACT_APP_TOKEN_USDC_ADDR),
    bond: toLowerCase(process.env.REACT_APP_TOKEN_BOND_ADDR),
    uma: toLowerCase(process.env.REACT_APP_TOKEN_UMA_ADDR),
    mkr: toLowerCase(process.env.REACT_APP_TOKEN_MKR_ADDR),
    yfi: toLowerCase(process.env.REACT_APP_TOKEN_YFI_ADDR),
    rgt: toLowerCase(process.env.REACT_APP_TOKEN_RGT_ADDR),
    wsOHM: toLowerCase(process.env.REACT_APP_TOKEN_wsOHM_ADDR),
    gOHM: toLowerCase(process.env.REACT_APP_TOKEN_gOHM_ADDR),
    ethFDTSLP: toLowerCase(process.env.REACT_APP_TOKEN_ETH_FDT_SUSHI_LP),
    wsOHMFDTSLP: toLowerCase(process.env.REACT_APP_TOKEN_wsOHM_FDT_SUSHI_LP),
    gOHMFDTSLP: toLowerCase(process.env.REACT_APP_TOKEN_gOHM_FDT_SUSHI_LP),
  },
  contracts: {
    yf: {
      bond: toLowerCase(process.env.REACT_APP_CONTRACT_YF_BOND_ADDR),
      staking: toLowerCase(process.env.REACT_APP_CONTRACT_YF_STAKING_ADDR),
      stakingNFT: toLowerCase(process.env.REACT_APP_CONTRACT_YF_NFT_STAKING_ADDR),
      uma: toLowerCase(process.env.REACT_APP_CONTRACT_YF_UMA_ADDR),
      mkr: toLowerCase(process.env.REACT_APP_CONTRACT_YF_MKR_ADDR),
      yfi: toLowerCase(process.env.REACT_APP_CONTRACT_YF_YFI_ADDR),
      rgt: toLowerCase(process.env.REACT_APP_CONTRACT_YF_RGT_ADDR),
      wsOHM: toLowerCase(process.env.REACT_APP_CONTRACT_YF_wsOHM_ADDR),
      ethFDTSLP: toLowerCase(process.env.REACT_APP_CONTRACT_YF_ETH_FDT_SUSHI_LP),
      wsOHMFDTSLP: toLowerCase(process.env.REACT_APP_CONTRACT_YF_wsOHM_FDT_SUSHI_LP),
      wsOHMFDTSLPOld: toLowerCase(process.env.REACT_APP_CONTRACT_YF_wsOHM_FDT_SUSHI_LP_OLD),
      gOHMFDTAmphoraSLP: toLowerCase(process.env.REACT_APP_CONTRACT_YF_gOHM_FDT_AMPHORA_SUSHI_LP),
      gOHMFDTKitharaSLP: toLowerCase(process.env.REACT_APP_CONTRACT_YF_gOHM_FDT_Kithara_SUSHI_LP),
      yfERC1155: toLowerCase(process.env.REACT_APP_ERC1155_YF_ADDR),
    },
    dao: {
      governance: toLowerCase(process.env.REACT_APP_CONTRACT_DAO_GOVERNANCE_ADDR),
      comitium: toLowerCase(process.env.REACT_APP_CONTRACT_DAO_COMITIUM_ADDR),
      reward: toLowerCase(process.env.REACT_APP_CONTRACT_DAO_REWARD_ADDR),
    },
    merkleDistributor: toLowerCase(process.env.REACT_APP_CONTRACT_MERKLE_DISTRIBUTOR_ADDR),
    merkleDistributorAmphora: toLowerCase(process.env.REACT_APP_CONTRACT_MERKLE_DISTRIBUTOR_AMPHORA_ADDR),
    merkleDistributorKithara: toLowerCase(process.env.REACT_APP_CONTRACT_MERKLE_DISTRIBUTOR_KITHARA_ADDR),
    merkleDistributorGalea: toLowerCase(process.env.REACT_APP_CONTRACT_MERKLE_DISTRIBUTOR_GALEA_ADDR),
    merkleDistributorGladius: toLowerCase(process.env.REACT_APP_CONTRACT_MERKLE_DISTRIBUTOR_GLADIUS_ADDR),
    merkleDistributorCorona: toLowerCase(process.env.REACT_APP_CONTRACT_MERKLE_DISTRIBUTOR_CORONA_ADDR),
  },
  web3: {
    chainId: Number(process.env.REACT_APP_WEB3_CHAIN_ID),
    poolingInterval: 12000,
    rpc: {
      wssUrl: String(process.env.REACT_APP_WEB3_RPC_WSS_URL),
      httpsUrl: String(process.env.REACT_APP_WEB3_RPC_HTTPS_URL),
    },
    etherscan: {
      apiKey: String(process.env.REACT_APP_ETHERSCAN_API_KEY),
    },
    wallets: {
      portis: {
        id: String(process.env.REACT_APP_WEB3_PORTIS_APP_ID),
      },
      walletConnect: {
        bridge: String(process.env.REACT_APP_WEB3_WALLET_CONNECT_BRIDGE),
      },
      coinbase: {
        appName: String(process.env.REACT_APP_WEB3_COINBASE_APP_NAME),
      },
      trezor: {
        email: String(process.env.REACT_APP_WEB3_TREZOR_EMAIL),
        appUrl: String(process.env.REACT_APP_WEB3_TREZOR_APP_URL),
      },
    },
  },
  dao: {
    activationThreshold: Number(process.env.REACT_APP_DAO_ACTIVATION_THRESHOLD),
  },
  mailchimp: {
    url: String(process.env.REACT_APP_MAILCHIMP_URL),
    u: String(process.env.REACT_APP_MAILCHIMP_U),
    id: String(process.env.REACT_APP_MAILCHIMP_ID),
  },
};

export const FDT_MARKET_LINK = `https://app.sushi.com/swap?inputCurrency=${config.tokens.gOHM}&outputCurrency=${config.tokens.fdt}`;

export const FDT_MARKET_LIQUIDITY_LINK = `https://app.sushi.com/add/${config.tokens.gOHM}/${config.tokens.fdt}`;

export default config;
