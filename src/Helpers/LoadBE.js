import { dataUrl } from "./Constants"
async function LoadBE(query) {
  let token = localStorage.getItem("auth-token")
  let resp = await fetch(dataUrl, {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      "auth-token": token,
      "Content-Type": "application/json",
    },
  })
  if (resp.ok) {
    let rr = await resp.json()
    return rr
  } else {
    let rr = await resp.text()
    return { errors: [{ message: "Failed to load Request\n" + rr }] }
  }
}

export default LoadBE
