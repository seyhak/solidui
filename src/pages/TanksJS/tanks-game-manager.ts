import {
  PlayerState,
  TanksDefaultSettings,
  TanksGameManager,
  TanksGameState,
  EventsValues,
  EVENTS,
  Coordinates,
  Hit,
} from "src/types/tanks"
import { generateRandomIntInRange } from "src/utils/factories"

const DEFAULT_GAME_STATE: Omit<TanksGameState, "playersState"> = {
  player: 0,
  windX: 120,
  turn: 0,
  bulletPaths: [],
  hits: [],
}

const getDefaultPlayerState = (
  index: number,
  settings: TanksDefaultSettings
) => {
  return {
    X: !index ? 100 : settings.WIDTH - 150,
    Y: settings.Y,
    cannonAngle: 0,
    HP: settings.MAX_HP,
  }
}

const getDefaultGameState = (
  settings: TanksDefaultSettings
): TanksGameState => {
  const state = {
    ...DEFAULT_GAME_STATE,
    playersState: {
      0: getDefaultPlayerState(0, settings),
      1: getDefaultPlayerState(1, settings),
    },
  }
  return state as TanksGameState
}

const handlePlayersStateValueChange = (
  prevState: TanksGameState,
  key: keyof PlayerState,
  multiplier = 1,
  step = 5
) => {
  const currentValue = prevState.playersState[prevState.player][key]
  const nextValue = currentValue + step * multiplier
  const isNextValueOutOfCannonAngle =
    key === "cannonAngle" && (Math.abs(nextValue) > 90 || nextValue > 0)
  if (isNextValueOutOfCannonAngle) {
    return prevState
  }
  return {
    playersState: {
      ...prevState.playersState,
      [prevState.player]: {
        ...prevState.playersState[prevState.player],
        [key]: nextValue,
      },
    } as TanksGameState["playersState"],
  }
}

const handleWindChange = () => {
  return generateRandomIntInRange(200, -200)
}

const getDegreeToRadians = (degree: number) => {
  const CONSTANT = 0.0174532925
  return CONSTANT * Math.abs(degree)
}
const getXInT = (t: number, alfa: number, v0: number) => {
  // v0t cos(alfa)
  return v0 * t * Math.cos(getDegreeToRadians(alfa))
}
const getYInT = (t: number, alfa: number, v0: number) => {
  // v0t sin(alfa) - g(t^2)/2
  const G = 9.8 // gravity
  return v0 * t * Math.sin(getDegreeToRadians(alfa)) - (G * Math.pow(t, 2)) / 2
}
const getBulletPath = (_: number, angle: number, V0 = 100): Coordinates[] => {
  // console.log("getBulletPath", { angle })
  // const BULLET_MASS = 10 // kg
  const INTERVAL = 0.01 // s
  // const V0 = 100
  const FLOOR_LVL = -100

  let t = 0 + INTERVAL
  const result = [
    {
      X: 0,
      Y: 0,
    },
  ]
  while (true) {
    const nextResult = {
      X: getXInT(t, angle, V0),
      Y: getYInT(t, angle, V0),
    }
    result.push(nextResult)
    t += INTERVAL

    if (nextResult.Y <= FLOOR_LVL) {
      // console.log({ result })
      return result
    }
  }
}
const getHits = (
  gameState: TanksGameState,
  nextPath: Coordinates[]
): Hit | null => {
  const TANK_WIDTH = 150
  const TANK_HEIGHT = 100
  const PLAYERS_COUNT = 2
  const currentPlayerPosition = {
    X: gameState.playersState[gameState.player].X + TANK_WIDTH,
    Y: gameState.playersState[gameState.player].Y,
  }

  const hitBoundriesP0X = [
    gameState.playersState[0].X - TANK_WIDTH,
    gameState.playersState[0].X + TANK_WIDTH,
  ]
  const hitBoundriesP1X = [
    gameState.playersState[1].X - TANK_WIDTH,
    gameState.playersState[1].X + TANK_WIDTH,
  ]
  const hitBoundriesP0Y = [
    gameState.playersState[0].Y,
    gameState.playersState[0].Y + TANK_HEIGHT,
  ]
  const hitBoundriesP1Y = [
    gameState.playersState[1].Y,
    gameState.playersState[1].Y + TANK_HEIGHT,
  ]

  const pXs = [hitBoundriesP0X, hitBoundriesP1X]
  const pYs = [hitBoundriesP0Y, hitBoundriesP1Y]

  for (let index = 0; index < nextPath.length; index++) {
    const xP0 = nextPath[index].X + currentPlayerPosition.X
    const xP1 =
      -1 * nextPath[index].X + currentPlayerPosition.X - TANK_WIDTH * 2
    const y = nextPath[index].Y * -1
    let xHitPlayer = null
    let yHit = false

    for (let j = 0; j < PLAYERS_COUNT; j++) {
      const playerX = pXs[j]

      if (
        (xP0 > playerX[0] && xP0 < playerX[1]) ||
        (xP1 > playerX[0] && xP1 < playerX[1])
      ) {
        xHitPlayer = j
      }
    }
    for (let j = 0; j < PLAYERS_COUNT; j++) {
      const playerY = pYs[j]

      if (y > playerY[0] && y < playerY[1]) {
        yHit = true
      }
    }

    if (xHitPlayer !== null && yHit) {
      return {
        turn: gameState.turn,
        hitPlayer: xHitPlayer as Hit["hitPlayer"],
      }
    }
  }
  return null
}
const updatePlayersStateHealthByHit = (gameState: TanksGameState, hit: Hit) => {
  const player = hit.hitPlayer
  const updatedHP = gameState.playersState[player].HP - 1
  return {
    ...gameState.playersState,
    [player]: {
      ...gameState.playersState[player],
      HP: updatedHP,
    },
  }
}

