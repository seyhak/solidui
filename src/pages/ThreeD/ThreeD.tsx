import { createEffect, createSignal } from "solid-js"
import "./ThreeD.css"
import ThreeDScene from "src/components/ThreeDScene/ThreeDScene"

const LS_KEY = "3Ddata"

export type ThreeDData = {
  name: string
  components: {
    id: number
    name: string
    instances?: {
      id: number
      name: string
    }[]
  }[]
}

const data: ThreeDData = {
  name: "adasd",
  components: [
    {
      id: 123,
      name: "comp 1",
      instances: [
        {
          id: 123,
          name: "ins 1",
        },
        {
          id: 123,
          name: "ins 2",
        },
      ],
    },
    {
      id: 1234,
      name: "comp 2",
      instances: [
        {
          id: 123,
          name: "ins 1",
        },
      ],
    },
    {
      id: 1235,
      name: "comp 3",
    },
  ],
}

function ThreeD() {
  const [instancesNo, setInstancesNo] = createSignal<number>(0)
  const [compNo, setCompno] = createSignal<number>(0)
  const [maxSpeed, setMaxSpeed] = createSignal<number>(2)
  const [jsonData, setJsonData] = createSignal<string | null>(
    localStorage.getItem(LS_KEY) || JSON.stringify(data)
  )
  const onAddClick = () => {
    const obj = JSON.parse(jsonData())

    const instances = []
    for (let index = 0; index < instancesNo(); index++) {
      instances.push({
        id: 123,
        name: `${obj.components.length}-ins ${index}`,
      })
    }
    obj.components.push({
      id: 1235,
      name: `comp ${obj.components.length}`,
      instances,
    })
    setJsonData(JSON.stringify(obj))
  }
  const onRemoveClick = () => {
    const obj = JSON.parse(jsonData())

    obj.components.splice(compNo(), 1)
    setJsonData(JSON.stringify(obj))
  }

  createEffect(() => {
    localStorage.setItem(LS_KEY, jsonData())
  })
  return (
    <>
      <div class="flex justify-center my-1 mx-auto w-full flex-col">
        <textarea
          class="h-[10rem] w-full"
          placeholder="json"
          onChange={(e) => {
            setJsonData(e.target.value)
          }}
          value={jsonData()}
        />
        <div class="flex gap-1 m-2">
          <button onClick={onAddClick}>Add Component With Instances</button>

          <input
            onChange={(e) => {
              setInstancesNo(parseInt(e.target.value))
            }}
            value={instancesNo()}
            type="number"
            max={5}
            min={0}
          />
        </div>
        <div class="flex gap-1 m-2">
          <button onClick={onRemoveClick}>Remove Component</button>
          <input
            disabled={JSON.parse(jsonData()).components.length === 0}
            onChange={(e) => {
              setCompno(parseInt(e.target.value))
            }}
            value={compNo()}
            type="number"
            max={JSON.parse(jsonData()).components.length - 1}
            min={0}
          />
        </div>
        <div class="flex gap-1 m-2">
          Max SPEED
          <input
            onChange={(e) => {
              setMaxSpeed(parseInt(e.target.value))
            }}
            value={maxSpeed()}
            type="number"
            max={10}
            min={1}
          />
        </div>
      </div>
      <ThreeDScene data={JSON.parse(jsonData())} maxSpeed={maxSpeed()} />
    </>
  )
}

export default ThreeD
