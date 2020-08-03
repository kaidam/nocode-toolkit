import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import utils from '../../utils/route'

import routerActions from '../../store/modules/router'
import nocodeSelectors from '../../store/selectors/nocode'
/*

  render a link to one of:

   * external url
   * internal name
   * internal path
   
   if the "url" is given - we treat it like a normal link tag

   if name or path is given - we hijack the click event,
   resolve the link and trigger the router action

   if an onClick handler is given - it is always triggered when
   the link is clicked regardless of the types above

*/
const NocodeLink = ({
  path,
  name,
  params,
  url,
  children,
  onClick,
  ...other
}) => {
  const routeMap = useSelector(nocodeSelectors.routeNameMap)
  const dispatch = useDispatch()
  const openPage = useCallback((e) => {
    if(url) {
      if(onClick) onClick(e)
      return true
    }
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    const routeName = name || utils.routePathToName(path)
    dispatch(routerActions.navigateTo(routeName, params))
    if(onClick) onClick(e)
    return false
  }, [
    path,
    name,
    url,
  ])
  const href = useMemo(() => {
    if(url) return url
    if(path) return path
    const route = routeMap[name]
    return route.path
  }, [
    name,
    path,
    url,
    routeMap,
  ])
  return (
    <a
      href={ href }
      target={ url ? '_blank' : '_self' }
      onClick={ openPage }
      {...other}
    >
      { children }
    </a>
  )
}

export default NocodeLink