import TanksGame from "src/components/TanksGame/TanksGame"
import { getGameManager } from "./tanks-game-manager"



function TanksJS() {
  const gameManager = getGameManager()
  return (
    <>
      <div
        class={`
        `}
      >
        <h4>TanksJS</h4>
        <div>
          <TanksGame gameManager={gameManager} />
        </div>
      </div>
    </>
  )
}

export default TanksJS
