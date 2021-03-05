import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'

const Root = styled.div`
  background: linear-gradient(113.18deg, #ffffff -0.1%, rgba(0, 0, 0, 0) 98.9%), #28263f;
  background-blend-mode: overlay, normal;
  border-radius: 4px;
  padding: 3px 5px;
`

const Text = styled.div`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: ${props => props.theme.white};
`

interface ApyBadgeProps {
  apy: BigNumber
  upTo?: boolean
}

export default function ApyBadge({ apy, upTo }: ApyBadgeProps) {
  return (
    <Root>
      <Text>{`${upTo ? 'UP TO' : ''} ${apy.decimalPlaces(2).toString()}% APY`}</Text>
    </Root>
  )
}