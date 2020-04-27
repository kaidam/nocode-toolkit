import React, { lazy } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

import routerActions from '../../store/modules/router'
import Suspense from '../system/Suspense'
import Link from '../widgets/Link'

import NavBarMenu from './NavBarMenu'

import library from '../../library'

const EditableItem = lazy(() => import(/* webpackChunkName: "ui" */ '../content/EditableItem'))
const EditableNavBarMenu = lazy(() => import(/* webpackChunkName: "ui" */ './EditableNavBarMenu'))

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
    } = {}) => ({
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
      marginLeft: theme.spacing(1),
      borderRadius: theme.spacing(1),
      textDecoration: 'none',
      cursor: 'pointer',
      '&:hover': {
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
      },
      '& .navbar-ui-icon': {
        color: contrast ?
          theme.palette.primary.contrastText :
          theme.palette.text.main,
      },
    }),

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
}) => {

  const classes = useStyles({
    contrast,
    align,
    vertical,
  })

  const dispatch = useDispatch()

  const itemClass = classnames({
    [classes.item]: true,
    [classes.itemActive]: node.currentPage,
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
    
    if(showUI) {
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
        >
          <NavBarMenu
            children={ node.children }
            getButton={ getButton }
          />
        </li>
      )
    }
    
  }
  else {
    if(showUI) {

      const onOpenItem = () => {
        if(node.type == 'link') {
          window.open(node.url)
        }
        else {
          dispatch(routerActions.navigateTo(node.route.name))
        }
      }

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
        >
          <LinkComponent
            className={ itemClass }
            {...linkProps}
          >
            { node.name }
          </LinkComponent>
        </li>
      )
    }
  }
}

export default NavBarItem