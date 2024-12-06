import * as d3 from "d3"
import { forceChartDemoData, techdebtDemoRaw } from "./graph"
import { createSignal, For, Match, Switch } from "solid-js"
import {
  generateRandomFromArr,
  generateRandomIntInRange,
  generateRandomString,
} from "src/utils/factories"

type ChartProps = {
  onCircleClick: (d: any) => any
  force: number
  distance: number
}
const chart = (data: any, props: ChartProps) => {
  const R_BASE = 5
  const R_MULT = 1.2
  const LINK_DISTANCE = props.distance
  const MANY_BODY_FORCE = props.force * -1 || -300
  // TODO play with consts or count
  console.log({ data })
  // Specify the dimensions of the chart.
  const MULT = 1.4
  const width = 928 * MULT
  const height = 680 * MULT

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10)
  const lineColor = d3.scaleOrdinal(["white"])

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = data.links.map((d) => ({ ...d }))
  const nodes = data.nodes.map((d) => ({ ...d }))

  // Create a simulation with several forces.
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d: any) => d.id)
        .distance(LINK_DISTANCE)
    )
    .force("charge", d3.forceManyBody().strength(MANY_BODY_FORCE))
    .force("x", d3.forceX())
    .force("y", d3.forceY())

  // Create the SVG container.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;")

  // Add a line for each link, and a circle for each node.
  const link = svg
    .append("g")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke", (d: any) => lineColor(d.value))
    .attr("stroke-width", (d: any) => Math.sqrt(d.value))
    .attr("class", "line cursor-pointer")
  console.log({ link })

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", (d: any) => d?.count * R_MULT + R_BASE)
    .attr("fill", (d: any) => {
      const col = color(d.group)
      return col
    })
    .attr("class", "line cursor-pointer")
    .on("click", (event) => {
      console.log("d", event)
      props.onCircleClick(event)
      const target = event.target as any
      const dData = target?.__data__
      svg.selectAll("line").attr("stroke", (line: any) => {
        if (line.source.id === dData.id || line.target.id === dData.id) {
          return "green"
        }
        return lineColor(line.value)
      })
    })

  node.append("title").text((d: any) => d.id)

  // Add a drag behavior.
  node.call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  )

  // Set the position attributes of links and nodes each time the simulation ticks.
  simulation.on("tick", () => {
    link
      .attr("x1", (d: any) => {
        // console.log({d})
        return d.source.x
      })
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y)

    node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)
  })

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    console.log({ event })
    event.subject.fx = event.x
    event.subject.fy = event.y
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0)
    event.subject.fx = null
    event.subject.fy = null
  }

  // When this cell is re-run, stop the previous simulation. (This doesn’t
  // really matter since the target alpha is zero and the simulation will
  // stop naturally, but it’s a good practice.)
  // invalidation.then(() => simulation.stop());

  return svg.node()
}

const renderChart = (data: any, props: ChartProps) => {
  try {
    return chart(data, props)
  } catch (e) {
    console.error(e)
    console.log(e.message as TypeError)
    return e.message
  }
}

type ForceChartData = {
  application: {
    id: number
    name: string
  }
  software: {
    id: number
    name: string
  }
  host: {
    contentType: {
      model: "virtualmachine" | "asset"
    }
  }
  isUsed: boolean
}
export type ForceChartProps = {
  data: ForceChartData[]
}
const DATA_TYPES = {
  demo: 0,
  json: 1,
  random: 2,
  randomDemo: 3,
} as const

type DataTypes = (typeof DATA_TYPES)[keyof typeof DATA_TYPES]

// const ChartRenderer = (props) => {
//   // const x = d3.scaleLinear([0, props.data.length - 1], [marginLeft, width - marginRight]);
//   // const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
//   // const line = d3.line((d, i) => x(i), y);
//     return (
//       <svg width={1000} height={1000}>
//         {/* <path fill="none" stroke="currentColor" stroke-width="1.5" d={line(data)} /> */}
//         <g fill="white" stroke="currentColor">
//           {/* {props.data.nodes.map((d, i) => (<circle cx={x(i)} cy={y(d)} r="2.5" />))} */}
//           {props.data.nodes.map((d, i) => (<circle r="2.5" />))}
//         </g>
//       </svg>
//     );
// }
const getRandomData = (count = 700) => {
  const result = []
  for (let index = 0; index < count; index++) {
    result.push({
      is_used: Math.random() > 0.5,
      application: {
        id: generateRandomIntInRange(100, 1),
        name: generateRandomString(),
      },
      host: {
        content_type: {
          id: 157,
          model: generateRandomFromArr(["virtualmachine", "asset"]),
        },
      },
      software: {
        id: generateRandomIntInRange(100, 1),
        name: generateRandomString(),
      },
    })
  }
  return result
}
const parseData = (data) => {
  // [{"is_used":true,"application":{"id":321,"name":"orbitalna"},"host":{"content_type":{"id":157,"model":"virtualmachine"}},"software":{"id":213132,"name":"MOngo DB"}}]
  console.log("parse data", data)
  if (typeof data === "string") {
    data = JSON.parse(data)
  }
  console.log("parse data", data)
  const result = {
    nodes: [],
    links: [],
  }
  const applicationIdToObj = {}
  const softwareIdToObj = {}
  const groupBySet = new Set()
  const groupBySoftwareSet = new Set()
  try {
    for (let index = 0; index < data.length; index++) {
      const el = data[index]
      // "id": "A bump-and-hole approach to engineer controlled selectivity of BET bromodomain chemical probes",
      // "group": "Cited Works",
      // "radius": 7,
      // "citing_patents_count": 7

      // is_used: true,
      // application: {
      //   id: 321,
      //   name: "orbitalna"
      // },
      // host: {
      //   content_type: {
      //     id: 157,
      //     model: "virtualmachine"
      //   }
      // },
      // software: {
      //   id: 213132,
      //   name: "MOngo DB"
      // }

      // {
      //   "source": "Optimisation of the Anti-Trypanosoma brucei Activity of the Opioid Agonist U50488",
      //   "target": "073-531-962-083-670",
      //   "value": 2
      // }
      const application = {
        id: `application_${el.application.id}`,
        name: el.application.name,
        group: el.host.content_type.model,
      }
      const count = 1
      const blabla = 2
      const software = {
        id: `software_${el.software.id}`,
        name: el.software.name,
        group: "software",
      }
      if (!groupBySoftwareSet.has(software.id)) {
        softwareIdToObj[software.id] = {
          ...software,
          count,
          blabla,
        }
        groupBySoftwareSet.add(software.id)
      } else {
        softwareIdToObj[software.id].count++
      }
      if (!groupBySet.has(application.id)) {
        applicationIdToObj[application.id] = {
          ...application,
          count,
          blabla,
        }
        groupBySet.add(application.id)
      } else {
        applicationIdToObj[application.id].count++
      }

      result.links.push({
        source: application.id,
        target: software.id,
        value: el.is_used ? 10 : 1,
      })
    }
    Object.values(applicationIdToObj).forEach((obj: object) => {
      result.nodes.push({
        ...obj,
      })
    })
    Object.values(softwareIdToObj).forEach((obj: object) => {
      result.nodes.push({
        ...obj,
      })
    })
    console.log({ result, applicationIdToObj, softwareIdToObj })
  } catch (e) {
    console.error(e)
    return {}
  }
  return result
}

