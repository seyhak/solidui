/* @refresh reload */
import { render } from "solid-js/web"
import { Route, Router } from "@solidjs/router"
import "./index.css"
// only in dev mode ?
import "solid-devtools"

import { lazy } from "solid-js"
import { Layout } from "./Layout"

const root = document.getElementById("root")

const Intro = lazy(() => import("./pages/Intro/Intro"))
const NotFound = lazy(() => import("./pages/NotFound/NotFound"))
const Applications = lazy(() => import("./pages/Applications/Applications"))
const Application = lazy(
  () => import("./pages/Applications/Application/Application")
)
const Home = lazy(() => import("./pages/Home/Home"))
const Tanks = lazy(() => import("./pages/Tanks/Tanks"))
const TanksJS = lazy(() => import("./pages/TanksJS/TanksJS"))

render(
  () => (
    <Router root={Layout}>
      <Route path="/" component={Home} />
      <Route path="/intro" component={Intro} />
      <Route path="/tanks" component={Tanks} />
      <Route path="/tanksjs" component={TanksJS} />
      <Route path="/applications">
        <Route path="/" component={Applications} />
        <Route path="/:name" component={Application} />
      </Route>
      {/* <Route path="/users" component={Users} /> */}
      <Route path="*paramName" component={NotFound} />
    </Router>
  ),
  root!
)
