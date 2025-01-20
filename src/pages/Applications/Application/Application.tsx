import { useParams } from "@solidjs/router"
import { For } from "solid-js"
import { applicationFactory } from "src/utils/factories"

export const Application = () => {
  const params = useParams()
  const application = applicationFactory()

  return (
    <div>
      <h1>{params.name}</h1>
      <ol>
        <For each={application.users}>
          {(user) => <li>{`${user.position} - ${user.name}`}</li>}
        </For>
      </ol>
      <h1>{application.isActive ? "✔️" : "⭕"}</h1>
    </div>
  )
}
export default Application
