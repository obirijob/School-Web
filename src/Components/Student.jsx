import React, { useState, useEffect } from "react"
import { NavLink, useParams } from "react-router-dom"
import { backendUrl } from "../Helpers/Constants"
import LoadBE from "../Helpers/LoadBE"
import Modal from "./Modal"
import {
  CameraIcon,
  CrossCircledIcon,
  HomeIcon,
  LinkedInLogoIcon,
  MobileIcon,
  PersonIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

function Student() {
  const { adm } = useParams()
  useEffect(() => {
    loadEverything()
  }, [])

  async function loadEverything() {
    loadStudent()
    myClass()
    classes()
    loadCSubjects()
    loadCohorts()
  }

  const [student, setStudent] = useState(null)
  const [mclass, setMclass] = useState(null)
  const [assign, setAssign] = useState(false)
  const [cls, setCls] = useState([])
  const [level, setLevel] = useState(null)
  const [compsubjects, setCompsubjects] = useState([])
  const [subj, setSubj] = useState([])
  const [showCohort, setShowCohort] = useState(false)
  const [cohorts, setCohorts] = useState([])
  const [selCohort, setSelCohort] = useState(null)

  async function loadCohorts() {
    let { data } = await LoadBE(`{
        cohorts{
            id
            label
        }
    }`)
    if (data) {
      setCohorts(data.cohorts)
    }
  }

  async function loadStudent() {
    let { errors, data } = await LoadBE(`{
          singleStudent(admissionNumber: ${adm}){
              name
              admissionNumber
              photo
              subjects{
                label
                code
                compulsory
              }
              parent{
                  name
                  phone
                  email
                  students{
                    name
                    admissionNumber
                  }
              }
              cohorts{
                label
                id
              }
          }
      }`)
    if (errors) {
    } else {
      setStudent(data.singleStudent)
    }
  }

  async function loadCSubjects() {
    let { errors, data } = await LoadBE(`{
      compulsorySubjects{
        label
        code
        compulsory
      }
    }`)
    if (errors) {
    } else {
      setCompsubjects(data.compulsorySubjects)
    }

    let s = await LoadBE(`{
        subjects{
          label
          code
          compulsory
        }
      }`)
    if (s.errors) {
    } else {
      setSubj(s.data.subjects)
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
          <Modal
            title="Add to Cohort"
            shown={showCohort}
            hide={() => setShowCohort(false)}
          >
            <form
              onSubmit={e => {
                e.preventDefault()
              }}
            >
              <div className="input">
                <label htmlFor="acoh">Select Cohort</label>
                <select
                  name=""
                  id="acoh"
                  onChange={e => setSelCohort(e.target.value)}
                >
                  <option value="">Select cohort...</option>
                  {cohorts.map(c => (
                    <option value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="options">
                <button
                  onClick={async () => {
                    let { errors, data } = await LoadBE(`mutation{
                    registerStudentInCohort(cohort: ${selCohort}, student: ${adm}){
                      name
                      cohorts{
                        label
                      }
                    }
                  }`)
                    if (errors)
                      alert(
                        `Failed to register student\n${errors.map(
                          e => e.message
                        )}`
                      )
                    if (data) {
                      let { name, cohorts } = data.registerStudentInCohort
                      alert(
                        `${name.toUpperCase()} has been successfuly Added to Cohort.\nCurrent registered cohorts are: \n${cohorts.map(
                          c => c.label
                        )}`
                      )
                    }
                  }}
                  className="option"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PlusCircledIcon style={{ marginRight: 5 }} />
                  Add to Cohort
                </button>
              </div>
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

              <div className="options" style={{ display: "flex" }}>
                <button className="option" onClick={() => setAssign(true)}>
                  Assign Class
                </button>
                <button
                  className="option"
                  style={{ margin: "0 5px" }}
                  onClick={() => setShowCohort(true)}
                >
                  Add to Cohort
                </button>
                <NavLink to="performance" className="option">
                  <button>Performance Report</button>
                </NavLink>
              </div>
              <div className="subtitle" style={{ margin: "20px 0 10px 0" }}>
                Subjects Taken ({[...compsubjects, ...student.subjects].length})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {[...compsubjects, ...student.subjects].map((s, i) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: 5,
                    }}
                  >
                    <span className="std-ss">
                      <NavLink
                        to={`/Subjects/${s.code}`}
                        className="st-sub-item"
                      >
                        {s.label}
                      </NavLink>
                      <div
                        className="ds"
                        onClick={async () => {
                          //console.log(s)
                          if (s.compulsory) {
                            alert(
                              s.label.toUpperCase() +
                                " is compulsory\n" +
                                "You cannot remove a compulsory subject"
                            )
                          } else {
                            let { errors, data } = await LoadBE(
                              `mutation{studentRemoveSubject(admissionNumber: ${adm}, subject: "${s.code}"){label}}`
                            )
                            if (errors) {
                              alert(
                                `Failed to remove subject\n${errors.map(
                                  e => e.message
                                )}`
                              )
                            } else {
                              alert("Subject Removed")
                              loadEverything()
                            }
                          }
                        }}
                      >
                        <CrossCircledIcon
                          style={{
                            marginRight: 2,
                            marginLeft: 1,
                          }}
                        />
                      </div>
                    </span>
                    {i < [...compsubjects, ...student.subjects].length - 1 &&
                      (i ===
                      [...compsubjects, ...student.subjects].length - 2 ? (
                        <div style={{ margin: "0 3px" }}>&</div>
                      ) : (
                        `, `
                      ))}
                  </div>
                ))}
              </div>

              <div className="subtitle" style={{ margin: "20px 0 10px 0" }}>
                Other Subjects (
                {
                  [
                    ...subj.filter(
                      s =>
                        ![...compsubjects, ...student.subjects]
                          .map(st => st.code)
                          .includes(s.code)
                    ),
                  ].length
                }
                )
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {[
                  ...subj.filter(
                    s =>
                      ![...compsubjects, ...student.subjects]
                        .map(st => st.code)
                        .includes(s.code)
                  ),
                ].map((s, i) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: 5,
                    }}
                  >
                    <span className="std-ss">
                      <NavLink
                        to={`/Subjects/${s.code}`}
                        className="st-sub-item"
                      >
                        {s.label}
                      </NavLink>
                      <div
                        className="ds -s"
                        onClick={async () => {
                          //console.log(s)
                          let { errors, data } = await LoadBE(
                            `mutation{studentAddSubject(admissionNumber: ${adm}, subject: "${s.code}"){label}}`
                          )
                          if (errors) {
                            alert("Subject not Added")
                          } else {
                            loadEverything()
                            alert("Subject Added")
                          }
                        }}
                      >
                        <PlusCircledIcon
                          style={{
                            marginRight: 2,
                            marginLeft: 1,
                          }}
                        />
                      </div>
                    </span>
                    {i <
                      [
                        ...subj.filter(
                          s =>
                            ![...compsubjects, ...student.subjects]
                              .map(st => st.code)
                              .includes(s.code)
                        ),
                      ].length -
                        1 &&
                      (i ===
                      [
                        ...subj.filter(
                          s =>
                            ![...compsubjects, ...student.subjects]
                              .map(st => st.code)
                              .includes(s.code)
                        ),
                      ].length -
                        2 ? (
                        <div style={{ margin: "0 3px" }}>&</div>
                      ) : (
                        `, `
                      ))}
                  </div>
                ))}
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
