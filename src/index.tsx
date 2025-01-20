/* @refresh reload */
import { render } from "solid-js/web"
import { Route, Router } from "@solidjs/router"
import "./index.css"
// only in dev mode ?
import "solid-devtools"

import { lazy } from "solid-js"
import { Layout } from "./Layout"
import { ForceChart } from "./components/D3Charts/ForceChart"

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
const ChartsWrapper = lazy(() => import("./pages/Charts/ChartsWrapper"))
const Charts = lazy(() => import("./pages/Charts/Charts"))
const ThreeD = lazy(() => import("./pages/ThreeD/ThreeD"))

render(
  () => (
    <Router base="/solidui" root={Layout}>
      <Route path="/" component={Home} />
      <Route path="/intro" component={Intro} />
      <Route path="/tanks" component={Tanks} />
      <Route path="/tanksjs" component={TanksJS} />
      <Route path="/applications">
        <Route path="/" component={Applications} />
        <Route path="/:name" component={Application} />
      </Route>
      {/* <Route path="/users" component={Users} /> */}
      <Route path="/charts" component={ChartsWrapper}>
        <Route path="/" component={Charts} />
        <Route path="/force_chart" component={ForceChart} />
      </Route>
      <Route path="/threed" component={ThreeD} />
      <Route path="*paramName" component={NotFound} />
    </Router>
  ),
  root!
)
