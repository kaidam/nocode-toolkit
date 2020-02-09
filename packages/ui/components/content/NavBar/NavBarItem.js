import React, { lazy, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Link from '@nocode-toolkit/website/Link'
import routerActions from '@nocode-toolkit/website/store/moduleRouter'

import Suspense from '../../system/Suspense'

import itemTypes from '../../../types/item'

import Actions from '../../../utils/actions'
import selectors from '../../../store/selectors'

import defaultRenderers from './renderers'

const ItemOptions = lazy(() => import(/* webpackChunkName: "ui" */ '../../buttons/ItemOptions'))

const isLink = (item) => {
  if(item.id == 'home') return false
  const itemType = itemTypes(item)
  return itemType.isLink(item)
}

const NativeLinkComponent = ({
  children,
  ...props
}) => {
  return (
    <a {...props}>{children}</a>
  )
}

const NavBarItem = ({
  item,
  renderers,
  allContent,
  routeMap,
  ...props
}) => {

  const actions = Actions(useDispatch(), {
    navigateTo: routerActions.navigateTo,
  })

  const route = useSelector(selectors.router.route)

  let isCurrent = route.item == item.id
  if(route.name == 'root' && item.id == 'home') isCurrent = true

  const ItemOptionsRenderer = renderers.itemOptions || defaultRenderers.itemOptions
  const ItemRenderer = renderers.item || defaultRenderers.item

  const editor = useMemo(() => (
    <Suspense>
      <ItemOptionsRenderer
        {...props}
      >
        <ItemOptions
          item={ item }
          iconClassName="navbar-ui-icon"
        />
      </ItemOptionsRenderer>
    </Suspense>
  ), [item])

  const isItemLink = isLink(item)

  const LinkComponent = isItemLink ?
    NativeLinkComponent :
    Link

  const linkProps = isItemLink ?
    {
      href: item.data.url,
      target: '_external'
    } :
    {
      path: ('/' + item.url).replace(/\/\//g, '/'),
    }

  return (
    <ItemRenderer
      item={ item }
      allContent={ allContent }
      routeMap={ routeMap }
      editor={ editor }
      isCurrent={ isCurrent }
      linkProps={ linkProps }
      LinkComponent={ LinkComponent }
      onNavigateTo={ actions.navigateTo }
      {...props}
    />
  )
}

export default NavBarItem
