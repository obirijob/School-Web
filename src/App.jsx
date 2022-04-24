import "./App.scss"
import { useState, useEffect } from "react"
import LoadBE from "./Helpers/LoadBE"
import Login from "./Components/Login"
import TopNav from "./Components/TopNav"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Students from "./Components/Students"
import Parents from "./Components/Parents"
import Classes from "./Components/Classes"
import Student from "./Components/Student"
import Subjects from "./Components/Subjects"
import Grades from "./Components/Grades"

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
              <Route exact path="Students/:adm" element={<Student />} />
              <Route exact path="Parents" element={<Parents />} />
              <Route exact path="Classes" element={<Classes />} />
              <Route exact path="Subjects" element={<Subjects />} />
              <Route exact path="Grades" element={<Grades />} />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  )
}

export default App
