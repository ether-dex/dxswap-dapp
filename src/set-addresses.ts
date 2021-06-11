import { ChainId, STAKING_REWARDS_FACTORY_ADDRESS } from 'dxswap-sdk'

if (
  !process.env.REACT_APP_STAKING_REWARDS_FACTORY_ADDRESS_MAINNET ||
  !process.env.REACT_APP_STAKING_REWARDS_FACTORY_ADDRESS_XDAI
)
  throw new Error('missing env variables')

STAKING_REWARDS_FACTORY_ADDRESS[ChainId.MAINNET] = process.env.REACT_APP_STAKING_REWARDS_FACTORY_ADDRESS_MAINNET
STAKING_REWARDS_FACTORY_ADDRESS[ChainId.XDAI] = process.env.REACT_APP_STAKING_REWARDS_FACTORY_ADDRESS_XDAI
