import "./App.scss"
import { useState, useEffect } from "react"
import LoadBE from "./Helpers/LoadBE"
import Login from "./Components/Login"
import TopNav from "./Components/TopNav"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Students from "./Components/Students"
import Parents from "./Components/Parents"

function App() {
  const [loggedAs, setLoggedAs] = useState("none")

  useEffect(() => {
    loggedInAs()
  }, [])

  async function loggedInAs() {
    let { data } = await LoadBE("{loggedInAs}")
    if (data) {
      setLoggedAs(data.loggedInAs)
    }
  }

  return (
    <div className="main">
      {loggedAs === "none" ? (
        <Login reloadAuth={() => loggedInAs()} />
      ) : (
        <BrowserRouter>
          <TopNav loggedAs={loggedAs} reloadAuth={() => loggedInAs()} />
          <div className="content">
            <Routes>
              <Route exact path="Students" element={<Students />} />
              <Route exact path="Parents" element={<Parents />} />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  )
}

export default App
