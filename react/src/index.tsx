/* @refresh reload */
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import "./index.css"

import { lazy } from "react"
import { createRoot } from "react-dom/client"
import { Layout } from "./Layout"

const root = document.getElementById("root")

const Intro = lazy(() => import("./pages/Intro/Intro"))
const NotFound = lazy(() => import("./pages/NotFound/NotFound"))
const Applications = lazy(() => import("./pages/Applications/Applications"))
const Application = lazy(
  () => import("./pages/Applications/Application/Application")
)
const Home = lazy(() => import("./pages/Home/Home"))

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="intro" element={<Intro />} />
        <Route path="applications">
          <Route path="" element={<Applications />} />
          <Route path=":name" element={<Application />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
  )
)

createRoot(root!).render(<RouterProvider router={router} />)
