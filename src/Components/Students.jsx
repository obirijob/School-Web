import React, { useState, useEffect } from "react"
import Search from "./Search"
import LoadBE from "../Helpers/LoadBE"
import { DotFilledIcon, PlusIcon } from "@radix-ui/react-icons"
import Modal from "./Modal"
import Combo from "./Combo"
import { backendUrl } from "../Helpers/Constants"
import { NavLink } from "react-router-dom"

function Students() {
  const [students, setStudents] = useState([])
  const [waiting, setWaiting] = useState(false)
  const [add, setAdd] = useState(false)
  const [parents, setParents] = useState([])
  const [parentAdd, setParentAdd] = useState(null)
  const [nameAdd, setNameAdd] = useState("")
  const [addError, setAddError] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadStd()
    loadParents()
  }, [])

  async function loadParents() {
    let q = `{parents{
        name
        email
      }}`
    const { data } = await LoadBE(q)
    if (data) {
      setParents(data.parents)
    }
  }

  async function loadStd() {
    setWaiting(true)
    let q = `{students{
      name
      admissionNumber
      photo
      parent{
        name
        email
      }
    }}`
    let { data } = await LoadBE(q)
    setWaiting(false)
    if (data) setStudents(data.students)
  }
  return (
    <div className="students">
      <div className="title">Students</div>
      <div className="options">
        <Search placeholder="Find Student" setText={e => setSearch(e)} />
        <div className="option" onClick={() => setAdd(true)}>
          <PlusIcon />
          <span>Add Student</span>
        </div>
      </div>
      {waiting ? (
        <>
          <DotFilledIcon className="grow-anim" />
        </>
      ) : (
        <>
          <Modal title="Add Student" shown={add} hide={() => setAdd(false)}>
            <form
              onSubmit={async e => {
                e.preventDefault()
                setAddError(null)
                if (parentAdd) {
                  let { errors, data } = await LoadBE(`mutation{
                  addStudent(name: "${nameAdd}", parent: "${parentAdd.email}"){
                    admissionNumber
                  }
                }`)
                  if (errors) setAddError(errors)
                  else {
                    setParentAdd(null)
                    loadStd()
                    alert("Added")
                  }
                } else {
                  setAddError([{ message: "Please select Parent!" }])
                }
              }}
            >
              {addError && (
                <div className="error">
                  {addError.map(e => (
                    <span>{e.message}</span>
                  ))}
                </div>
              )}
              <div className="input">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  onInput={e => setNameAdd(e.target.value)}
                />
              </div>
              <div className="input">
                <label htmlFor="parent">Select Parent</label>
                <Combo
                  items={parents}
                  label="name"
                  sub="email"
                  setSelected={p => setParentAdd(p)}
                />
              </div>
              <button className="option">Add</button>
            </form>
          </Modal>
          <div className="list">
            {students
              .filter(
                s =>
                  s.admissionNumber.toString().includes(search) ||
                  s.name.toLowerCase().includes(search)
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
      )}
    </div>
  )
}

export default Students
