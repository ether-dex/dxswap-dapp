import { Pair, TokenAmount, Token } from 'dxswap-sdk'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AutoColumn } from '../../../components/Column'
import Step from '../../../components/LiquidityMining/Create/Steps'
import PairAndReward from '../../../components/LiquidityMining/Create/Steps/PairAndReward'
import RewardAmount from '../../../components/LiquidityMining/Create/Steps/RewardAmount'
import SingleOrMultiStep from '../../../components/LiquidityMining/Create/Steps/SingleOrMulti'
import Time from '../../../components/LiquidityMining/Create/Steps/Time'
import PreviewAndCreate from '../../../components/LiquidityMining/Create/Steps/PreviewAndCreate'
import { TYPE } from '../../../theme'
import { PageWrapper } from '../styleds'
import { useCreateLiquidityMiningCallback } from '../../../hooks/useCreateLiquidityMiningCallback'
import ConfirmStakingRewardsDistributionCreation from '../../../components/LiquidityMining/ConfirmStakingRewardsDistributionCreation'
import { useTransactionAdder } from '../../../state/transactions/hooks'

export default function CreateLiquidityMining() {
  const { t } = useTranslation()

  const [attemptingTransaction, setAttemptingTransaction] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [singleReward, setSingleReward] = useState<boolean | null>(null)
  const [liquidityPair, setLiquidityPair] = useState<Pair | null>(null)
  const [reward, setReward] = useState<TokenAmount | null>(null)
  const [unlimitedPool, setUnlimitedPool] = useState(true)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [timelocked, setTimelocked] = useState(false)

  const addTransaction = useTransactionAdder()
  const createLiquidityMiningCallback = useCreateLiquidityMiningCallback(
    liquidityPair,
    [reward],
    startTime,
    endTime,
    timelocked
  )

  const handleTimelockedChange = useCallback(() => {
    setTimelocked(!timelocked)
  }, [timelocked])

  const handleRewardTokenChange = useCallback(
    (token: Token) => {
      setReward(new TokenAmount(token, reward ? reward.toExact() : '0'))
    },
    [reward]
  )

  const handleCreateRequest = useCallback(() => {
    if (!createLiquidityMiningCallback) return
    setShowConfirmationModal(true)
  }, [createLiquidityMiningCallback])

  const handleCreateConfirmation = useCallback(() => {
    if (!createLiquidityMiningCallback) return
    setAttemptingTransaction(true)
    createLiquidityMiningCallback()
      .then(transaction => {
        setErrorMessage('')
        setTransactionHash(transaction.hash || null)
        addTransaction(transaction, {
          summary: `Create liquidity mining campaign on ${liquidityPair?.token0.symbol}/${liquidityPair?.token1.symbol}`
        })
      })
      .catch(error => {
        console.error(error)
        setErrorMessage('Error broadcasting transaction')
      })
      .finally(() => {
        setAttemptingTransaction(false)
      })
  }, [addTransaction, createLiquidityMiningCallback, liquidityPair])

  const handleCreateDismiss = useCallback(() => {
    if (!createLiquidityMiningCallback) return
    setErrorMessage('')
    setTransactionHash(null)
    setShowConfirmationModal(false)
  }, [createLiquidityMiningCallback])

  return (
    <>
      <PageWrapper gap="40px">
        <AutoColumn gap="8px">
          <TYPE.mediumHeader lineHeight="24px">{t('liquidityMining.create.title')}</TYPE.mediumHeader>
          <TYPE.subHeader color="text5" lineHeight="17px">
            {t('liquidityMining.create.subtitle')}
          </TYPE.subHeader>
        </AutoColumn>
        <Step title="Choose one or multiple rewards" index={0} disabled={false}>
          <SingleOrMultiStep singleReward={singleReward} onChange={setSingleReward} />
        </Step>
        <Step title="Select pair and reward" index={1} disabled={singleReward === null}>
          <PairAndReward
            liquidityPair={liquidityPair}
            reward={reward}
            onLiquidityPairChange={setLiquidityPair}
            onRewardTokenChange={handleRewardTokenChange}
          />
        </Step>
        <Step title="Select reward amount" index={2} disabled={!liquidityPair || !reward || !reward.token}>
          <RewardAmount
            reward={reward}
            unlimitedPool={unlimitedPool}
            onRewardAmountChange={setReward}
            onUnlimitedPoolChange={setUnlimitedPool}
          />
        </Step>
        <Step title="Duration and start/end time" index={3} disabled={!reward || reward.equalTo('0')}>
          <Time
            startTime={startTime}
            endTime={endTime}
            timelocked={timelocked}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
            onTimelockedChange={handleTimelockedChange}
          />
        </Step>
        <Step
          title="Preview, approve and create mining pool"
          index={4}
          disabled={!liquidityPair || !startTime || !endTime || !reward || !reward.token || reward.equalTo('0')}
        >
          <PreviewAndCreate
            liquidityPair={liquidityPair}
            startTime={startTime}
            endTime={endTime}
            timelocked={timelocked}
            reward={reward}
            onCreate={handleCreateRequest}
          />
        </Step>
      </PageWrapper>
      <ConfirmStakingRewardsDistributionCreation
        onConfirm={handleCreateConfirmation}
        onDismiss={handleCreateDismiss}
        isOpen={showConfirmationModal}
        attemptingTransaction={attemptingTransaction}
        transactionHash={transactionHash}
        errorMessage={errorMessage}
        liquidityPair={liquidityPair}
        startTime={startTime}
        endTime={endTime}
        reward={reward}
        timelocked={timelocked}
        unlimitedPool={unlimitedPool}
      />
    </>
  )
}