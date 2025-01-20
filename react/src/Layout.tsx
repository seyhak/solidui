import { Link } from "react-router-dom"
import { createSignal } from "solid-js"
import { Outlet } from "react-router-dom"

export const Layout = (props: any) => {
  const [isLightTheme, setLightTheme] = createSignal(true)
  const onThemeClick = () => {
    setLightTheme((prev) => {
      const shouldBeLight = !prev
      const html = document.querySelector("html")
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
      className={`
      flex flex-col justify-between min-h-dvh
      bg-gradient-to-br from-blue-100 via-blue-500 to-lime-500
      dark:bg-blue-900 dark:from-gray-900 dark:via-blue-950 dark:to-lime-900
      dark:text-white
      `}
    >
      <div className="flex gap-2 justify-between h-[3.5rem]">
        <h2 className="mt-2 mx-2">Rap God</h2>
        <nav
          className={`flex gap-4 justify-between
        dark:bg-slate-900 bg-slate-200
        py-4 px-6 rounded-b-md
        `}
        >
          <Link to="/">Home</Link>
          <Link to="/intro">Intro</Link>
          <Link to="/applications">Applications</Link>
        </nav>
        <button className="mt-2 mx-2" onClick={onThemeClick}>
          {isLightTheme() ? "🌞" : "🌕"}
        </button>
      </div>
      <div
        className={`
      flex flex-1 flex-col items-center justify-between max-h-[calc(100dvh-3.5rem)]
      overflow-auto`}
      >
        <main className="flex flex-1 justify-between">
          <Outlet />
        </main>
        <footer
          className={`
        flex flex-col p-4 mt-2 items-center
        `}
        >
          <div className={`p-4 w-full flex justify-center`}>
            <div
              className={`bg-blue-700 dark:bg-slate-900 w-[30%] h-1 rounded`}
            />
          </div>
          <div className="flex p-4 mt-2 gap-10 justify-center ">
            <a href="https://twitter.com">🦆</a>
            <a href="https://instagram.com">📸</a>
          </div>
          <p>blabla company</p>
        </footer>
      </div>
    </div>
  )
}
