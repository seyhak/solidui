import TanksGame from "src/components/TanksGame/TanksGame"
// import init from 'src/wasm/main.wasm?init'

import { loadWasm } from 'src/wasm/wasm';
import { getGameManager } from "../TanksJS/tanks-game-manager";

// const gameManager: TanksGameManager = {
//   getDefaultState: getDefaultGameState as any,
//   handleEvent: handleEvent as any,
// }

function Tanks() {
  // console.log({gameManager}, gameManager.getDefaultState({} as any))
  loadWasm()
  // init().then((instance) => {
  //   console.log({instance})
  //   // @ts-ignore
  //   instance.exports.test()
  //   // @ts-ignore
  //   console.log(instance.exports.test())
  // })

  const gameManager = getGameManager(true)
  return (
    <>
      <script src="src/wasm/wasm_exec.js"></script>
      <div
        class={`
        `}
      >
        <h4>Tanks WASM</h4>
        <div>
          <TanksGame gameManager={gameManager} />
        </div>
      </div>
    </>
  )
}

export default Tanks
