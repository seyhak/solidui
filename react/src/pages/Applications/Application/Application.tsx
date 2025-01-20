import { useParams } from "react-router"
import { applicationFactory } from "/src/utils/factories"

export const Application = () => {
  const { name } = useParams()
  const application = applicationFactory()

  return (
    <div>
      <h1>{name}</h1>
      <ol>
        {application.users.map((user, idx) => (
          <li key={idx}>{`${user.position} - ${user.name}`}</li>
        ))}
      </ol>
      <h1>{application.isActive ? "✔️" : "⭕"}</h1>
    </div>
  )
}
export default Application
