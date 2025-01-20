import { A } from "@solidjs/router"
import { createSignal } from "solid-js"

export const Layout = (props: any) => {
  const [isLightTheme, setLightTheme] = createSignal(true)
  const onThemeClick = () => {
    setLightTheme((prev) => {
      const shouldBeLight = !prev
      const html = document.querySelector("html")
      console.log({ html })
      if (shouldBeLight) {
        html?.classList.remove("dark")
      } else {
        html?.classList.add("dark")
      }
      console.log(html?.classList)
      return shouldBeLight
    })
  }
  return (
    <div
      class={`
      flex flex-col justify-between min-h-dvh
      bg-gradient-to-br from-blue-100 via-blue-500 to-lime-500
      dark:bg-blue-900 dark:from-gray-900 dark:via-blue-950 dark:to-lime-900
      dark:text-white
      `}
    >
      <div class="flex gap-2 justify-between h-[3.5rem]">
        <h2 class="mt-2 mx-2">Rap God</h2>
        <nav
          class={`flex gap-4 justify-between
        dark:bg-slate-900 bg-slate-200
        py-4 px-6 rounded-b-md
        `}
        >
          <A href="/">Home</A>
          <A href="/intro">Intro</A>
          <A href="/tanks">Tanks</A>
          <A href="/tanksjs">TanksJS</A>
          <A href="/applications">Applications</A>
          <A href="/charts/force_chart">Charts</A>
          <A href="/threed">3D</A>
        </nav>
        <button class="mt-2 mx-2" onClick={onThemeClick}>
          {isLightTheme() ? "🌞" : "🌕"}
        </button>
      </div>
      <div
        class={`
      flex flex-1 flex-col items-center justify-between max-h-[calc(100dvh-3.5rem)]
      overflow-auto`}
      >
        <main class="flex flex-1 justify-between w-full items-center flex-col">{props.children}</main>
        <footer
          id="footer"
          class={`
        flex flex-col p-4 mt-2 items-center
        `}
        >
          <div class={`p-4 w-full flex justify-center`}>
            <div class={`bg-blue-700 dark:bg-slate-900 w-[30%] h-1 rounded`} />
          </div>
          <div class="flex p-4 mt-2 gap-10 justify-center ">
            <a href="https://twitter.com">🦆</a>
            <a href="https://instagram.com">📸</a>
          </div>
          <p>blabla company</p>
        </footer>
      </div>
    </div>
  )
}
