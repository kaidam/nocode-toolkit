import React, { lazy, useEffect, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import routerActions from '../../store/modules/router'
import nocodeSelectors from '../../store/selectors/nocode'
import routerSelectors from '../../store/selectors/router'
import systemSelectors from '../../store/selectors/system'

import Actions from '../../utils/actions'
import systemUtils from '../../utils/system'
import eventUtils from '../../utils/events'
import driveUtils from '../../utils/drive'

import Suspense from '../system/Suspense'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  defaultHTML: ({showUI}) => ({
    marginTop: showUI ? '0px' : '12px',
  }),
  googleHTML: ({showUI}) => ({
    marginTop: showUI ? '0px' : '12px',
    // put styles for the body container here
    '& p': {
     paddingTop: ['18.6667px', '!important'],
     wordBreak: 'break-word',
     wordWrap: 'break-word',
     overflowWrap: 'break-word',
    },
    '& p:nth-child(1)': {
      paddingTop: ['0px', '!important'],
    },
    '& ul': {
     paddingTop: ['18.6667px', '!important'],
     paddingBottom: ['18.6667px', '!important'],
    }
  }),
}))

const DefaultBody = lazy(() => import(/* webpackChunkName: "ui" */ './DefaultBody'))
const ReloadTrigger = lazy(() => import(/* webpackChunkName: "ui" */ './ReloadTrigger'))

const DocumentBody = ({
  node,
  html,
}) => {

  const actions = Actions(useDispatch(), {
    navigateTo: routerActions.navigateTo,
  })

  const showUI = useSelector(systemSelectors.showUI)
  const routePathMap = useSelector(routerSelectors.routePathMap)
  const config = useSelector(nocodeSelectors.config)

  const contentRef = useRef(null)
  const classes = useStyles({
    showUI,
  })

  const editUrl = driveUtils.getItemUrl(node)

  const hasContent = useMemo(() => {
    if(!html) return true
    if(systemUtils.isNode) return true

    const checkDiv = document.createElement('div')
    checkDiv.innerHTML = html

    const hasText = checkDiv.innerText.match(/\w/) ? true : false
    const hasImage = checkDiv.querySelector('img') ? true : false

    return hasText || hasImage
  }, [
    html,
  ])

  // handle internal links by canceling the click event and triggering an internal
  // route refresh (don't do this is ctrl is held down)
  //
  // also handle hash links that point to the same page
  // but prepending the full browser URL before the hash
  // this will not trigger a router reload
  useEffect(() => {
    if(systemUtils.isNode) return
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
        e.stopImmediatePropagation()
        e.preventDefault()        
        actions.navigateTo(route.name)        
        return false
      })
    })

    // loop over all links that are poitning to anchors on this page
    // insert the full URL to the current page
    // as we are using base href tag - these link to the homepage
    // if we don't do this
    Array.prototype.slice
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
    html,
  ])

  const content = showUI && !hasContent ? (
    <div
      id="nocode-document-html"
      className={ classes.defaultHTML }
      ref={ contentRef }
    >
      <Suspense>
        <DefaultBody
          onClick={ () => window.open(editUrl) }
        />
      </Suspense>
    </div>
  ) : (
    <div 
      id="nocode-document-html"
      className={ classes.googleHTML }
      ref={ contentRef }
      dangerouslySetInnerHTML={{__html: html }}
    >
    </div>
  )

  return (
    <React.Fragment>
      {
        content
      }
      <Suspense>
        <ReloadTrigger
          node={ node }
        />
      </Suspense>
    </React.Fragment>
    
  )
}

export default DocumentBody