const handleEvent = async (
  event: EventsValues,
  prevState: TanksGameState,
  useWasm = false
): Promise<TanksGameState> => {
  const nextState = await new Promise<TanksGameState>((res, _) => {
    let updated = {}
    let player = prevState.player
    switch (event) {
      case EVENTS.UP:
        updated = handlePlayersStateValueChange(prevState, "cannonAngle", -1)
        break
      case EVENTS.DOWN:
        updated = handlePlayersStateValueChange(prevState, "cannonAngle")
        break
      case EVENTS.LEFT:
        updated = handlePlayersStateValueChange(prevState, "X", -1)
        break
      case EVENTS.RIGHT:
        updated = handlePlayersStateValueChange(prevState, "X")
        break
      case EVENTS.FIRE:
        player = prevState.player === 0 ? 1 : 0
        const getBulletPathFn = useWasm ? ((window as any).getBulletPath as any) : getBulletPath
        const str = parseInt(document.getElementById("strength")?.innerText || '100')
        console.log("str", str)
        // @ts-ignore
        const time1 = Date.now()
        console.log({getBulletPathFn, useWasm})
        const nextPath = getBulletPathFn(
          prevState.windX,
          prevState.playersState[prevState.player].cannonAngle,
          str
        )
        console.log(useWasm, 'time elapsed: ', Date.now() - time1)
        const hit = getHits(prevState, nextPath)
        console.log({ hit })
        let playersState = prevState.playersState
        if (hit) {
          playersState = updatePlayersStateHealthByHit(prevState, hit)
        }
        updated = {
          playersState,
          windX: handleWindChange(),
          bulletPaths: [...prevState.bulletPaths, nextPath],
          hits: !!hit ? [...prevState.hits, hit] : prevState.hits,
        }
        console.log({ updated })
        break
      default:
        res(prevState)
    }
    res({
      ...prevState,
      ...updated,
      player,
    })
  })
  return nextState
}

// const gameManager: TanksGameManager = {
//   getDefaultState: getDefaultGameState,
//   handleEvent,
// }

export const getGameManager = (useWasm = false): TanksGameManager => ({
  getDefaultState: getDefaultGameState,
  handleEvent: (
    event: EventsValues,
    prevState: TanksGameState) => handleEvent(event, prevState, useWasm),
})