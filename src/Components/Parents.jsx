import React, { useState, useEffect } from "react"
import Search from "./Search"
import LoadBE from "../Helpers/LoadBE"
import { DotFilledIcon, PlusIcon } from "@radix-ui/react-icons"
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
        <Search placeholder="Find a Parent" />
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
            {students.map(({ email, name }) => (
              <div className="student" key={email + "parent"}>
                <div className="name">{name}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Parents
