import { PricedTokenAmount, TokenAmount } from 'dxswap-sdk'
import React, { useCallback, useState } from 'react'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../../../TransactionConfirmationModal'
import ConfirmStakingModalFooter from '../ModalBase/Footer'
import ConfirmClaimModalHeader from './Header'

interface ConfirmClaimModalProps {
  isOpen: boolean
  claimableTokenAmounts: PricedTokenAmount[]
  attemptingTxn: boolean
  txHash: string
  onConfirm: (amounts: TokenAmount[]) => void
  onDismiss: () => void
  errorMessage: string
}

export default function ConfirmClaimModal({
  isOpen,
  attemptingTxn,
  txHash,
  errorMessage,
  claimableTokenAmounts,
  onDismiss,
  onConfirm
}: ConfirmClaimModalProps) {
  const [claimedAmounts, setClaimedAmounts] = useState<{ [claimedTokenAddress: string]: TokenAmount }>({})

  const handleClaimedAmountChange = useCallback(
    (newAmount: TokenAmount) => {
      setClaimedAmounts({ ...claimedAmounts, [newAmount.token.address]: newAmount })
    },
    [claimedAmounts]
  )

  const handleConfirm = useCallback(() => {
    if (!claimedAmounts) return
    const correctlySortedAmounts = claimableTokenAmounts.map(claimable => {
      const relatedClaimedAmount = claimedAmounts[claimable.token.address]
      return relatedClaimedAmount ?? new TokenAmount(claimable.token, '0')
    })
    onConfirm(correctlySortedAmounts)
  }, [claimableTokenAmounts, claimedAmounts, onConfirm])

  const handleDismiss = useCallback(() => {
    setClaimedAmounts({})
    onDismiss()
  }, [onDismiss])

  const topContent = useCallback(
    () => (
      <ConfirmClaimModalHeader
        claimableRewards={claimableTokenAmounts}
        claimedRewards={claimedAmounts}
        onAmountChange={handleClaimedAmountChange}
      />
    ),
    [claimableTokenAmounts, claimedAmounts, handleClaimedAmountChange]
  )

  const content = useCallback(
    () =>
      errorMessage ? (
        <TransactionErrorContent onDismiss={handleDismiss} message={errorMessage} />
      ) : (
        <ConfirmationModalContent
          title="Confirm claiming"
          onDismiss={handleDismiss}
          topContent={topContent}
          bottomContent={() => (
            <ConfirmStakingModalFooter disabledConfirm={!claimedAmounts} onConfirm={handleConfirm} />
          )}
        />
      ),
    [claimedAmounts, errorMessage, handleConfirm, handleDismiss, topContent]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={handleDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={content}
      pendingText={`Claiming ${Object.values(claimedAmounts)
        .map(claimedAmount => `${claimedAmount.toSignificant(4)} ${claimedAmount.token.symbol}`)
        .join(', ')}`}
    />
  )
}