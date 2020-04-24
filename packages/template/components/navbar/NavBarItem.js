import React, { lazy } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

import routerActions from '../../store/modules/router'
import Suspense from '../system/Suspense'
import Link from '../widgets/Link'

import NavBarMenu from './NavBarMenu'

const EditableItem = lazy(() => import(/* webpackChunkName: "ui" */ '../content/EditableItem'))

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
  item,
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
    [classes.itemActive]: item.currentPage,
  })

  if(item.type == 'folder') {
    const getButton = (onClick) => {
      return (
        <div
          className={ itemClass }
          onClick={ onClick }
        >
          { item.name }
        </div>
      )
    }
    
    return (
      <li
        className={ classes.itemContainer }
      >
        <NavBarMenu
          children={ item.children }
          getButton={ getButton }
        />
      </li>
    )
  }
  else {
    if(showUI) {

      const onOpenItem = () => {
        if(item.type == 'link') {
          window.open(item.url)
        }
        else {
          dispatch(routerActions.navigateTo(item.route.name))
        }
      }

      const getRenderedItem = (onItemClick) => {
        return (
          <li
            className={ classes.itemContainer }
          >
            <div
              className={ itemClass }
              onClick={ onItemClick }
            >
              { item.name }
            </div>
          </li>
        )
      }
      return (
        <Suspense>
          <EditableItem
            node={ item }
            getRenderedItem={ getRenderedItem }
            onOpen={ onOpenItem }
          />
        </Suspense>
      )
    }
    else {
      const LinkComponent = item.type == 'link' ?
        NativeLinkComponent :
        Link

      const linkProps = item.type == 'link' ?
        {
          href: item.url,
          target: '_external'
        } :
        {
          name: item.route.name,
        }

      return (
        <li
          className={ classes.itemContainer }
        >
          <LinkComponent
            className={ itemClass }
            {...linkProps}
          >
            { item.name }
          </LinkComponent>
        </li>
      )
    }
  }
}

export default NavBarItem