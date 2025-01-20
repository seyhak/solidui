import { A } from "@solidjs/router"
import { JSX } from "solid-js"

type ChartsWrapperProps = {
  children: JSX.Element
}

const ChartsWrapper = (props) => {
  return (
    <div class="flex flex-col w-full mx-[10vw]">
      <nav
        class={`flex gap-4 justify-between
        dark:bg-slate-900 bg-slate-200
        py-4 px-6 rounded-b-md mx-auto mb-4
        `}
      >
        <A href="charts">Home</A>
        <A href="force_chart">ForceChart</A>
      </nav>
      <div class="flex flex-col w-full items-center">
        {props.children}
      </div>
    </div>
  )
}
export default ChartsWrapper
