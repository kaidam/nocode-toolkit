import React, { lazy, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'

import Link from '@nocode-toolkit/website/Link'

import Suspense from '../system/Suspense'

import itemTypes from '../../types/item'
import selectors from '../../store/selectors'

const ItemOptions = lazy(() => import(/* webpackChunkName: "ui" */ '../buttons/ItemOptions'))
const SectionEditor = lazy(() => import(/* webpackChunkName: "ui" */ '../buttons/SectionEditor'))

const RenderRoot = ({
  navbar,
  editor,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          justifyContent: 'flex-end',
        }}
      >
        { navbar }
      </div>
      {
        editor && (
          <div
            style={{
              flexGrow: 0,
              paddingLeft: '40px',
              paddingRight: '40px',
            }}
          >
            { editor }
          </div>
        )
      }
    </div>
  )
}

const RenderNavbar = ({
  children,
}) => {
  return (
    <nav
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      { children }
    </nav>
  )
}

const RenderItem = ({
  item,
  editor,
  isCurrent,
  linkProps,
  LinkComponent,
}) => {
  return (
    <LinkComponent
      style={{
        textDecoration: isCurrent ? 'underline' : 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
      {...linkProps}
    >
      { editor }
      { item.data.name }
    </LinkComponent>
  )
}

const RendererItemOptions = ({
  children,
}) => {
  return children
}

const defaultRenderers = {
  root: RenderRoot,
  navbar: RenderNavbar,
  item: RenderItem,
  itemOptions: RendererItemOptions,
}

const isLink = (item) => {
  if(item.id == 'home') return false
  const itemType = itemTypes(item)
  return itemType.isLink(item)
}

const NavBarItem = ({
  item,
  renderers,
}) => {
  const route = useSelector(selectors.router.route)

  let isCurrent = route.item == item.id
  if(route.name == 'root' && item.id == 'home') isCurrent = true

  const ItemOptionsRenderer = renderers.itemOptions || defaultRenderers.itemOptions
  const ItemRenderer = renderers.item || defaultRenderers.item

  const editor = useMemo(() => (
    <Suspense>
      <ItemOptionsRenderer>
        <ItemOptions
          item={ item }
          iconClassName="navbar-ui-icon"
        />
      </ItemOptionsRenderer>
    </Suspense>
  ), [item])

  const isItemLink = isLink(item)

  const LinkComponent = isItemLink ?
    a :
    Link

  const linkProps = isItemLink ?
    {
      href: item.data.url,
      target: '_external'
    } :
    {
      path: item.url,
    }

  return (
    <ItemRenderer
      item={ item }
      editor={ editor }
      isCurrent={ isCurrent }
      linkProps={ linkProps }
      LinkComponent={ LinkComponent }
    />
  )
}

const NavBar = ({
  section,
  withHome,
  renderers = {},
}) => {
  const sectionListSelector = useMemo(selectors.content.sectionList, [])
  const sectionList = useSelector(state => sectionListSelector(state, section))

  const sectionFilter = useCallback((parentFilter, schemaDefinition) => {
    if(parentFilter.indexOf('section') < 0) return false
    if(schemaDefinition.metadata.hasChildren) return false
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
        />
      )
    })
  }, [withHome, sectionList])

  const navbar = (
    <NavBarRenderer>
      { items }
    </NavBarRenderer>
  )

  const editor = (
    <Suspense>
      <SectionEditor
        id={ section }
        filter={ sectionFilter }
        location={ `section:${section}` }
        structure="list"
        tiny
      />
    </Suspense>
  )

  return (
    <RootRenderer
      navbar={ navbar }
      editor={ editor }
    />
  )
}

export default NavBar
