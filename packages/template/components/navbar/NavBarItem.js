import React, { lazy, useState, useCallback, useRef, useEffect } from 'react'
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
  const [ isMenuOpen, setIsMenuOpen ] = useState(false)
  //const [ containerCoords, setContainerCoords ] = useState(null)

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
    vertical,
    isHovered,
  })

  // useEffect(() => {
  //   const newCoords = containerRef.current ? containerRef.current.getBoundingClientRect() : null
  //   if(newCoords && !containerCoords) {
  //     setContainerCoords(newCoords)
  //   }
  //   console.log('--------------------------------------------')
  //   console.dir(newCoords)
  //   console.dir(node.id)
  //   // const newCoords = containerRef.current ? containerRef.current.getBoundingClientRect() : {width: 0}
  //   // if(containerRef.current && !containerCoords && newCoords.width > 0) {
  //   //   console.log('--------------------------------------------')
  //   //   console.dir(newCoords)
  //   //   //setContainerCoords(newCoords)
  //   // }
  // }, [
  //   containerRef.current,
  // ])

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

  const onOpenItem = () => {
    if(node.type == 'link') {
      window.open(node.url)
    }
    else {
      dispatch(routerActions.navigateTo(node.route.name))
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
            <EditableNavBarMenu
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
          <NavBarMenu
            children={ node.children }
            getButton={ getButton }
          />
          {
            (isHovered || isMenuOpen) && (
              <Suspense>
                <EditHoverButton
                  node={ node }
                  isOpen={ false }
                  isMenuOpen={ isMenuOpen }
                  folderPages={ folderPages }
                  anchorRef={ containerRef }
                  onOpenItem={ onOpenItem }
                  offset={{
                    left: 0,
                    top: 50,
                  }}
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
            (isHovered || isMenuOpen) && (
              <Suspense>
                <EditHoverButton
                  node={ node }
                  isOpen={ false }
                  isMenuOpen={ isMenuOpen }
                  folderPages={ folderPages }
                  anchorRef={ containerRef }
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