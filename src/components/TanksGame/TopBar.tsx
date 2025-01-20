import { createSignal } from "solid-js"
import type {TanksGameState} from 'src/types/tanks'

type TopBarProps = Pick<TanksGameState, "player" | "windX" | "playersState" | "turn"> & {
  onFireClick: () => Promise<void>
}

function TopBar(props: TopBarProps) {
  const [isProcessing, setProcessing] = createSignal(false)
  const [str, setStr] = createSignal(100)
  const onFireClick = async () => {
    setProcessing(true)
    await props.onFireClick()
    setProcessing(false)
  }

  return (
    <div class="flex w-full p-4 gap-2 bg-slate-500 justify-between">
      <div class="flex gap-8 justify-center items-center">
        <div>
          <h3>{`P:${props.player}`}</h3>
        </div>
        <div>
          <h3>{`wind: ${props.windX > 0 ? "E⬅️" : "➡️W"}${Math.abs(props.windX)}`}</h3>
        </div>
        <div>
          <h3>{`P1 HP: ${props.playersState[0].HP}`}</h3>
        </div>
        <div>
          <h3>{`P2 HP: ${props.playersState[1].HP}`}</h3>
        </div>
      </div>
      <div class="flex gap-8 justify-center items-center">
        <div>
          <h3>{`Turn:${props.turn}`}</h3>
        </div>
        <div>
          <h3>{`P1 angle: ${props.playersState[0].cannonAngle}`}</h3>
        </div>
        <div>
          <h3>{`P2 agnle: ${props.playersState[1].cannonAngle}`}</h3>
        </div>
      </div>
      <div class="flex gap-2">
        <button onClick={() => setStr(p => p - 50)}>str -</button>
        <p id="strength">{str()}</p>
        <button onClick={() => setStr(p => p + 50)}>str +</button>
        <button disabled={isProcessing()} onClick={onFireClick}>💥</button>
        {/* <button>⬆️</button>
        <button>➡️</button>
        <button>⬅️</button>
        <button>⬇️</button> */}
      </div>
    </div>
  )
}

export default TopBar
