import React, { useState, useCallback, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import ListItemIcon from '@material-ui/core/ListItemIcon'
import IconButton from '@material-ui/core/IconButton'
import MoreVert from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import selectors from '@nocode-toolkit/website/selectors'

import {
  getMergedClasses,
  eventSink,
} from './utils'

const useStyles = makeStyles(theme => {
  return {
    root: {
      padding: theme.spacing(1.5),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '100%',
    },
    content: {
      flexGrow: 0,
    },
    editor: {
      flexGrow: 0,
    },
    navbar: {
      listStyleType: 'none',
      margin: '0',
      padding: '0',
      overflow: 'hidden',
      fontSize: '1em',
    },

    optionsIcon: {
      minWidth: '40px',
    },

    navButton: props => ({
      color: props.contrast ?
        theme.palette.primary.contrastText :
        theme.palette.primary.main,
    }),

    item: {
      color: theme.palette.text.primary,
      textDecoration: 'none',
      cursor: 'pointer',
    },

  }
})

const RenderRoot = ({
  editor,
  children,
  ...props
}) => {
  const classes = getMergedClasses(useStyles({
    contrast: props.contrast,
  }), props.classes)

  const route = useSelector(selectors.router.route)

  const [ anchorEl, setAnchorEl ] = useState(null)
  const handleMenu = useCallback((event) => setAnchorEl(event.currentTarget), [])
  const handleClose = useCallback((event) => setAnchorEl(null), [])
  const open = Boolean(anchorEl)

  useEffect(() => {
    setAnchorEl(null)
  }, [route])

  if(!children || children.length <= 0) return null

  return (
    <div className={ classes.root }>
      <div className={ classes.content }>
        <div>
          <IconButton
            aria-owns={ open ? 'menu-appbar' : null }
            aria-haspopup="true"
            onClick={ handleMenu }
          >
            <MoreVert className={ classes.navButton } />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={ anchorEl }
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={ open }
            onClose={ handleClose }
          >
            <MenuItem key="placeholder" style={{display: "none"}} />
            { children }
          </Menu>
        </div>
      </div>
      {
        editor && (
          <div className={ classes.editor }>
            { editor }
          </div>
        )
      }
    </div>
  )
}

const RenderItem = ({
  item,
  editor,
  isCurrent,
  linkProps,
  LinkComponent,
  ...props
}) => {

  const classes = getMergedClasses(useStyles({
    contrast: props.contrast,
  }), props.classes)

  return (
    <MenuItem>
      <LinkComponent
        className={ classes.item }
        {...linkProps}
      >
        <span>
          { editor }
        </span>
        { item.data.name }
      </LinkComponent>
    </MenuItem>
  )
}

const RendererItemOptions = ({
  children,
  ...props
}) => {
  const classes = getMergedClasses(useStyles({
    contrast: props.contrast,
  }), props.classes)

  return (
    <ListItemIcon 
      className={ classes.optionsIcon }
      onClick={ eventSink }
    >
      { children }
    </ListItemIcon>
  )
}

const renderers = {
  root: RenderRoot,
  item: RenderItem,
  itemOptions: RendererItemOptions,
}

export default renderers