import { useState } from "react"

function Combo({ items, label, sub, setSelected }) {
  const [show, setShow] = useState(false)
  const [sel, setSel] = useState("")
  const [val, setVal] = useState("")
  return (
    <div className="combo">
      <input
        type="text"
        defaultValue={sel.toUpperCase()}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 500)}
        onInput={(e) => setVal(e.target.value.toLowerCase())}
      />
      <div className="selected"></div>
      <div
        className="dropdown"
        style={
          show
            ? { pointerEvents: "all", opacity: 1 }
            : { pointerEvents: "none", opacity: 0 }
        }
      >
        {items
          .filter((i) => i[label].toLowerCase().includes(val))
          .map((i) => (
            <div
              className="item"
              onClick={() => {
                setSelected(i)
                setSel(i[label])
              }}
            >
              <div className="label">{i[label].toUpperCase()}</div>
              <div className="sub">{i[sub]}</div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Combo
