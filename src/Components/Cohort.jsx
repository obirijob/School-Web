import { CalendarIcon } from "@radix-ui/react-icons"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import LoadBE from "../Helpers/LoadBE"
import { toDateString } from "../Helpers/Constants"

function Cohort() {
  let { id } = useParams()
  const [cohort, setCohort] = useState(null)
  useEffect(() => {
    loadCohort()
  }, [])
  async function loadCohort() {
    let { data } = await LoadBE(`{
        singleCohort(id: ${id}){
          id
          label
          term1Start
          term1End
          term2Start
          term2End
          term3Start
          term3End
          term1Fees
          term2Fees
          term3Fees
          classs{
            label
            level
          }
        }
      }`)

    if (data) setCohort(data.singleCohort)
  }

  return (
    <div className="students">
      {cohort && (
        <>
          <div className="title">{cohort.label}</div>
          <div
            className="coh-overview"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            <span
              style={{
                margin: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CalendarIcon /> &nbsp;{" "}
              {toDateString(cohort.term1Start, "ddd Do MMM YYYY")} to{" "}
              {toDateString(cohort.term3End, "ddd Do MMM YYYY")}
            </span>
            <span
              style={{
                fontWeight: "bolder",
                margin: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Ksh.{" "}
              {(
                cohort.term1Fees +
                cohort.term2Fees +
                cohort.term3Fees
              ).toLocaleString()}
              /=
            </span>
          </div>
          <div className="cohort-over">
            <div className="term">
              <div className="coh-title">Term One</div>
              <div className="coh-dates">
                <CalendarIcon />
                <span style={{ marginLeft: 5 }}>
                  {toDateString(cohort.term1Start, "ddd Do MMM YYYY")}
                </span>{" "}
                to{" "}
                <span>{toDateString(cohort.term1End, "ddd Do MMM YYYY")}</span>
              </div>
              <div className="coh-fees">
                Ksh. {cohort.term1Fees.toLocaleString()}/=
              </div>
            </div>
            <div className="term">
              <div className="coh-title">Term Two</div>
              <div className="coh-dates">
                <CalendarIcon />
                <span style={{ marginLeft: 5 }}>
                  {toDateString(cohort.term2Start, "ddd Do MMM YYYY")}
                </span>{" "}
                to{" "}
                <span>{toDateString(cohort.term2End, "ddd Do MMM YYYY")}</span>
              </div>
              <div className="coh-fees">
                Ksh. {cohort.term2Fees.toLocaleString()}/=
              </div>
            </div>
            <div className="term">
              <div className="coh-title">Term Three</div>
              <div className="coh-dates">
                <CalendarIcon />
                <span style={{ marginLeft: 5 }}>
                  {toDateString(cohort.term3Start, "ddd Do MMM YYYY")}
                </span>{" "}
                to{" "}
                <span>{toDateString(cohort.term3End, "ddd Do MMM YYYY")}</span>
              </div>
              <div className="coh-fees">
                Ksh. {cohort.term3Fees.toLocaleString()}/=
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cohort
