import React, { lazy, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Suspense from '../../system/Suspense'
import selectors from '../../../store/selectors'
import defaultRenderers from './renderers'
import NavBarItem from './NavBarItem'

const SectionEditor = lazy(() => import(/* webpackChunkName: "ui" */ '../../buttons/SectionEditor'))

const NavBar = ({
  section,
  withHome,
  renderers = {},
  ...props
}) => {
  const showUI = useSelector(selectors.ui.showUI)
  const sectionListSelector = useMemo(selectors.content.sectionList, [])
  const sectionList = useSelector(state => sectionListSelector(state, section))
  const allContent = useSelector(selectors.content.contentAll)
  const routeMap = useSelector(selectors.nocode.routeMap)

  const sectionFilter = useCallback((parentFilter, schemaDefinition) => {
    if(parentFilter.indexOf('section') < 0) return false
    if(schemaDefinition.metadata.allowedSectionTypes && schemaDefinition.metadata.allowedSectionTypes.indexOf('navbar') < 0) return false
    return true
  }, [])

  const RootRenderer = renderers.root || defaultRenderers.root
  const NavBarRenderer = renderers.navbar || defaultRenderers.navbar

  const items = useMemo(() => {
    const data = withHome ?
      [{
        id: 'home',
        location: {
          type: 'section',
          id: section,
        },
        data: {
          name: 'Home',
        },
        url: '/',
      }].concat(sectionList) :
      sectionList

    return data.map((item, i) => {
      return (
        <NavBarItem
          key={ i }
          item={ item }
          renderers={ renderers }
          allContent={ allContent }
          routeMap={ routeMap }
          {...props}
        />
      )
    })
  }, [
    withHome,
    sectionList,
    props,
    allContent,
  ])

  const editor = showUI && (
    <Suspense>
      <SectionEditor
        id={ section }
        filter={ sectionFilter }
        location={ `section:${section}` }
        structure="tree"
        sectionType="navbar"
        tiny
      />
    </Suspense>
  )

  return (
    <RootRenderer
      editor={ editor }
      {...props}
    >
      { items }
    </RootRenderer>
  )
}

export default NavBar
