import { createEffect, createSignal, on } from 'solid-js'
import { createStore } from 'solid-js/store'
import type {Coordinates, PlayerState, TanksGameState} from 'src/types/tanks'

type TankProps = Pick<TanksGameState, "bulletPaths" | "turn"> & {
  state: PlayerState
  isMirrored?: boolean
  increaseTurn: () => void
}
const Tank = (props: TankProps) => {
  const [bulletCoos, setBulletCoos] = createStore<Coordinates>({X: 0, Y: 0})
  const [isOnFly, setIsOnFly] = createSignal(false)

  createEffect(on(() => props.bulletPaths.length, async () => {
    // console.log('props.bulletPaths.length', props.bulletPaths.length)
    const isP2 = props.isMirrored
    const shouldSkip1Turn = (isP2 && props.turn === 0)

    const thisTurnPaths = props.bulletPaths?.[props.turn] || []
    // console.log('props.turn', props.turn, isOnFly())
    // console.log(props.bulletPaths, 'thisTurnPaths', thisTurnPaths)
    const isActive = (props.turn % 2 === 0 && isP2) || (props.turn % 2 === 1 && !isP2)
    if(isOnFly() || isActive || shouldSkip1Turn || !thisTurnPaths.length){
      return
    }
    setIsOnFly(true)

    // console.log({thisTurnPaths}, thisTurnPaths.length)
    await new Promise(async (res, rej) => {
      for (let i = 0; i < thisTurnPaths.length / 10; i++) {
        await new Promise((res, _) => {
          setTimeout(() => {
            const nextCoo = props.bulletPaths[props.turn]?.[i * 10]
            if(nextCoo){
              setBulletCoos(props.bulletPaths[props.turn]?.[i * 10])
            }
            res(1)
          }, 10)
        })
      }
      res(1)
    })
    setBulletCoos({X: 0, Y: 0})
    props.increaseTurn()
    setIsOnFly(false)
  }))

  return (
    <div class="absolute bottom-0" style={{left: `${props.state.X}px`, transform: `scaleX(${props.isMirrored ? -1 : 1})`}}>
      <div class="flex flex-col items-center">
        <div class="tower w-[50px] h-[50px] bg-green-900 rounded-t-sm left-1/2">
          <div class="relative">
            <div class="absolute bottom-[-20px] right-0" style={{
              transform: `rotate(${props.state.cannonAngle}deg)`
            }}>
              <div class="relative">
                <div class="cannon w-[100px] h-[8px] bg-green-950 absolute">
                  <div class="relative">
                    <div class="cannon-tip absolute right-0 top-[4px]">
                      <div class="relative" style={{
                          transform: `rotate(${-1 * props.state.cannonAngle}deg)`
                        }}>
                        <div class="bullet absolute border-4 rounded border-red-600" style={{
                          transform: `rotate(0deg) translate(${bulletCoos.X}px, ${-1* bulletCoos.Y}px)`
                        }}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="body w-[100px] h-[50px] bg-green-900 rounded-t-md">

        </div>
        <div class="wheels rounded-md w-[90px] h-[10px] bg-green-950"/>
      </div>
    </div>
  )
}
export default Tank