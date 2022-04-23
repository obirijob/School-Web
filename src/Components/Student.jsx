import React, { useState, useEffect } from "react"
import { NavLink, useParams } from "react-router-dom"
import { backendUrl } from "../Helpers/Constants"
import LoadBE from "../Helpers/LoadBE"
import Modal from "./Modal"
import {
  CameraIcon,
  HomeIcon,
  LinkedInLogoIcon,
  MobileIcon,
  PersonIcon,
} from "@radix-ui/react-icons"

function Student() {
  const { adm } = useParams()
  useEffect(() => {
    loadStudent()
    myClass()
    classes()
  }, [])

  const [student, setStudent] = useState(null)
  const [mclass, setMclass] = useState(null)
  const [assign, setAssign] = useState(false)
  const [cls, setCls] = useState([])
  const [level, setLevel] = useState(null)

  async function loadStudent() {
    let { errors, data } = await LoadBE(`{
          singleStudent(admissionNumber: ${adm}){
              name
              admissionNumber
              photo
              parent{
                  name
                  phone
                  email
                  students{
                    name
                    admissionNumber
                  }
              }
          }
      }`)
    if (errors) {
    } else {
      setStudent(data.singleStudent)
    }
  }

  async function myClass() {
    let { errors, data } = await LoadBE(`{
      myClass(admissionNumber: ${adm}){
        level
        label
        students{
          admissionNumber
          name
        }
      }
    }`)
    if (errors) {
    } else {
      setMclass(data.myClass)
    }
  }

  async function classes() {
    let { data } = await LoadBE(`{
      classes{
        label
        level
        students{
          admissionNumber
          name
        }
      }
    }`)
    if (data) setCls(data.classes)
  }

  return (
    <div className="student">
      <div style={{ margin: "5px 0" }}>Student Information</div>
      {student ? (
        <>
          <Modal
            title="Assign Class"
            shown={assign}
            hide={() => setAssign(false)}
          >
            <form
              onSubmit={async e => {
                e.preventDefault()
                let { errors, data } = await LoadBE(`mutation{
                  assignStudentToClass(admissionNumber: ${adm}, level: ${level}){
                    label
                  }
                }`)
                if (errors)
                  alert(
                    `Failed to Assign to Class\n\nDETAILS\n${errors.map(
                      e => e.message
                    )}`
                  )
                else {
                  alert("Successfully Assigned")
                  loadStudent()
                  myClass()
                  classes()
                  setAssign(false)
                }
              }}
            >
              <div className="input">
                <label htmlFor="clsss">Select Class</label>
                <select onInput={e => setLevel(e.target.value)}>
                  <option value={null}>Select a Class...</option>
                  {cls.map(c => (
                    <option value={c.level}>
                      {c.label.toUpperCase()}{" "}
                      <b>
                        <i>({c.students.length.toLocaleString()} Students)</i>
                      </b>
                    </option>
                  ))}
                </select>
              </div>
              <button>Assign</button>
            </form>
          </Modal>
          <div className="title" style={{ textTransform: "capitalize" }}>
            {student.name.toLowerCase()} -{" "}
            {student.admissionNumber.toString().padStart(4, 0)}
          </div>
          <div className="std">
            <div className="photo-d" style={{ position: "relative" }}>
              <img src={`${backendUrl}${student.photo}`} alt="" />
              <label className="std_photo" htmlFor="std_photo">
                <CameraIcon style={{ transform: "scale(1.5)" }} />
              </label>
              <input
                style={{ display: "none" }}
                type="file"
                name=""
                id="std_photo"
                accept="image/*"
              />
            </div>

            <div className="class-d">
              <div className="subtitle">Class Details</div>
              {mclass ? (
                <>
                  <div
                    className="cls-name"
                    style={{ margin: "5px 10px", textTransform: "capitalize" }}
                  >
                    <HomeIcon style={{ marginRight: 10 }} />
                    {mclass.label}
                  </div>
                  <div
                    className="cls-name"
                    style={{ margin: "5px 10px" }}
                    title={mclass.students
                      .filter(s => s.admissionNumber != adm)
                      .map(s => " " + s.name.toUpperCase())}
                  >
                    <PersonIcon style={{ marginRight: 10 }} />
                    {(mclass.students.length - 1).toLocaleString()} others
                  </div>
                </>
              ) : (
                <>Not in Any Class</>
              )}
              <div className="options">
                <button className="option" onClick={() => setAssign(true)}>
                  Assign Class
                </button>
              </div>
            </div>

            <div className="parent-d">
              <div className="subtitle">Parent Details</div>
              <div className="par-name">
                <PersonIcon />
                {student.parent.name}
              </div>
              <div className="par-name">
                <LinkedInLogoIcon />
                {student.parent.email}
              </div>
              <div className="par-name">
                <MobileIcon />
                {student.parent.phone}
              </div>
              <div className="subtitle" style={{ marginTop: 20 }}>
                Siblings
              </div>
              {student.parent.students.length > 1 ? (
                <ul>
                  {student.parent.students
                    .filter(s => s.admissionNumber !== student.admissionNumber)
                    .map(s => (
                      <li
                        style={{ margin: "5px 0", textTransform: "capitalize" }}
                      >
                        <a href={`/students/${s.admissionNumber}`}>
                          {s.name} - {s.admissionNumber}
                        </a>
                      </li>
                    ))}
                </ul>
              ) : (
                <>No Siblings</>
              )}
            </div>
          </div>
        </>
      ) : (
        <>...</>
      )}
    </div>
  )
}

export default Student
