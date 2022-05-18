import React, { useState, useEffect } from "react"
import { NavLink, useParams } from "react-router-dom"
import { backendUrl } from "../Helpers/Constants"
import LoadBE from "../Helpers/LoadBE"
import Search from "./Search"

function SClass() {
  const { level } = useParams()
  useEffect(() => {
    loadClass()
  }, [])

  const [cls, setCls] = useState(null)
  const [stdSearch, setStdSearch] = useState("")

  async function loadClass() {
    let { data } = await LoadBE(`{
          singleClass(level: ${level}){
            label
            level
            students{
              name
              admissionNumber
              photo
              parent{
                name
                phone
              }
            }
          }
      }`)
    setCls(data.singleClass)
  }

  return (
    <div className="students">
      {cls &&
        (cls.students.length > 0 ? (
          <>
            <div className="title" style={{ textTransform: "capitalize" }}>
              {cls.label}
            </div>
            <div className="options">
              <Search
                placeholder="Find Student"
                setText={e => setStdSearch(e)}
              />
            </div>
            <div className="list">
              {cls.students
                .filter(
                  s =>
                    s.admissionNumber.toString().includes(stdSearch) ||
                    s.name.toLowerCase().includes(stdSearch)
                )
                .map(({ admissionNumber, name, photo, parent }) => (
                  <NavLink
                    exact
                    to={`/Students/${admissionNumber}`}
                    className="student"
                    key={admissionNumber + "std"}
                  >
                    <div className="adm">
                      {admissionNumber.toString().padStart("4", 0)}
                    </div>
                    <div className="photo">
                      <img src={`${backendUrl}${photo}`} alt="" srcset="" />
                    </div>
                    <div className="name">{name}</div>
                    <div
                      className="details"
                      style={{ fontSize: "small", textTransform: "capitalize" }}
                    >
                      {parent.name.toLowerCase()}
                    </div>
                  </NavLink>
                ))}
            </div>
          </>
        ) : (
          <div style={{ padding: 20 }}>No Student Registered in this Class</div>
        ))}
    </div>
  )
}

export default SClass
