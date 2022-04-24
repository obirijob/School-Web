import { ClipboardCopyIcon, PlusIcon } from "@radix-ui/react-icons"
import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import LoadBE from "../Helpers/LoadBE"
import Search from "./Search"

function Subjects() {
  const [search, setSearch] = useState("")
  const [add, setAdd] = useState(false)
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    loadSubjects()
  }, [])

  async function loadSubjects() {
    const { data } = await LoadBE(`{subjects{code,label,compulsory,category}}`)
    if (data) {
      setSubjects(data.subjects)
    }
  }

  return (
    <div className="students">
      <div className="title">Subjects</div>
      <div className="options">
        <Search placeholder="Find Subject" setText={e => setSearch(e)} />
        <div className="option" onClick={() => setAdd(true)}>
          <PlusIcon />
          <span>Add Subject</span>
        </div>
      </div>
      <div className="list">
        {subjects
          .filter(
            s =>
              s.code.toString().includes(search) ||
              s.category.toLowerCase().includes(search) ||
              s.label.toLowerCase().includes(search)
          )
          .map(({ code, label, compulsory, category }) => (
            <NavLink
              exact
              to={`/Subjects/${code}`}
              className={`student ${compulsory ? "comp-sub" : "normal-sub"}`}
              key={code + "std"}
            >
              <div className="adm">{code.toString()}</div>
              <div className="photo">
                <ClipboardCopyIcon style={{ transform: "scale(2)" }} />
              </div>
              <div className="name">{label}</div>
              <div
                className="details"
                style={{
                  fontSize: "small",
                  textTransform: "capitalize",
                  marginTop: 5,
                }}
              >
                {category.toLowerCase()}
                {compulsory && " **compulsory**"}
              </div>
            </NavLink>
          ))}
      </div>
    </div>
  )
}

export default Subjects
