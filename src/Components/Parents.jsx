import React, { useState, useEffect } from "react"
import Search from "./Search"
import LoadBE from "../Helpers/LoadBE"
import { DotFilledIcon, PlusIcon } from "@radix-ui/react-icons"

function Parents() {
  const [students, setStudents] = useState([])
  const [waiting, setWaiting] = useState(false)
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
        <div className="option">
          <PlusIcon />
          <span>Add Parent</span>
        </div>
      </div>
      {waiting ? (
        <>
          <DotFilledIcon className="grow-anim" />
        </>
      ) : (
        <div className="list">
          {students.map(({ email, name }) => (
            <div className="student" key={email + "parent"}>
              <div className="name">{name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Parents
