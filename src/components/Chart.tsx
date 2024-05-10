import { Application } from "src/types/types"
import { Show, createEffect, createMemo, createSignal } from "solid-js"
import { LinePlot } from "./LineChart"

type ChartProps = {
  data?: Application[]
}

export const Chart = (props: ChartProps) => {
  const data = () => props.data
  console.log({ data: props.data })
  const [ys, setYs] = createSignal<number[]>([])
  const dataValues = createMemo(() => {
    console.log("memo")
    return props.data?.map((x) => x.price)
  })
  createEffect(() => {
    console.log("Create effect", data())
    console.log("Create effect dataValues", dataValues()?.length)
    const neww = data()?.map((x) => x.price)
    console.log("neww", neww?.length)
    setYs(neww || [])
  })
  // })
  return (
    <>
      <LinePlot data={dataValues()} />
      {/* <LinePlot data={ys()}/> */}
    </>
  )
}
