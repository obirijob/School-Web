import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import LoadBE from "../Helpers/LoadBE"

function StudentPerformance() {
  let { adm } = useParams()
  const [student, setStudent] = useState(null)
  const [performance, setPerformance] = useState(null)
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
                              style={{
                                textTransform: "uppercase",
                                fontWeight: "bolder",
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
