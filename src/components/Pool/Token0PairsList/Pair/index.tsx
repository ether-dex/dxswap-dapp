import React from 'react'
import { Box, Flex } from 'rebass'
import { Token } from 'dxswap-sdk'
import { TYPE } from '../../../../theme'
import DoubleCurrencyLogo from '../../../DoubleLogo'
import { DarkCard } from '../../../Card'
import styled from 'styled-components'

const SizedCard = styled(DarkCard)`
  width: 208px;
  height: 155px;
  ::before {
    background: linear-gradient(153.77deg, rgba(55, 82, 233, 0.35) -144.38%, rgba(55, 82, 233, 0) 65.22%),
      linear-gradient(0deg, #171621, #171621);
  }
`

interface PairProps {
  token0?: Token
  token1?: Token
}

export default function Pair({ token0, token1, ...rest }: PairProps) {
  return (
    <SizedCard selectable {...rest}>
      <Flex justifyContent="center" alignItems="center" flexDirection="column" width="100%" height="100%">
        <Box mb="6px">
          <DoubleCurrencyLogo currency0={token0} currency1={token1} size={28} />
        </Box>
        <Box mb="8px">
          <TYPE.body color="white" lineHeight="19.5px" fontWeight="600" fontSize="16px">
            {token0?.symbol}/{token1?.symbol}
          </TYPE.body>
        </Box>
      </Flex>
    </SizedCard>
  )
}