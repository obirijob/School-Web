import { useState } from "react"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"

function Search({ placeholder, setText }) {
  const [search, setSearch] = useState("")
  return (
    <form
      className="search"
      onSubmit={e => {
        e.preventDefault()
        setText(search.toLowerCase())
      }}
    >
      <div className="input">
        <MagnifyingGlassIcon />
        <input
          type="search"
          onInput={e => {
            setSearch(s => e.target.value)
            setText(e.target.value.toLowerCase())
          }}
          placeholder={placeholder}
        />
      </div>
    </form>
  )
}

export default Search
