import React, { lazy, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

import routerActions from '../../store/modules/router'
import contentSelectors from '../../store/selectors/content'
import Suspense from '../system/Suspense'
import Link from '../widgets/Link'

import NavBarMenu from './NavBarMenu'

import library from '../../library'

import {
  hasMouse,
} from '../../utils/browser'

const EditableItem = lazy(() => import(/* webpackChunkName: "ui" */ '../content/EditableItem'))
const EditableNavBarMenu = lazy(() => import(/* webpackChunkName: "ui" */ './EditableNavBarMenu'))
const EditHoverButton = lazy(() => import(/* webpackChunkName: "ui" */ './EditHoverButton'))

const NativeLinkComponent = ({
  children,
  ...props
}) => {
  return (
    <a {...props}>{children}</a>
  )
}

const useStyles = makeStyles(theme => {
  return {
    itemContainer: ({
      vertical,
      align = 'left',
    } = {}) => {
      return vertical ? {
        
      } : {
        float: align,
      }
    },

    itemEditor: {
      marginRight: theme.spacing(1),
    },

    item: ({
      contrast,
      align = 'left',
      isHovered,
    } = {}) => {

      const hoverProps = {
        color: contrast ?
          theme.palette.primary.main :
          theme.palette.primary.contrastText,
        backgroundColor: contrast ?
          theme.palette.primary.contrastText :
          theme.palette.primary.main,
        '& .navbar-ui-icon': {
          color: contrast ?
            theme.palette.primary.main :
            theme.palette.primary.contrastText,
        },
      }

      const styleProps = {
        ...theme.typography.button,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: align == 'left' ?
          'flex-start' :
          'flex-end',
        fontWeight: '500',
        color: contrast ?
          theme.palette.primary.contrastText :
          theme.palette.primary.main,
        textAlign: align,
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
        borderRadius: theme.spacing(1),
        textDecoration: 'none',
        cursor: 'pointer',
        '&:hover': hoverProps,
        '& .navbar-ui-icon': {
          color: contrast ?
            theme.palette.primary.contrastText :
            theme.palette.text.main,
        },
      }

      return isHovered ?
        Object.assign({}, styleProps, hoverProps) :
        styleProps
    },

    itemActive: ({
      contrast,
    }) => ({
      color: contrast ?
        theme.palette.primary.main :
        theme.palette.primary.contrastText,
      backgroundColor: contrast ?
        theme.palette.primary.contrastText :
        theme.palette.primary.main,
      '& .navbar-ui-icon': {
        color: contrast ?
          theme.palette.primary.main :
          theme.palette.primary.contrastText,
      },
    }),
  }
})

const NavBarItem = ({
  node,
  showUI,
  contrast,
  align = 'left',
  vertical,
  folderPages,
}) => {

  const [ isHovered, setIsHovered ] = useState(false)
  const hoverRef = useRef()

  const onHover = useCallback(() => {
    setIsHovered(true)
  })

  const onLeave = useCallback(() => {
    setIsHovered(false)
  })

  const classes = useStyles({
    contrast,
    align,
    vertical,
    isHovered,
  })

  const dispatch = useDispatch()

  const ancestors = useSelector(contentSelectors.fullRouteAncestors)

  const isNodeActive = ancestors.find(ancestor => ancestor.node && ancestor.node.id == node.id)

  const itemClass = classnames({
    [classes.item]: true,
    [classes.itemActive]: isNodeActive,
  })

  // folders can be treated as documents
  // if we don't want a sub-menu
  const isFolder = library.handlers.isFolder ?
    library.handlers.isFolder(node) :
    node.type == 'folder'

  if(isFolder) {
    const getButton = (onClick) => {
      return (
        <div
          className={ itemClass }
          onClick={ onClick }
          onContextMenu={ showUI ? onClick : null }
        >
          { node.name }
        </div>
      )
    }
    
    if(showUI && !hasMouse()) {
      return (
        <li
          className={ classes.itemContainer }
        >
          <Suspense>
            <EditableNavBarMenu
              node={ node }
              children={ node.children  }
              getButton={ getButton }
            />
          </Suspense>
        </li>
      )
    }
    else {
      return (
        <li
          className={ classes.itemContainer }
          ref={ hoverRef }
          onMouseEnter={ onHover }
          onMouseLeave={ onLeave }
        >
          <NavBarMenu
            children={ node.children }
            getButton={ getButton }
          />
          {
            isHovered && (
              <Suspense>
                <EditHoverButton
                  node={ node }
                  open={ false }
                  folderPages={ folderPages }
                  anchorRef={ hoverRef }
                  onOpen={ () => {} }
                  onClose={ onLeave }
                />
              </Suspense>
            )
          }
        </li>
      )
    }
    
  }
  else {

    const onOpenItem = () => {
      if(node.type == 'link') {
        window.open(node.url)
      }
      else {
        dispatch(routerActions.navigateTo(node.route.name))
      }
    }

    if(showUI && !hasMouse()) {

      const getRenderedItem = (onItemClick, uiMode) => {
        return (
          <li
            className={ classes.itemContainer }
          >
            <div
              className={ itemClass }
              onClick={ onItemClick }
              onContextMenu={ uiMode ? onItemClick : null }
            >
              { node.name }
            </div>
          </li>
        )
      }
      return (
        <Suspense>
          <EditableItem
            node={ node }
            getRenderedItem={ getRenderedItem }
            onOpen={ onOpenItem }
          />
        </Suspense>
      )
    }
    else {

      const LinkComponent = node.type == 'link' ?
        NativeLinkComponent :
        Link

      const linkProps = node.type == 'link' ?
        {
          href: node.url,
          target: '_external'
        } :
        {
          name: node.route.name,
        }

      return (
        <li
          className={ classes.itemContainer }
          ref={ hoverRef }
          onMouseEnter={ onHover }
          onMouseLeave={ onLeave }
        >
          <LinkComponent
            className={ itemClass }
            {...linkProps}
          >
            { node.name }
          </LinkComponent>
          {
            isHovered && (
              <Suspense>
                <EditHoverButton
                  node={ node }
                  open={ false }
                  folderPages={ folderPages }
                  anchorRef={ hoverRef }
                  onOpen={ onOpenItem }
                  onClose={ onLeave }
                />
              </Suspense>
            )
          }
        </li>
      )
    }
  }
}

export default NavBarItem