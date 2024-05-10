import { applicationFactory } from "/src/utils/factories"
import { Application } from "../../types/types"
import "./Applications.module.css"
import { useEffect, useState } from "react"

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
  const [data, setData] = useState<Application[] | null>(null)

  const [isLoading, setisLoading] = useState(false)

  const refetch = async () => {
    setisLoading(true)
    const newData = await fetchApplications()
    setData(newData)
    setisLoading(false)
  }
  const onAddClick = async (count = 100) => {
    const start = Date.now()
    console.log("start", start)
    setisLoading(true)
    const newData = await fetchApplications(count)
    setData((prev) => [...(prev || []), ...newData])
    setisLoading(false)

    const fin = Date.now()
    console.log("fin", fin)
    const result = new Date(fin - start)
    console.log("result", result.getTime())
  }
  useEffect(() => {
    refetch()
  }, [])
  return (
    <div className="flex justify-center items-center flex-col mt-8">
      {!data?.length ? (
        <div className="animate-ping duration-1000">Loading...</div>
      ) : (
        <>
          <div className="flex justify-between flex-1 items-center gap-4">
            <p>{`Count: ${data?.length}`}</p>
            {isLoading && (
              <div className="animate-ping duration-1000">Loading...</div>
            )}
            <button
              onClick={() => {
                refetch
              }}
              disabled={isLoading}
            >
              Refetch
            </button>
            <button
              onClick={() => {
                onAddClick(1000)
              }}
              disabled={isLoading}
            >
              + 1000
            </button>
            <button
              onClick={() => {
                onAddClick(10000)
              }}
              disabled={isLoading}
            >
              + 10000
            </button>
            <button
              onClick={() => {
                onAddClick(100000)
              }}
              disabled={isLoading}
            >
              + 100 000
            </button>
            <button
              onClick={() => {
                onAddClick(1000000)
              }}
              disabled={isLoading}
            >
              + 1 000 000
            </button>
          </div>
          <div>
            <table className="table-auto border-spacing-4 border-black dark:border-white border m-4">
              <thead>
                <tr>
                  {Object.keys(data?.[0] || {}).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                      <ul>
                        {item.users.map((user) => (
                          <li
                            key={`${user.position} - ${user.name}`}
                          >{`${user.position} - ${user.name}`}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{item.isActive ? "✔️" : "⭕"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
export default Applications
