export type User = {
  name: string
  position: "owner" | "user" | "child"
}
export type Application = {
  id: string
  name: string
  users: User[]
  isActive: boolean
}
