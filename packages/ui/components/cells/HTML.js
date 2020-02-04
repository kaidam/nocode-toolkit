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
  const config = useSelector(selectors.nocode.config)

  const contentRef = useRef(null)

  // handle internal links by canceling the click event and triggering an internal
  // route refresh (don't do this is ctrl is held down)
  //
  // also handle hash links that point to the same page
  // but prepending the full browser URL before the hash
  // this will not trigger a router reload
  useEffect(() => {
    const internalLinks = Array.prototype.slice.call(
      contentRef.current.querySelectorAll('a[data-nocode-internal-route]')
    )
    internalLinks.forEach(internalLink => {
      internalLink.addEventListener('click', (e) => {
        if (e.ctrlKey) return
        const url = internalLink.getAttribute('data-nocode-internal-route')
        const findUrl = (config.baseUrl + url).replace(/\/\//g, '/')
        const route = routePathMap[findUrl]
        if(!route) return
        e.preventDefault()
        e.stopImmediatePropagation()
        actions.navigateTo(route.name)        
        return false
      })
    })

    // loop over all links that are poitning to anchors on this page
    // insert the full URL to the current page
    // as we are using base href tag - these link to the homepage
    // if we don't do this
    const hashLinks = Array.prototype.slice
      .call(
        contentRef.current.querySelectorAll('a')
      )
      .filter(link => {
        return (link.getAttribute('href') || '').indexOf('#') == 0
      })
      .forEach(link => {
        const newHref = `${document.location.href.replace(/#.*/, '')}${link.getAttribute('href')}`
        link.setAttribute('href', newHref)
      })

    // if we arrived on this page using a hash - we need to manually jump down to the element
    if(document.location.hash) {
      const hashAnchorSelector = (document.location.hash || '').replace(/\./g, '\\.')
      const hashAnchor = document.querySelector(hashAnchorSelector)

      if(hashAnchor) {
        hashAnchor.scrollIntoView({
          behavior: 'auto',
          block: 'start',
          inline: 'start',
        })
      }
    }
  }, [
    content,
  ])

  return (
    <div 
      id="nocode-document-html"
      ref={ contentRef }
      dangerouslySetInnerHTML={{__html: content }}
    >
    </div>
  )
}

export default DocumentHTML