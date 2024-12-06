import { Application } from "../types/types"

export const generateRandomIntInRange = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min) + min)

export const generateRandomString = (len = 15) => {
  const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789       "
  let newString = ""
  for (let index = 0; index < len; index++) {
    const charIdx = generateRandomIntInRange(CHARS.length - 1)
    const newChar = CHARS[charIdx]
    newString += newChar
  }
  return newString
}
export const generateRandomFromArr = (what: any[]) => {
  return what[generateRandomIntInRange(what.length - 1)]
}

const userFactory = () => {
  return {
    name: generateRandomString(),
    position: generateRandomFromArr(["owner", "user", "child"]),
  }
}

export const applicationFactory = (): Application => {
  return {
    id: crypto.randomUUID(),
    name: generateRandomString(),
    price: generateRandomIntInRange(1000000, 10),
    users: Array.from({ length: generateRandomIntInRange(10) }, userFactory),
    isActive: !!(generateRandomIntInRange(2) - 1),
  }
}
