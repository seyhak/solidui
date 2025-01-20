import { For, Show, createResource, createSignal } from "solid-js"
import { applicationFactory } from "src/utils/factories"
import { Application } from "../../types/types"
import "./Applications.module.css"
import { Chart } from "src/components/Chart"

const fetchApplications = async (elementsCount = 0) => {
  if (!elementsCount) {
    const MAX = 1000
    const MIN = 100
    elementsCount = Math.floor(Math.random() * (MAX - MIN) + MIN)
  }
  const howLongToWait = Math.floor(Math.random() * 5) * 1000
  const data = await new Promise<Application[]>((resolve, rej) => {
    console.log({ howLongToWait, elementsCount })
    setTimeout(() => {
      const result = []
      for (let index = 0; index < elementsCount; index++) {
        const element = applicationFactory()
        result[index] = element
      }
      console.log({ result })
      resolve(result)
    }, 0)
  })
  return data
}

export const Applications = () => {
  const [data, { mutate, refetch }] = createResource(async () =>
    fetchApplications()
  )
  const [sortBy, setSortBy] = createSignal<null | keyof Application>(null)
  const [isChartVisible, setChartVisible] = createSignal(false)
  const [isAdding, setIsAdding] = createSignal(false)
  const [isSorting, setIsSorting] = createSignal(false)

  const onAddClick = async (count = 100) => {
    const start = Date.now()
    console.log("start", start)
    setIsAdding(true)
    const newData = await fetchApplications(count)
    mutate((prev) => [...prev!, ...newData])
    setIsAdding(false)
    const fin = Date.now()
    console.log("fin", fin)
    const result = new Date(fin - start)
    console.log("result", result.getTime())
  }
  const sortByCol = (col: keyof Application) => {
    setIsSorting(true)
    const prevCol = sortBy()
    setSortBy(col)
    mutate((prev) => {
      if (prev) {
        if (prevCol === col) {
          setSortBy(null)
          prev?.sort((a, b) => (a[col] > b[col] ? -1 : 1))
        } else {
          prev?.sort((a, b) => (a[col] > b[col] ? 1 : -1))
        }
        return [...prev]
      }
      return prev
    })
    setIsSorting(false)
  }

  return (
    <div class="flex justify-center items-center flex-col mt-8">
      <Show
        when={data()?.length}
        fallback={<div class="animate-ping duration-1000">Loading...</div>}
      >
        <Show when={isChartVisible()}>
          <Chart data={data()} />
        </Show>
        <div class="flex justify-between flex-1 items-center gap-4">
          <p>{`Count: ${data()?.length}`}</p>
          <Show when={isAdding()}>
            <div class="animate-ping duration-1000">Loading...</div>
          </Show>
          <button
            onClick={() => {
              setChartVisible(prev => !prev)
            }}
          >
            Switch chart
          </button>
          <button
            onClick={() => {
              mutate([])
              refetch()
            }}
            disabled={isAdding()}
          >
            Refetch
          </button>
          <button
            onClick={() => {
              onAddClick(1000)
            }}
            disabled={isAdding()}
          >
            + 1000
          </button>
          <button
            onClick={() => {
              onAddClick(10000)
            }}
            disabled={isAdding()}
          >
            + 10000
          </button>
          <button
            onClick={() => {
              onAddClick(100000)
            }}
            disabled={isAdding()}
          >
            + 100 000
          </button>
          <button
            onClick={() => {
              onAddClick(1000000)
            }}
            disabled={isAdding()}
          >
            + 1 000 000
          </button>
        </div>
        <div>
          <table class="table-auto border-spacing-4 border-black dark:border-white border m-4">
            <thead>
              <tr>
                <For
                  each={Object.keys(data()?.[0] || {})}
                  fallback={<div>Loading...</div>}
                >
                  {(key) => (
                    <th>
                      <button
                        onClick={() => sortByCol(key as keyof Application)}
                        disabled={isSorting()}
                      >
                        {key}
                      </button>
                    </th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={data()} fallback={<div>Loading...</div>}>
                {(item) => (
                  <tr>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>
                      <ul>
                        {item.users.map((user) => (
                          <li>{`${user.position} - ${user.name}`}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{item.isActive ? "✔️" : "⭕"}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </div>
  )
}
export default Applications
