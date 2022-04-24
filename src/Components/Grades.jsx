import { Pencil2Icon } from "@radix-ui/react-icons"
import React, { useState, useEffect } from "react"
import LoadBE from "../Helpers/LoadBE"

function Grades() {
  const [errors, setErrors] = useState(null)
  const [grades, setGrades] = useState([])

  useEffect(() => {
    loadGrades()
  }, [])

  async function loadGrades() {
    let { errors, data } = await LoadBE(`{
            gradeLetters{
              low
              high
              letter
            }
          }`)
    if (errors) setErrors(errors)
    else {
      setGrades(data.gradeLetters)
    }
  }
  return (
    <div className="grading">
      <div className="title">Grading</div>
      {errors ? (
        <>
          {errors.map(({ message }) => (
            <>{message}</>
          ))}
        </>
      ) : (
        <table className="grades-table">
          <tr className="grades-title">
            <th>Grade</th>
            <th>Above</th>
            <th>To</th>
            <th>Options</th>
          </tr>
          {grades.map(({ letter, high, low }) => (
            <tr className="grades-row">
              <td className="letter">{letter}</td>
              <td className="low">{low}</td>
              <td className="high">{high}</td>
              <td>
                <button
                  className="option"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Pencil2Icon style={{ marginRight: 3 }} />
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  )
}

export default Grades
