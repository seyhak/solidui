import type { TanksGameState } from "src/types/tanks"
import { SETTINGS } from "./TanksGame"
import Tank from "./Tank"

type RendererProps = Pick<
  TanksGameState,
  "playersState" | "player" | "bulletPaths" | "turn"
> & {
  increaseTurn: () => void
}

const Renderer = (props: RendererProps) => {
  return (
    <div class="w-full flex flex-col flex-1">
      <div
        class={`
        sky w-full flex flex-col flex-1 bg-sky-400
        relative
      `}
      >
        <Tank
          state={props.playersState[0]}
          turn={props.turn}
          bulletPaths={props.bulletPaths}
          increaseTurn={props.increaseTurn}
        />
        <div class="wall absolute bottom-0 bg-slate-800 h-[200px] w-[20px] left-1/2" />
        <Tank
          state={props.playersState[1]}
          turn={props.turn}
          bulletPaths={props.bulletPaths}
          increaseTurn={props.increaseTurn}
          isMirrored
        />
      </div>
      <div
        class="ground w-full bg-green-400"
        style={{ height: `${SETTINGS.Y}px` }}
      />
    </div>
  )
}

export default Renderer
