import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import LoadBE from "../Helpers/LoadBE"
import Modal from "./Modal"

function StudentPerformance() {
  let { adm } = useParams()
  const [student, setStudent] = useState(null)
  const [performance, setPerformance] = useState(null)
  const [edit, setEdit] = useState(false)

  const [t1cat, setT1cat] = useState(0)
  const [t2cat, setT2cat] = useState(0)
  const [t3cat, setT3cat] = useState(0)

  const [t1exam, setT1exam] = useState(0)
  const [t2exam, setT2exam] = useState(0)
  const [t3exam, setT3exam] = useState(0)

  const [cohMarks, setCohMarks] = useState(null)

  const [csub, setCsub] = useState("")
  const [csubc, setCsubc] = useState("")
  const [cstd, setCstd] = useState(0)
  const [ccoh, setCcoh] = useState(0)

  useEffect(() => {
    loadStudent()
    loadPerformance()
  }, [])

  async function loadPerformance() {
    let { errors, data } = await LoadBE(`{
      studentMarks(student: ${adm}){
        student{
          name
        }
        cohortMarks{
          cohort{
            label
            id
          }
          marks{
            subject{
              label
              code
            }
            term1catScore
            term1examScore
            term1Grade
            term2catScore
            term2examScore
            term2Grade
            term3catScore
            term3examScore
            term3Grade
          }
        }
      }
    }`)
    if (errors) {
    } else {
      setPerformance(data.studentMarks)
      let cohms = []
      for (let c of data.studentMarks.cohortMarks) {
        let term1 = 0
        let term2 = 0
        let term3 = 0
        let outOf = 0
        for (let m of c.marks) {
          term1 += m.term1catScore + m.term1examScore
          term2 += m.term2catScore + m.term2examScore
          term3 += m.term3catScore + m.term3examScore
          outOf += 100
        }
        cohms.push({ cohort: c.cohort.id, term1, term2, term3, outOf })
      }

      setCohMarks(cohms)
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
  return (
    <div className="student">
      <Modal title="Update Mark" shown={edit} hide={() => setEdit(false)}>
        <form
          onSubmit={async e => {
            e.preventDefault()
            let { errors, data } = await LoadBE(`mutation{
              editMark(subject: "${csubc}", student: ${cstd}, cohort:${ccoh}, 
                term1catScore: ${t1cat}, term1examScore:${t1exam}, term2catScore: ${t2cat}, 
                term2examScore: ${t2exam}, term3catScore:${t3cat}, term3examScore:${t3exam}){
                subject{
                  label
                }
              }
            }`)
            if (errors) {
              alert(`Mark not updated\m${errors[0].message}`)
            } else {
              alert("Marks Updated")
              await loadStudent()
              await loadPerformance()
              setEdit(false)
            }
          }}
        >
          <div style={{ textTransform: "capitalize" }}>{csub}</div>
          <div className="input">
            <label htmlFor="t1cat">Term One CAT</label>
            <input
              type="number"
              value={t1cat}
              onInput={e => setT1cat(e.target.value)}
            />
          </div>
          <div className="input">
            <label htmlFor="t1cat">Term One Exam</label>
            <input
              type="number"
              value={t1exam}
              onInput={e => setT1exam(e.target.value)}
            />
          </div>
          <hr />
          <div className="input">
            <label htmlFor="t1cat">Term Two CAT</label>
            <input
              type="number"
              value={t2cat}
              onInput={e => setT2cat(e.target.value)}
            />
          </div>
          <div className="input">
            <label htmlFor="t1cat">Term Two Exam</label>
            <input
              type="number"
              value={t2exam}
              onInput={e => setT2exam(e.target.value)}
            />
          </div>
          <hr />
          <div className="input">
            <label htmlFor="t1cat">Term Three CAT</label>
            <input
              type="number"
              value={t3cat}
              onInput={e => setT3cat(e.target.value)}
            />
          </div>
          <div className="input">
            <label htmlFor="t3cat">Term Three Exam</label>
            <input
              type="number"
              value={t3exam}
              onInput={e => setT3exam(e.target.value)}
            />
          </div>
          <div className="options">
            <button>Update Marks</button>
          </div>
        </form>
      </Modal>
      {student && (
        <>
          <div style={{ margin: "5px 0" }}>Student Performance</div>
          {/*<div className="title" style={{ textTransform: "capitalize" }}>
            {student.name.toLowerCase()} -{" "}
            {student.admissionNumber.toString().padStart(4, 0)}
          </div>
           <div
            className="input"
            style={{ margin: 10, display: "flex", alignItems: "center" }}
          >
            <label htmlFor="cohort" style={{ marginRight: 5 }}>
              Select Year of Study
            </label>
            <select
              name=""
              id="cohort"
              onChange={e => {
                loadPerformance(e.target.value)
              }}
            >
              <option value={0}>Select Year</option>
              {student.cohorts.map(c => (
                <option value={c.id}>{c.label}</option>
              ))}
            </select>
          </div> */}
          <div className="res">
            {performance ? (
              performance.cohortMarks.map(p => (
                <div className="results">
                  <div
                    className="title"
                    style={{ textTransform: "capitalize" }}
                  >
                    {performance.student.name}
                  </div>
                  <div
                    className="year"
                    style={{ fontSize: 20, marginBottom: 10 }}
                  >
                    {p.cohort.label}
                  </div>
                  {
                    <div style={{ overflow: "hidden", borderRadius: 5 }}>
                      <table
                        cellSpacing={0}
                        style={{ border: "solid 2px black", borderRadius: 5 }}
                      >
                        <tr
                          className="title-row"
                          style={{ background: "black", color: "white" }}
                        >
                          <td rowSpan={2}>Subject</td>
                          <td rowSpan={2}>Code</td>
                          <td colSpan={4}>Term One</td>
                          <td colSpan={4}>Term Two</td>
                          <td colSpan={4}>Term Three</td>
                        </tr>
                        <tr
                          className="title-row"
                          style={{ background: "black", color: "white" }}
                        >
                          <td>CAT</td>
                          <td>Exam</td>
                          <td>Total</td>
                          <td>Grade</td>

                          <td>CAT</td>
                          <td>Exam</td>
                          <td>Total</td>
                          <td>Grade</td>

                          <td>CAT</td>
                          <td>Exam</td>
                          <td>Total</td>
                          <td>Grade</td>
                        </tr>
                        {p.marks.map(m => (
                          <tr>
                            <td
                              onClick={async () => {
                                setCsubc(m.subject.code)
                                setCstd(adm)
                                setCcoh(p.cohort.id)
                                let { errors, data } = await LoadBE(`{
                                  studentSubjectCohortMarks(subject: "${m.subject.code}", student: ${adm}, cohort:${p.cohort.id}){
                                    subject{
                                      label
                                    }
                                    term1catScore
                                    term1examScore
                                    term2catScore
                                    term2examScore
                                    term3catScore
                                    term3examScore
                                  }
                                }`)
                                if (errors) {
                                } else {
                                  let scores = data.studentSubjectCohortMarks
                                  if (scores.length < 1) {
                                    setT1cat(0)
                                    setT2cat(0)
                                    setT3cat(0)
                                    setT1exam(0)
                                    setT2exam(0)
                                    setT3exam(0)
                                  } else {
                                    let {
                                      term1catScore,
                                      term1examScore,
                                      term2catScore,
                                      term2examScore,
                                      term3catScore,
                                      term3examScore,
                                    } = scores[0]
                                    setT1cat(term1catScore)
                                    setT2cat(term2catScore)
                                    setT3cat(term3catScore)
                                    setT1exam(term1examScore)
                                    setT2exam(term2examScore)
                                    setT3exam(term3examScore)
                                  }
                                  setCsub(m.subject.label)
                                  setEdit(true)
                                }
                              }}
                              style={{
                                textTransform: "uppercase",
                                fontWeight: "bolder",
                                cursor: "pointer",
                              }}
                            >
                              {m.subject.label}
                            </td>
                            <td style={{ textTransform: "uppercase" }}>
                              {m.subject.code}
                            </td>
                            <td style={{ borderLeft: "2px solid black" }}>
                              {m.term1catScore}
                            </td>
                            <td>{m.term1examScore}</td>
                            <td>{m.term1examScore + m.term1catScore}</td>
                            <td>{m.term1Grade}</td>
                            <td style={{ borderLeft: "2px solid black" }}>
                              {m.term2catScore}
                            </td>
                            <td>{m.term2examScore}</td>
                            <td>{m.term2examScore + m.term2catScore}</td>
                            <td>{m.term2Grade}</td>
                            <td style={{ borderLeft: "2px solid black" }}>
                              {m.term3catScore}
                            </td>
                            <td>{m.term3examScore}</td>
                            <td>{m.term3examScore + m.term3catScore}</td>
                            <td>{m.term3Grade}</td>
                          </tr>
                        ))}
                        <tr style={{ background: "black", color: "white" }}>
                          <td
                            colSpan={2}
                            style={{ fontWeight: "bolder", textAlign: "right" }}
                          >
                            TOTAL
                          </td>
                          <td colSpan={4} style={{ textAlign: "center" }}>
                            {
                              cohMarks.filter(c => c.cohort === p.cohort.id)[0]
                                .term1
                            }{" "}
                            out of{" "}
                            {
                              cohMarks.filter(c => c.cohort === p.cohort.id)[0]
                                .outOf
                            }
                          </td>
                          <td colSpan={4} style={{ textAlign: "center" }}>
                            {
                              cohMarks.filter(c => c.cohort === p.cohort.id)[0]
                                .term2
                            }{" "}
                            out of{" "}
                            {
                              cohMarks.filter(c => c.cohort === p.cohort.id)[0]
                                .outOf
                            }
                          </td>
                          <td colSpan={4} style={{ textAlign: "center" }}>
                            {
                              cohMarks.filter(c => c.cohort === p.cohort.id)[0]
                                .term3
                            }{" "}
                            out of{" "}
                            {
                              cohMarks.filter(c => c.cohort === p.cohort.id)[0]
                                .outOf
                            }
                          </td>
                        </tr>
                      </table>
                    </div>
                  }
                </div>
              ))
            ) : (
              <div>N?A</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default StudentPerformance
