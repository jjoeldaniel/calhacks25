import { Outlet } from "react-router-dom"
import NavBar from "./Components/Global/NavBar"
import { UIRegister } from "./Contexts/UIContext"


function App() {

  UIRegister("UserSettings", {
    userName: localStorage.getItem("UserSettings:userName") || "",
    pronouns: localStorage.getItem("UserSettings:pronouns") || "",
    bio: localStorage.getItem("UserSettings:bio") || ""
  })

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
