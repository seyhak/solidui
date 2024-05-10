import { createEffect, createSignal, mergeProps } from "solid-js"
import { scaleLinear, extent, line, count } from "d3"

export function LinePlot(props: any) {
  props = mergeProps(
    {
      width: 1000,
      height: 400,
      marginTop: 20,
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 20,
    },
    props
  )
  const [counter, setCounter] = createSignal(0)
  const [xVisible, setXVisible] = createSignal(
    scaleLinear(
      [0, props.data.length - 1],
      [props.marginLeft, props.width - props.marginRight]
    )
  )
  const [yVisible, setYVisible] = createSignal(
    scaleLinear(extent(props.data.slice(0)), [
      props.height - props.marginBottom,
      props.marginTop,
    ])
  )

  createEffect(() => {
    console.log("effect", counter(), props.data.length)
    if (counter() === props.data.length - 1) return
    const MAX_TIME = 5000
    const timeout = MAX_TIME / props.data.length
    setTimeout(() => {
      setXVisible(() =>
        scaleLinear(
          [0, counter() - 1],
          [props.marginLeft, props.width - props.marginRight]
        )
      )
      // setYVisible(() => scaleLinear(extent(props.data.slice(0, 1 + counter)), [props.height - props.marginBottom, props.marginTop]))
      setCounter((prev) => prev + 1)
    }, timeout)
  })
  // const x = scaleLinear([0, props.data.length - 1 - counter()], [props.marginLeft, props.width - props.marginRight]);
  const y = scaleLinear(extent(props.data), [
    props.height - props.marginBottom,
    props.marginTop,
  ])
  const myLine = line((d: any, i: number) => xVisible()(i), yVisible())
  return (
    <>
      <p>{counter()}</p>
      <svg width={props.width} height={props.height}>
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          d={myLine(props.data.slice(0, 1 + counter()))}
        />
        <g fill="white" stroke="currentColor" stroke-width="1.5">
          {props.data.slice(0, 1 + counter()).map((d: any, i: number) => (
            <circle cx={xVisible()(i)} cy={y(d)} r="2.5" />
          ))}
        </g>
      </svg>
    </>
  )
}
