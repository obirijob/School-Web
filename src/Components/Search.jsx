import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
function Search({ placeholder }) {
  return (
    <form className="search">
      <div className="input">
        <MagnifyingGlassIcon />
        <input type="search" placeholder={placeholder} />
      </div>
    </form>
  )
}

export default Search
