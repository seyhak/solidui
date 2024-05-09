import { For, Show, createResource } from "solid-js"
import { applicationFactory } from "src/utils/factories"
import { Application } from "../../types/types"
import "./Applications.module.css"

const fetchApplications = async () => {
  const MAX = 1000
  const MIN = 100
  const elementsCount = Math.floor(Math.random() * (MAX - MIN) + MIN)
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
    }, howLongToWait)
  })
  return data
}

export const Applications = () => {
  const [data, { mutate, refetch }] = createResource(fetchApplications)

  return (
    <div class="flex justify-center items-center flex-col mt-8">
      <Show
        when={data()?.length}
        fallback={<div class="animate-ping duration-1000">Loading...</div>}
      >
        <div class="flex justify-between flex-1 items-center gap-4">
          <p>{`Count: ${data()?.length}`}</p>
          <button
            onClick={() => {
              mutate([])
              refetch()
            }}
          >
            Refetch
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
                  {(key) => <th>{key}</th>}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={data()} fallback={<div>Loading...</div>}>
                {(item) => (
                  <tr>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
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
