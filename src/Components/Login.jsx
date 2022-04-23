import React, { useState } from "react"
import {
  PersonIcon,
  LockClosedIcon,
  DotFilledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons"
import LoadBE from "../Helpers/LoadBE"

function Login({ reloadAuth }) {
  const [par, setPar] = useState(true)
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function signIn(e) {
    e.preventDefault()
    setError(null)
    setWaiting(true)
    let q = `{${
      par ? "parentLogin" : "logIn"
    }(email: "${email}", password: "${password}"){
            authToken
        }
    }`
    let { errors, data } = await LoadBE(q)
    setWaiting(false)
    if (errors) {
      setError({ message: errors.map((e) => e.message) })
    } else if (data) {
      let token = par ? data.parentLogin.authToken : data.logIn.authToken
      localStorage.setItem("auth-token", token)
      reloadAuth()
    }
  }

  return (
    <div className="login">
      <div className="title">Log In</div>
      <div className="tab">
        <div onClick={() => setPar(true)} className={`item ${par && "active"}`}>
          Parent
        </div>
        <div
          onClick={() => setPar(false)}
          className={`item ${par || "active"}`}
        >
          Staff
        </div>
      </div>
      <form onSubmit={signIn}>
        {error && (
          <div className="message">
            <ExclamationTriangleIcon />
            <div className="text">{error.message}</div>
          </div>
        )}
        <div className="input">
          <PersonIcon />
          <input
            required
            type="email"
            id="email"
            onInput={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="input">
          <LockClosedIcon />
          <input
            required
            type="password"
            id="password"
            placeholder="Password"
            onInput={(e) => setPassword(e.target.value)}
          />
        </div>
        <button disabled={waiting}>
          {waiting ? (
            <>
              <DotFilledIcon className="grow-anim" /> &nbsp;Wait...
            </>
          ) : (
            "Log In"
          )}
        </button>
      </form>
    </div>
  )
}

export default Login
