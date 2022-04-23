import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
function Search({ placeholder, setText }) {
  return (
    <form
      className="search"
      onSubmit={e => {
        e.preventDefault()
        setText(e.target.value)
      }}
    >
      <div className="input">
        <MagnifyingGlassIcon />
        <input type="search" placeholder={placeholder} />
      </div>
    </form>
  )
}

export default Search
