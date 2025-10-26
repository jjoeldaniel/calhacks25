import { Outlet } from "react-router-dom"
import NavBar from "./Components/Global/NavBar"

function App() {
  return (
    <>
      <main className="w-full h-dvh flex flex-col justify-between overflow-hidden relative">
        <NavBar/>
        <Outlet/>
      </main>
    </>
  )
}

export default App
