import React from 'react'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import ListItemIcon from '@material-ui/core/ListItemIcon'

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

    itemContainer: {
      float: 'left',
    },

    item: props => ({
      ...theme.typography.button,
      display: 'block',
      fontWeight: '500',
      color: props.contrast ?
        theme.palette.primary.contrastText :
        theme.palette.primary.main,
      textAlign: 'center',
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      marginRight: theme.spacing(1),
      borderRadius: theme.spacing(1),
      textDecoration: 'none',
      cursor: 'pointer',
      '&:hover': {
        color: props.contrast ?
          theme.palette.primary.main :
          theme.palette.primary.contrastText,
        backgroundColor: props.contrast ?
          theme.palette.primary.contrastText :
          theme.palette.primary.main,
        '& .navbar-ui-icon': {
          color: props.contrast ?
            theme.palette.primary.main :
            theme.palette.primary.contrastText,
        },
      },
      '& .navbar-ui-icon': {
        color: props.contrast ?
          theme.palette.primary.contrastText :
          theme.palette.primary.main,
      },
    }),

    itemActive: props => ({
      color: props.contrast ?
        theme.palette.primary.main :
        theme.palette.primary.contrastText,
      backgroundColor: props.contrast ?
        theme.palette.primary.contrastText :
        theme.palette.primary.main,
      '& .navbar-ui-icon': {
        color: props.contrast ?
          theme.palette.primary.main :
          theme.palette.primary.contrastText,
      },
    }),

    optionsIcon: {
      minWidth: '40px',
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

  return (
    <div className={ classes.root }>
      <div className={ classes.content }>
        <nav>
          <ul className={ classes.navbar }>
            { children }
          </ul>
        </nav>
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
  withHighlight,
  ...props
}) => {
  const classes = getMergedClasses(useStyles({
    contrast: props.contrast,
  }), props.classes)
  const itemClass = classNames({
    [classes.item]: true,
    [classes.itemActive]: isCurrent && withHighlight,
  })

  return (
    <li
      className={ classes.itemContainer }
    >
      <LinkComponent
        className={ itemClass }
        {...linkProps}
      >
        <span>
          { editor }
        </span>
        { item.data.name }
      </LinkComponent>
    </li>
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