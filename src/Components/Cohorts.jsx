import React, { useState, useEffect } from "react"
import {
  FilePlusIcon,
  Pencil1Icon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"
import { NavLink } from "react-router-dom"
import Modal from "./Modal"
import LoadBE from "../Helpers/LoadBE"

function Cohorts() {
  const [cohorts, setCohorts] = useState([])
  const [showModal, setShowModal] = useState(false)

  const [cohLabel, setCohLabel] = useState("")
  const [cohLevel, setCohLevel] = useState(null)

  const [t1fee, setT1fee] = useState(0)
  const [t2fee, setT2fee] = useState(0)
  const [t3fee, setT3fee] = useState(0)

  const [t1start, setT1start] = useState(null)
  const [t2start, setT2start] = useState(null)
  const [t3start, setT3start] = useState(null)

  const [t1end, setT1end] = useState(null)
  const [t2end, setT2end] = useState(null)
  const [t3end, setT3end] = useState(null)

  useEffect(() => {
    loadCohorts()
  }, [])

  async function loadCohorts() {
    let { data } = await LoadBE(`{
        cohorts{
            id
            label
            classs{
                level
                label
            }
            term1Fees
            term2Fees
            term3Fees
            term1Start
            term2Start
            term3Start
            term1End
            term2End
            term3End
        }
    }`)
    if (data) {
      setCohorts(data.cohorts)
    }
  }

  return (
    <div className="students">
      <div className="title">Cohorts</div>
      <Modal
        shown={showModal}
        title="Add Cohorts"
        hide={() => setShowModal(false)}
      >
        <form
          onSubmit={async e => {
            e.preventDefault()
            let { errors } = await LoadBE(`mutation{
            addCohort(classLevel: ${cohLevel},label: "${cohLabel}", term1Fees: ${t1fee}, term2Fees: ${t2fee}, term3Fees: ${t3fee},
              term1Start: "${t1start}", term1End: "${t1end}", term2Start: "${t2start}", term2End: "${t2end}", term3Start: "${t3start}", term3End: "${t3end}"){
              id
            }
          }`)
            if (errors) {
              alert("Cohort not added\n" + errors[0].message.toString())
            } else {
              setCohLevel(null)
              setCohLabel(null)
              loadCohorts()
              alert("Cohort Added")
            }
          }}
        >
          <div style={{ maxHeight: 400, overflow: "scroll" }}>
            <div className="input">
              <label htmlFor="cohlabel">Label</label>
              <input
                type="text"
                id="cohlabel"
                defaultValue={cohLabel}
                onInput={e => setCohLabel(e.target.value)}
                placeholder={"e.g. Form One " + new Date().getFullYear()}
              />
            </div>
            <div className="input">
              <label htmlFor="cohlevel">Level</label>
              <select
                name=""
                id="cohlevel"
                defaultValue={cohLevel}
                onChange={e => setCohLevel(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="subtitle" style={{ margin: "14px 0" }}>
              Term One
            </div>
            <div className="input">
              <label htmlFor="term1start">Start Date</label>
              <input
                type="date"
                name=""
                id="term1start"
                defaultValue={t1start}
                onChange={e => setT1start(e.target.value)}
              />
            </div>
            <div className="input">
              <label htmlFor="term1end">End Date</label>
              <input
                type="date"
                name=""
                id="term1end"
                defaultValue={t1end}
                onChange={e => setT1end(e.target.value)}
              />
            </div>
            <div className="input">
              <label htmlFor="term1fee">Fees Amount</label>
              <input
                type="number"
                name=""
                id="term1Fee"
                defaultValue={t1fee}
                onChange={e => setT1fee(e.target.value)}
              />
            </div>
            <div className="subtitle" style={{ margin: "14px 0" }}>
              Term Two
            </div>
            <div className="input">
              <label htmlFor="term2start">Start Date</label>
              <input
                type="date"
                name=""
                id="term2start"
                defaultValue={t2start}
                onChange={e => setT2start(e.target.value)}
              />
            </div>
            <div className="input">
              <label htmlFor="term2end">End Date</label>
              <input
                type="date"
                name=""
                id="term2end"
                defaultValue={t2end}
                onChange={e => setT2end(e.target.value)}
              />
            </div>
            <div className="input">
              <label htmlFor="term2fee">Fees Amount</label>
              <input
                type="number"
                name=""
                id="term2Fee"
                defaultValue={t2fee}
                onChange={e => setT2fee(e.target.value)}
              />
            </div>
            <div className="subtitle" style={{ margin: "14px 0" }}>
              Term Three
            </div>
            <div className="input">
              <label htmlFor="term3start">Start Date</label>
              <input
                type="date"
                name=""
                id="term3start"
                defaultValue={t3start}
                onChange={e => setT3start(e.target.value)}
              />
            </div>
            <div className="input">
              <label htmlFor="term3end">End Date</label>
              <input
                type="date"
                name=""
                id="term3end"
                defaultValue={t3end}
                onChange={e => setT3end(e.target.value)}
              />
            </div>
            <div className="input">
              <label htmlFor="term3fee">Fees Amount</label>
              <input
                type="number"
                name=""
                id="term3Fee"
                defaultValue={t3fee}
                onChange={e => setT3fee(e.target.value)}
              />
            </div>
          </div>
          <button className="">
            <div
              className="option"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FilePlusIcon style={{ marginRight: 5 }} />
              Save Cohort
            </div>
          </button>
        </form>
      </Modal>
      <div
        className="options"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          className="option"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowModal(true)}
        >
          <PlusCircledIcon style={{ marginRight: 5 }} />
          Add
        </button>
      </div>
      <div className="list">
        {cohorts.map(c => (
          <NavLink
            exact
            to={`/cohort/${c.id}`}
            className="student"
            key={c.id + "cohstd"}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pencil1Icon style={{ transform: "scale(4)", margin: 20 }} />
            <div className="name">{c.label}</div>
            <div
              className="details"
              style={{
                marginTop: 5,
                fontSize: "small",
                textTransform: "capitalize",
              }}
            >
              {c.classs.label}
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Cohorts
