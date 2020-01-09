import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import routerActions from '@nocode-toolkit/website/store/moduleRouter'
import selectors from '../../store/selectors'
import Actions from '../../utils/actions'

const DocumentHTML = ({
  content,
}) => {

  const actions = Actions(useDispatch(), {
    navigateTo: routerActions.navigateTo,
  })

  const routePathMap = useSelector(selectors.nocode.routePathMap)

  const contentRef = useRef(null)

  // handle internal links by canceling the click event and triggering an internal
  // route refresh (don't do this is ctrl is held down)
  useEffect(() => {
    const internalLinks = Array.prototype.slice.call(
      contentRef.current.querySelectorAll('a[data-nocode-internal-route]')
    )
    internalLinks.forEach(internalLink => {
      internalLink.addEventListener('click', (e) => {
        if (e.ctrlKey) return
        const url = internalLink.getAttribute('data-nocode-internal-route')
        const route = routePathMap[url]
        if(!route) return
        e.preventDefault()
        e.stopImmediatePropagation()
        actions.navigateTo(route.name)        
        return false
      })
    })
  }, [
    content,
  ])

  return (
    <div 
      ref={ contentRef }
      dangerouslySetInnerHTML={{__html: content }}
    >
    </div>
  )
}

export default DocumentHTML