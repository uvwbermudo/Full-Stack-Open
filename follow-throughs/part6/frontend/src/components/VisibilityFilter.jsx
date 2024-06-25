import { filterChange } from "../reducers/filterReducer";
import { useDispatch } from "react-redux";

const VisibilityFilter = (propse) => {
  const dispatch = useDispatch()

  return (
    <div>
      All <input type="radio" name="filter" onChange={() => dispatch(filterChange('ALL'))}/>
      Important <input type="radio" name="filter" onChange={() => dispatch(filterChange('IMPORTANT'))}/>
      Not Important <input type="radio" name="filter" onChange={() => dispatch(filterChange('NOT_IMPORTANT'))}/>
    </div>
  )
}

export default VisibilityFilter