type InfoWindowProps = {
  isVisible: boolean
  class?: string
  selectedData?: TargetData
}
const InfoWindow = (props: InfoWindowProps) => {
  return (
    <div>
      {props.isVisible && (
        <div class={"bg-white w-[10rem] min-h-[3rem] absolute" + props.class}>
          <h3 class="text-black">
            <b>id: </b>
            {props.selectedData.id}
          </h3>
          <h3 class="text-black">
            <b>name: </b>
            {props.selectedData.name}
          </h3>
          <h3 class="text-black">
            <b>count: </b>
            {props.selectedData.count}
          </h3>
        </div>
      )}
    </div>
  )
}

type TargetData = {
  id: string
  name: string
  count: number
}

export const ForceChart = () => {
  const [dataType, setDataType] = createSignal<DataTypes>(DATA_TYPES.random)
  const [force, setForce] = createSignal<number>(300)
  const [points, setPoints] = createSignal<number>(700)
  const [distance, setDistance] = createSignal<number>(0)
  const [selectedData, setSelectedData] = createSignal<TargetData | undefined>(
    undefined
  )
  const [jsonData, setJsonData] = createSignal<string | null>(null)
  const onCircleClick = (e: MouseEvent) => {
    const target = e.target as any
    setSelectedData(target?.__data__)
    console.log(e, target?.__data__)
  }
  const safeRender = (data: any) =>
    renderChart(data, {
      onCircleClick,
      force: force(),
      distance: distance(),
    })
  console.log(DATA_TYPES.demo)
  return (
    <>
      <select
        value={dataType()}
        onChange={(e) => setDataType(parseInt(e.target.value) as DataTypes)}
      >
        <For each={Object.entries(DATA_TYPES)}>
          {([k, v]) => <option value={v}>{k}</option>}
        </For>
      </select>
      <p class="p-2">{selectedData() ? 123123 : 412443534544354}</p>
      <div class="flex justify-center my-1 mx-auto w-full">
        <textarea
          class="h-[10rem] w-full"
          placeholder="json"
          onChange={(e) => {
            setJsonData(e.target.value)
          }}
        />
      </div>
      <div class="my-4">
        <div class="py-2 flex items-center">
          <label for="force" class="mr-2">
            Force (between 100 and 700):
          </label>
          <input
            value={force()}
            type="range"
            id="points"
            name="force"
            min="100"
            max="700"
            onChange={(e) => {
              console.log(e.target.value)
              setForce(parseInt(e.target.value))
            }}
          />
        </div>
        <div class="py-2 flex items-center">
          <label for="points" class="mr-2">
            Points (between 10 and 1000):
          </label>
          <input
            value={points()}
            type="range"
            id="points"
            name="points"
            min="10"
            max="1000"
            onChange={(e) => {
              console.log(e.target.value)
              setPoints(parseInt(e.target.value))
            }}
          />
        </div>
        <div class="py-2 flex items-center">
          <label for="distance" class="mr-2">
            Distance (between 0 and 300):
          </label>
          <input
            value={distance()}
            type="range"
            id="distance"
            name="distance"
            min="10"
            max="1000"
            onChange={(e) => {
              console.log(e.target.value)
              setDistance(parseInt(e.target.value))
            }}
          />
        </div>
      </div>
      <div class="my-2 flex gap-2 relative">
        <InfoWindow
          class=""
          isVisible={!!selectedData()}
          selectedData={selectedData()}
        />
        {/* <ChartRenderer data={forceChartDemoData}/> */}
        <Switch fallback={<div>Not Found {dataType()}</div>}>
          <Match when={dataType() === DATA_TYPES.demo}>
            {safeRender(forceChartDemoData)}
          </Match>
          <Match when={dataType() === DATA_TYPES.json}>
            {safeRender(parseData(jsonData()))}
          </Match>
          <Match when={dataType() === DATA_TYPES.random}>
            {safeRender(parseData(getRandomData(points())))}
          </Match>
          <Match when={dataType() === DATA_TYPES.randomDemo}>
            {safeRender(parseData(techdebtDemoRaw))}
          </Match>
        </Switch>
      </div>
    </>
  )
}
