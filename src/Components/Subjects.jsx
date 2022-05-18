import { ClipboardCopyIcon, PlusIcon } from "@radix-ui/react-icons"
import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import LoadBE from "../Helpers/LoadBE"
import Modal from "./Modal"
import Search from "./Search"

function Subjects() {
  const [search, setSearch] = useState("")
  const [add, setAdd] = useState(false)
  const [subjects, setSubjects] = useState([])
  const [compulsory, setCompulsory] = useState(false)
  const [category, setCategory] = useState("")
  const [label, setLabel] = useState("")

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
      <Modal shown={add} title="Add Subject" hide={() => setAdd(false)}>
        <form
          onSubmit={async e => {
            e.preventDefault()
            let { errors } = await LoadBE(`mutation{
              addSubject(label: "${label}", category: "${category}", compulsory: ${compulsory}){
                label
              }
            }`)
            if (errors) {
              console.log(errors)
              alert("Failed to Add Subject\n" + errors.toString())
            } else {
              loadSubjects()
              alert("Subject Added")
            }
          }}
        >
          <div className="input">
            <label htmlFor="slabel">Label</label>
            <input
              onInput={e => setLabel(e.target.value)}
              type="text"
              id="slabel"
              placeholder="e.g Mathematics"
              required
            />
          </div>
          <div className="input">
            <label htmlFor="scategory">Category</label>
            <select
              onChange={e => setCategory(e.target.value)}
              name=""
              id="scategory"
            >
              <option value="sciences">Sciences</option>
              <option value="humanities">Humanitites</option>
              <option value="languages">Languages</option>
              <option value="arts">Arts</option>
              <option value="technical">Technical Subjects</option>
            </select>
          </div>
          <div className="input">
            <label htmlFor="scompulsory">Compulsory?</label>
            <input
              onInput={e => setCompulsory(e.target.checked)}
              type="checkbox"
              name=""
              id="scompulsory"
            />
          </div>
          <button>Add Subject</button>
        </form>
      </Modal>
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
