import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

import Suspense from '../system/Suspense'
import Link from '../widgets/Link'

import NavBarMenu from './NavBarMenu'

import contentSelectors from '../../store/selectors/content'
import routerSelectors from '../../store/selectors/router'

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
    }) => {
      return vertical ? {
        
      } : {
        float: 'left',
      }
    },

    itemEditor: {
      marginRight: theme.spacing(1),
    },

    item: ({
      contrast,
      align = 'center',
    } = {}) => ({
      ...theme.typography.button,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
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
          theme.palette.primary.main,
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
  contrast,
  align,
  vertical,
  ItemEditorComponent,
  onClick,
}) => {

  const classes = useStyles({
    contrast,
    align,
    vertical,
  })

  const itemClass = classnames({
    [classes.item]: true,
    [classes.itemActive]: item.currentPage,
  })

  let content = null
  const editorComponent = ItemEditorComponent ?
   (
      <Suspense
        Component={ ItemEditorComponent }
        props={{
          node: item,
          buttonClassname: classes.itemEditor,
        }}
      /> 
   ) : null

  if(item.type == 'folder') {
    const getButton = (onClick) => {
      return (
        <div
          className={ itemClass }
          onClick={ onClick }
        >
          { editorComponent }
          { item.name }
        </div>
      )
    }
    
    content = (
      <NavBarMenu
        item={ item }
        ItemEditorComponent={ ItemEditorComponent }
        getButton={ getButton }
      />
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

    content = (
      <LinkComponent
        className={ itemClass }
        {...linkProps}
      >
        { editorComponent }
        { item.name }
      </LinkComponent>
    )
  }

  return (
    <li
      className={ classes.itemContainer }
    >
      { content }
    </li>
  )
}

export default NavBarItem