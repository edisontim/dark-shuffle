import { useSnackbar } from 'notistack'
import React, { useContext, useEffect } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { useParams } from 'react-router-dom'
import { getTokenMetadata } from '../api/indexer'
import BattleContainer from '../container/BattleContainer'
import DraftContainer from '../container/DraftContainer'
import MapContainer from '../container/MapContainer'
import { GameContext } from '../contexts/gameContext'
import { useReplay } from '../contexts/replayContext'
import { useAccount, useConnect } from '@starknet-react/core'
import LandingContainer from '../container/LandingContainer'
import LoadingContainer from '../container/LoadingContainer'
import { motion } from 'framer-motion'
import { fadeVariant } from '../helpers/variants'

function ArenaPage() {
  const gameContext = useContext(GameContext)
  const { state } = gameContext.values

  const replay = useReplay()
  const { watchGameId, gameId, newGameSettingsId } = useParams()
  const { address } = useAccount()
  const { connect, connectors, isPending } = useConnect();
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (!watchGameId && !gameId && !newGameSettingsId) {
      gameContext.setLoading(false)
    }
  }, [watchGameId, gameId, newGameSettingsId])

  useEffect(() => {
    async function watchGame() {
      gameContext.setLoading(true)
      gameContext.setLoadingProgress(10)

      let game = await getTokenMetadata(watchGameId)

      if (game) {
        if (game.active) {
          replay.spectateGame(game)
        } else {
          replay.startReplay(game)
        }
      } else {
        enqueueSnackbar('Game not found', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
      }
    }

    if (watchGameId) {
      watchGame()
    }
  }, [watchGameId])

  useEffect(() => {
    async function loadGame() {
      if (!address) {
        connect({ connector: connectors.find(conn => conn.id === "controller") })
        return
      }

      gameContext.setLoading(true)
      gameContext.setLoadingProgress(10)

      let tokenData = await getTokenMetadata(gameId)
      gameContext.actions.loadGameDetails(tokenData)
    }

    if (gameId && !isPending) {
      loadGame()
    }
  }, [gameId, address, isPending])

  useEffect(() => {
    async function startNewGame() {
      if (!address) {
        connect({ connector: connectors.find(conn => conn.id === "controller") })
        return
      }

      const tokenData = await gameContext.actions.mintFreeGame(newGameSettingsId)

      if (tokenData) {
        await gameContext.actions.loadGameDetails(tokenData)
      }
    }

    if (newGameSettingsId && !isPending) {
      startNewGame()
    }
  }, [newGameSettingsId, address, isPending])

  const showWatchBorder = gameContext.values.replay && !gameContext.getState.loading

  return (
    <Scrollbars style={{ ...styles.container, border: showWatchBorder ? '1px solid #f59100' : 'none' }}>
      {gameContext.values.gameId === null && <>
        {gameContext.getState.loading
          ? <motion.div style={styles.container} variants={fadeVariant} initial="initial" animate="enter" exit="exit">
            <LoadingContainer />
          </motion.div>
          : <motion.div style={styles.container} variants={fadeVariant} initial="initial" animate="enter" exit="exit">
            <LandingContainer />
          </motion.div>
        }
      </>}

      {state === 'Draft' &&
        <motion.div style={styles.container} variants={fadeVariant} initial="initial" animate="enter" exit="exit">
          <DraftContainer />
        </motion.div>
      }

      {state === 'Battle' &&
        <motion.div style={styles.container} variants={fadeVariant} initial="initial" animate="enter" exit="exit">
          <BattleContainer />
        </motion.div>
      }

      {state === 'Map' &&
        <motion.div style={styles.container} variants={fadeVariant} initial="initial" animate="enter" exit="exit">
          <MapContainer />
        </motion.div>
      }
    </Scrollbars>
  )
}

export default ArenaPage

const styles = {
  container: {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  }
}