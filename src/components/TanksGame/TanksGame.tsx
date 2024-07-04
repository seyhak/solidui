import { For, createSignal, onMount } from "solid-js"
import { createStore } from "solid-js/store"
import {
  type TanksGameState,
  type PlayerState,
  type TanksGameManager,
  type TanksDefaultSettings,
  type EventsValues,
  EVENTS,
} from "src/types/tanks"
import TopBar from "./TopBar"
import Renderer from "./Renderer"

export const SETTINGS: TanksDefaultSettings = {
  Y: 50,
  WIDTH: 3000 / 2,
  MAX_HP: 3,
}

type TanksGameProps = {
  gameManager: TanksGameManager
}
function TanksGame(props: TanksGameProps) {
  const [gameState, setGameState] = createStore<TanksGameState>(
    props.gameManager.getDefaultState(SETTINGS)
  )
  const [isBlocked, setIsBlocked] = createSignal(false)
  // const [bulletTape, setBulletTape] = createSignal([])

  const eventHandler = async (eventCode: EventsValues) => {
    const newState = await new Promise<TanksGameState>((resolve, rej) => {
      const res = props.gameManager.handleEvent(eventCode, gameState)
      resolve(res)
    })
    // console.log({ gameState, newState })
    setGameState(newState)
  }
  const onFireClick = async () => {
    if (!isBlocked()) {
      setIsBlocked(true)
      await eventHandler(EVENTS.FIRE)
      setIsBlocked(false)
    }
  }
  const increaseTurn = () => {
    setGameState((prevState) => ({
      ...prevState,
      turn: prevState.turn + 1,
    }))
  }

  onMount(() => {
    window.addEventListener("keyup", async (e) => {
      e.preventDefault()

      if (!isBlocked()) {
        setIsBlocked(true)
        const { key } = e
        await eventHandler(key as EventsValues)
        setIsBlocked(false)
      }
    })
    document.getElementById("footer")!.style.display = "none"
  })

  return (
    <>
    <div
      class={`m-4 bg-black flex flex-col`}
      style={{
        width: `${SETTINGS.WIDTH}px`,
        height: "800px",
      }}
    >
      <TopBar
        player={gameState.player}
        windX={gameState.windX}
        onFireClick={onFireClick}
        playersState={gameState.playersState}
        turn={gameState.turn}
      />
      <div class={`p-4 pt-0 flex flex-col flex-1`}>
        <Renderer
          increaseTurn={increaseTurn}
          playersState={gameState.playersState}
          player={gameState.player}
          turn={gameState.turn}
          bulletPaths={gameState.bulletPaths}
        />
      </div>
    </div>
    <div class="h-[300px] overflow-auto">
        <table class="flex flex-col items-center justify-center text-black border-1">
          <thead>
            <tr>
              <th>{""}</th>
              <th>X</th>
              <th>Y</th>
            </tr>
          </thead>
          <tbody>
            <For each={gameState.bulletPaths?.[gameState.turn - 1]}>
              {
                (data, idx) => {
                  return (
                    <tr>
                      <td>{idx()}</td>
                      <td class="px-4">{data.X.toFixed(4)}</td>
                      <td class="px-2 border-l border-solid">{data.Y.toFixed(4)}</td>
                    </tr>
                  )
                }
              }
            </For>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TanksGame
