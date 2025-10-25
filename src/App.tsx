import { Outlet } from "react-router-dom"

function App() {
  return (
    <>
      <main className="w-full h-dvh flex justify-between overflow-hidden relative">
        <Outlet/>
      </main>
    </>
  )
}

export default App
