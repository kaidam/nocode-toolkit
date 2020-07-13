// main app entry
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import systemActions from '../../store/modules/system'

const BootLoader = ({
  
}) => {

  const dispatch = useDispatch()

  useEffect(() => {
    const handler = async () => {
      await dispatch(systemActions.initialise())
    }
    handler()
  }, [])

  return null
}

export default BootLoader