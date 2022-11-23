## Running
To run the app copy the example `.env` with
```bash
cp .env.sample .env
```

and update some key values. Change the following in your new `.env`:

```bash
REACT_APP_WEB3_RPC_WSS_URL=wss://eth-mainnet.alchemyapi.io/v2/<YOUR_ALCHEMY_API_KEY>
REACT_APP_WEB3_RPC_HTTPS_URL=https://eth-mainnet.alchemyapi.io/v2/<YOUR_ALCHEMY_API_KEY>
```

Finally, install dependencies and run with:
```bash
yarn install
yarn start
```
