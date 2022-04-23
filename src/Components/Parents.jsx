import React, { useState, useEffect } from "react"
import Search from "./Search"
import LoadBE from "../Helpers/LoadBE"
import { DotFilledIcon, PersonIcon, PlusIcon } from "@radix-ui/react-icons"
import Modal from "./Modal"

function Parents() {
  const [students, setStudents] = useState([])
  const [waiting, setWaiting] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [isMale, setIsMale] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  useEffect(() => {
    loadStd()
  }, [])

  async function loadStd() {
    setWaiting(true)
    let q = `{parents{
      name
      email
      phone
      students{
        name
        admissionNumber
      }
    }}`
    let { data } = await LoadBE(q)
    setWaiting(false)
    if (data) setStudents(data.parents)
  }
  return (
    <div className="students">
      <div className="title">Parents</div>
      <div className="options">
        <Search placeholder="Find a Parent" setText={s => setSearch(s)} />
        <div className="option" onClick={() => setAddModal(true)}>
          <PlusIcon />
          <span>Add Parent</span>
        </div>
      </div>
      {waiting ? (
        <>
          <DotFilledIcon className="grow-anim" />
        </>
      ) : (
        <>
          <Modal
            shown={addModal}
            title="Add Parent"
            hide={() => setAddModal(false)}
          >
            <form
              onSubmit={async e => {
                e.preventDefault()
                setError(null)
                let { errors, data } = await LoadBE(`mutation{
                  addParent(name:"${name}", phone: ${phone}, email: "${email}", male: ${isMale}){
                    name
                  }
                }`)
                if (errors) {
                  setError(errors)
                } else {
                  loadStd()
                  alert(
                    `${data.addParent.name.toUpperCase()} successfuly added to the system`
                  )
                }
              }}
            >
              {error && (
                <div className="error">
                  {error.map(e => (
                    <span>{e.message}</span>
                  ))}
                </div>
              )}
              <div className="input">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  onInput={e => setName(e.target.value)}
                />
              </div>
              <div className="input">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  onInput={e => setPhone(e.target.value)}
                />
              </div>
              <div className="input">
                <label htmlFor="email">Email Address</label>
                <input
                  type="text"
                  id="email"
                  onInput={e => setEmail(e.target.value)}
                />
              </div>
              <div className="input">
                <label htmlFor="isMale">Is Male?</label>
                <input
                  type="checkbox"
                  defaultChecked={isMale}
                  onInput={e => setIsMale(e.target.checked)}
                />
              </div>
              <button className="option">Add</button>
            </form>
          </Modal>
          <div className="list">
            {students
              .filter(
                ({ email, name, students, phone }) =>
                  name.toLowerCase().includes(search) ||
                  email.toLowerCase().includes(search) ||
                  phone.toString().includes(search)
              )
              .map(({ email, name, students, phone }) => (
                <div
                  className="student"
                  key={email + "parent"}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonIcon style={{ transform: "scale(4)", margin: 20 }} />
                  <div className="name">{name}</div>
                  <div
                    title={students.map(({ name }) => name.toUpperCase())}
                    className="details"
                    style={{ marginTop: 5, fontSize: "small" }}
                  >
                    {`${students.length.toLocaleString()} Students`}
                  </div>
                  <div style={{ fontSize: "small" }}>
                    <li>
                      <a href={`mailto://${email}`}>{email}</a>
                    </li>
                    <li>
                      <a href={`tel://${phone}`}>{phone}</a>
                    </li>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Parents
