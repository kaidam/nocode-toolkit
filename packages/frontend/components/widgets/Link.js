import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import utils from '../../utils/route'
import routerActions from '../../store/modules/router'

const NocodeLink = ({
  path,
  name,
  children,
  onClick,
  ...other
}) => {
  const dispatch = useDispatch()
  const openPage = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    const routeName = name || utils.routePathToName(path)
    dispatch(routerActions.navigateTo(routeName))
    if(onClick) onClick()
    return false
  }, [path, name])
  return (
    <a href={ path } onClick={ openPage } {...other}>
      { children }
    </a>
  )
}

export default NocodeLink