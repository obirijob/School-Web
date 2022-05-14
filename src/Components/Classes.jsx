import React, { useEffect, useState } from "react"
import LoadBE from "../Helpers/LoadBE"
import Search from "./Search"
import { HomeIcon, PlusIcon } from "@radix-ui/react-icons"
import Modal from "./Modal"
import { NavLink } from "react-router-dom"

function Classes() {
  useEffect(() => {
    loadClasses()
  }, [])
  const [classes, setClasses] = useState([])
  const [search, setSearch] = useState("")
  const [add, setAdd] = useState(false)
  const [label, setLabel] = useState("")
  const [level, setLevel] = useState(1)

  async function loadClasses() {
    let { errors, data } = await LoadBE(`{
        classes{
            label
            level
            students{
                admissionNumber
                name
            }
        }
    }`)
    if (errors) {
    } else {
      setClasses(data.classes)
    }
  }

  return (
    <div className="students">
      <div className="title">Classes</div>
      <div className="options">
        <Search placeholder="Find Class" setText={e => setSearch(e)} />
        <div className="option" onClick={() => setAdd(true)}>
          <PlusIcon />
          <span>Add a Class</span>
        </div>
      </div>
      <Modal title="Add a Class" shown={add} hide={() => setAdd(false)}>
        <form
          onSubmit={async e => {
            e.preventDefault()
            let { errors } = await LoadBE(`mutation{
              addClass(label: "${label}", level: ${level}){
                label
              }
            }`)
            if (errors) alert("Failed to add Class\n" + errors.toString())
            else {
              loadClasses()
              alert("Class Added")
            }
          }}
        >
          <div className="input">
            <label htmlFor="clabel">Label</label>
            <input
              type="text"
              id="clabel"
              placeholder="e.g. Form One"
              required
              onInput={e => setLabel(e.target.value)}
            />
          </div>
          <div className="input">
            <label htmlFor="clevel">Level</label>
            <select
              onChange={e => setLevel(e.target.value)}
              name=""
              id="clevel"
              placeholder="e.g. 2"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <button>Save Class</button>
        </form>
      </Modal>
      <div className="list">
        {classes
          .filter(
            ({ level, label }) =>
              level.toString().includes(search) ||
              label.toLowerCase().includes(search)
          )
          .map(({ level, label, students }) => (
            <NavLink exact to={"/classes/" + level} className="student">
              <div className="adm">{level}</div>
              <HomeIcon
                style={{
                  transform: "scale(4)",
                  margin: 20,
                  alignSelf: "center",
                  justifySelf: "center",
                }}
              />
              <div
                className="name"
                style={{ alignSelf: "center", justifySelf: "center" }}
              >
                {label}
              </div>
              <div
                className="details"
                title={students.map(s => ` ${s.name.toUpperCase()}`)}
                style={{
                  fontSize: "small",
                  alignSelf: "center",
                  justifySelf: "center",
                }}
              >
                {students.length.toLocaleString()} Students
              </div>
            </NavLink>
          ))}
      </div>
    </div>
  )
}

export default Classes
