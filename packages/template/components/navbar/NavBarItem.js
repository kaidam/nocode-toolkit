import React, { lazy, useState, useCallback, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

import routerActions from '../../store/modules/router'
import contentSelectors from '../../store/selectors/content'
import Suspense from '../system/Suspense'
import Link from '../widgets/Link'

import NavBarDropdown from './NavBarDropdown'

import eventUtils from '../../utils/events'
import library from '../../library'

import {
  hasMouse,
} from '../../utils/browser'

const EditableItem = lazy(() => import(/* webpackChunkName: "ui" */ '../content/EditableItem'))
const NavBarDropdownUI = lazy(() => import(/* webpackChunkName: "ui" */ './NavBarDropdownUI'))
const NavBarItemButton = lazy(() => import(/* webpackChunkName: "ui" */ './NavBarItemButton'))
const FocusElementOverlay = lazy(() => import(/* webpackChunkName: "ui" */ '../widgets/FocusElementOverlay'))

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
      float = 'left',
    } = {}) => {
      return vertical ? {
        
      } : {
        float: float,
      }
    },

    itemEditor: {
      marginRight: theme.spacing(1),
    },

    item: ({
      contrast,
      align = 'left',
      isHovered,
      vertical,
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
        marginTop: vertical ? theme.spacing(0.5) : 0,
        marginBottom: vertical ? theme.spacing(0.5) : 0,
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
  float = 'left',
  vertical,
  editable,
  isItemActive,
}) => {

  const [ isHovered, setIsHovered ] = useState(false)
  const [ isMenuOpen, setIsMenuOpen ] = useState(false)

  const containerRef = useRef()

  const onHover = useCallback(() => {
    setIsHovered(true)
  })

  const onLeave = useCallback(() => {
    setIsHovered(false)
  })

  const onOpenMenu = useCallback(() => {
    setIsMenuOpen(true)
  })

  const onCloseMenu = useCallback(() => {
    setIsMenuOpen(false)
    setIsHovered(false)
  })

  const classes = useStyles({
    contrast,
    align,
    float,
    vertical,
    isHovered,
  })

  const dispatch = useDispatch()

  const ancestors = useSelector(contentSelectors.fullRouteAncestors)

  const isNodeActive = isItemActive ?
    isItemActive({
      node,
    }) : 
    ancestors.find(ancestor => ancestor.node && ancestor.node.id == node.id)

  const itemClass = classnames({
    [classes.item]: true,
    [classes.itemActive]: isNodeActive,
    'nocode-navbar-item': true,
    'nocode-navbar-item-hover': isHovered,
  })

  // folders can be treated as documents
  // if we don't want a sub-menu
  const isFolder = node.type == 'folder'

  const onOpenItem = () => {
    if(node.type == 'link') {
      if(node.url.indexOf('code:') == 0) {
        const code = node.url.replace(/^code:/, '')
        eval(code)
      }
      else {
        window.open(node.url)
      }
    }
    else {
      if(node.route) dispatch(routerActions.navigateTo(node.route.name))
    }
  }

  if(isFolder) {
    const getButton = (onClick) => {
      return (
        <div
          className={ itemClass }
          onClick={ onClick }
          onContextMenu={ showUI ? onClick : null }
          ref={ containerRef }
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
            <NavBarDropdownUI
              clickPositioning
              clickOffset={{
                x: 5,
                y: 25,
              }}
              node={ node }
              children={ node.children  }
              getButton={ getButton }
              onOpenMenu={ onOpenMenu }
              onCloseMenu={ onCloseMenu }
            />
            {
              isMenuOpen && (
                <FocusElementOverlay
                  adjustTopbar={ false }
                  padding={ 4 }
                  contentRef={ containerRef }
                />
              )
            }
          </Suspense>
        </li>
      )
    }
    else {
      return (
        <li
          className={ classes.itemContainer }
          ref={ containerRef }
          onMouseEnter={ onHover }
          onMouseLeave={ onLeave }
        >
          <NavBarDropdown
            children={ node.children }
            getButton={ getButton }
            onClose={ onCloseMenu }
          />
          {
            editable && (isHovered || isMenuOpen) && (
              <Suspense>
                <NavBarItemButton
                  node={ node }
                  isOpen={ false }
                  isMenuOpen={ isMenuOpen }
                  offsetRef={ containerRef }
                  offset={{
                    left: 0,
                    top: 50,
                  }}
                  onOpenItem={ onOpenItem }
                  onOpen={ onOpenMenu }
                  onClose={ onCloseMenu }
                />
              </Suspense>
            )
          }
          {
            isMenuOpen && (
              <Suspense>
                <FocusElementOverlay
                  adjustTopbar={ false }
                  padding={ 4 }
                  contentRef={ containerRef }
                />
              </Suspense>
            )
          }
        </li>
      )
    }
    
  }
  else {

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
              ref={ containerRef }
            >
              { node.name }
            </div>
            {
              isMenuOpen && (
                <Suspense>
                  <FocusElementOverlay
                    adjustTopbar={ false }
                    padding={ 4 }
                    contentRef={ containerRef }
                  />
                </Suspense> 
              )
            }
          </li>
        )
      }

      return (
        <Suspense>
          <EditableItem
            clickPositioning
            clickOffset={{
              x: 5,
              y: 25,
            }}
            node={ node }
            getRenderedItem={ getRenderedItem }
            onOpenItem={ onOpenItem }
            onOpenMenu={ onOpenMenu }
            onCloseMenu={ onCloseMenu }
          />
        </Suspense>
      )
    }
    else {

      const LinkComponent = node.type == 'link' ?
        NativeLinkComponent :
        Link

      let linkProps = node.type == 'link' ?
        {
          href: node.url,
          target: '_external'
        } :
        (
          node.route ? {
            name: node.route.name,
            params: node.route.params,
          } : {
            name: 'root',
            params: {},
          }
        )

      if(node.type == 'link' && node.url.indexOf('code:') == 0) {
        linkProps = {
          href: '#',
          onClick: (e) => {
            eventUtils.cancelEvent(e)
            onOpenItem()
            return false
          }
        }
      }

      return (
        <li
          className={ classnames('nocode-navbar-item-container', classes.itemContainer) }
          ref={ containerRef }
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
            editable && (isHovered || isMenuOpen) && (
              <Suspense>
                <NavBarItemButton
                  node={ node }
                  isOpen={ false }
                  isMenuOpen={ isMenuOpen }
                  offsetRef={ containerRef }
                  offset={{
                    left: 0,
                    top: 50,
                  }}
                  onOpenItem={ onOpenItem }
                  onOpen={ onOpenMenu }
                  onClose={ onCloseMenu }
                />
              </Suspense>
            )
          }
          {
            isMenuOpen && (
              <Suspense>
                <FocusElementOverlay
                  adjustTopbar={ false }
                  padding={ 4 }
                  contentRef={ containerRef }
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