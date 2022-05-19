import React, { useState, useEffect } from "react"
import LoadBE from "../Helpers/LoadBE"
import { DesktopIcon, LockClosedIcon, PersonIcon } from "@radix-ui/react-icons"
import { NavLink } from "react-router-dom"

function TopNav({ loggedAs, reloadAuth }) {
  const [det, setDet] = useState({ email: "", name: "", roles: [] })
  const [dropdown, setDropdown] = useState(false)
  useEffect(() => {
    loadDetails()
  }, [])

  async function loadDetails() {
    let q = `{${loggedAs === "parent" ? "myParentDetails" : "myUserDetails"}{
      email
      name
      ${loggedAs === "staff" ? "roles" : ""}
      ${loggedAs === "staff" ? "roles" : ""}
    }}`

    let { errors, data } = await LoadBE(q)
    if (data) {
      if (loggedAs === "parent") {
        let { email, name } = data.myParentDetails
        setDet({ email, name, roles: ["Parent"] })
      } else {
        setDet(data.myUserDetails)
      }
    }
  }
  return (
    <div className="topnav">
      <div className="icon">
        <DesktopIcon style={{ transform: "scale(2)" }} />
      </div>
      <div className="links">
        {/* <NavLink className="link" to="/">
          Dashboard
        </NavLink> */}
        <NavLink className="link" to="/Students">
          Students
        </NavLink>
        <NavLink className="link" to="/Parents">
          Parents
        </NavLink>
        <NavLink className="link" to="/Classes">
          Classes
        </NavLink>
        <NavLink className="link" to="/Subjects">
          Subjects
        </NavLink>
        <NavLink className="link" to="/Grades">
          Grades
        </NavLink>
        <NavLink className="link" to="/Cohorts">
          Cohorts
        </NavLink>
      </div>
      <div className="user" onClick={() => setDropdown(!dropdown)}>
        <div className="icon">
          <PersonIcon />
        </div>
        <div className="name">{det.name}</div>
        <div
          className="dropdown"
          style={{ display: dropdown ? "flex" : "none" }}
        >
          <div className="roles">
            <ul>
              {det.roles.map(r => (
                <li>{r}</li>
              ))}
            </ul>
            <div
              className="logout"
              onClick={() => {
                localStorage.clear()
                reloadAuth()
              }}
            >
              <LockClosedIcon />
              <span style={{ marginLeft: 5 }}>Log Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNav
