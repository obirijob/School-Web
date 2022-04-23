import { Cross2Icon } from "@radix-ui/react-icons"

function Modal({ title, children, shown, hide }) {
  return (
    <div
      className="modal"
      style={
        shown
          ? { opacity: 1, pointerEvents: "all" }
          : { opacity: 0, pointerEvents: "none" }
      }
    >
      <div className="modal-content">
        <div className="title">{title}</div>
        <div className="children">{children}</div>
        <div className="close" onClick={hide}>
          <Cross2Icon />
        </div>
      </div>
    </div>
  )
}

export default Modal
