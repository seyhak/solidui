export const EVENTS = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  FIRE: " ",
} as const
export type EventsValues = typeof EVENTS[keyof typeof EVENTS]

export type PlayerState = {
  X: number // 0 is max left
  Y: number // 0 is ground lvl
  HP: number
  cannonAngle: number // 0 is lowest possible -> horizontal
}

export type Hit = {
  turn: TanksGameState["turn"]
  hitPlayer: TanksGameState["player"]
}
export type TanksGameState = {
  player: 0 | 1
  windX: number
  playersState: {
    0: PlayerState
    1: PlayerState
  }
  turn: number
  bulletPaths: Coordinates[][]
  hits: Hit[]
}

export type TanksDefaultSettings = {
  Y: number
  WIDTH: number,
  MAX_HP: number
}

export type TanksGameManager = {
  handleEvent: (event: EventsValues, prevState: TanksGameState) => Promise<TanksGameState>
  getDefaultState: (settings: TanksDefaultSettings) => TanksGameState
}

export type Coordinates = {
  X: number,
  Y: number
}
