import { InjectedConnector } from '@web3-react/injected-connector'
import { AuthereumConnector } from '@web3-react/authereum-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { CustomNetworkConnector } from './CustomNetworkConnector'
import { ChainId } from 'dxswap-sdk'
import { providers } from 'ethers'
import getLibrary from '../utils/getLibrary'

export const INFURA_PROJECT_ID = '0ebf4dd05d6740f482938b8a80860d13'

export const network = new CustomNetworkConnector({
  urls: {
    [ChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    [ChainId.XDAI]: 'https://rpc.xdaichain.com/'
  },
  defaultChainId: ChainId.MAINNET
})

export const injected = new InjectedConnector({
  supportedChainIds: [ChainId.MAINNET, ChainId.RINKEBY, ChainId.ARBITRUM_TESTNET_V3, ChainId.SOKOL, ChainId.XDAI]
})

// mainnet only
export const walletConnect = new WalletConnectConnector({
  rpc: {
    1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    100: 'https://rpc.xdaichain.com/'
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})

// mainnet only
export const authereum = new AuthereumConnector({ chainId: 1 })

let networkLibrary: providers.Web3Provider | undefined
export function getNetworkLibrary(): providers.Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}
