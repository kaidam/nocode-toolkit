import React, { useMemo } from 'react'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import MenuButton from './MenuButton'

import {
  getMergedClasses,
  eventSink,
} from '../../utils'

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
      textAlign: 'right',
    },

    itemContainer: ({
      vertical,
    }) => {
      return vertical ? {
        
      } : {
        float: 'left',
      }
    },

    item: props => ({
      ...theme.typography.button,
      display: 'block',
      fontWeight: '500',
      color: props.contrast ?
        theme.palette.primary.contrastText :
        theme.palette.primary.main,
      textAlign: props.align || 'center',
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
    vertical: props.vertical,
    align: props.align,
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
  allContent,
  routeMap,
  editor,
  isCurrent,
  linkProps,
  LinkComponent,
  onNavigateTo,
  ...props
}) => {
  const classes = getMergedClasses(useStyles({
    contrast: props.contrast,
    vertical: props.vertical,
    align: props.align,
  }), props.classes)
  const itemClass = classNames({
    [classes.item]: true,
    [classes.itemActive]: isCurrent,
  })
  if(item.type == 'folder') {

    const getItemOptions = (item) => {
      return item.children.map(id => {
        const child = allContent[id]
        const base = {
          title: child.data.name,
        }
        if(child.type == 'folder') {
          base.items = getItemOptions(child)
        }
        else {
          base.handler = () => {
            const route = routeMap[child.id]
            onNavigateTo(route.name)
          }
        }
        return base
      })
    }

    return (
      <MenuButton
        getButton={ (onClick) => {
          return (
            <div
              className={ classes.itemContainer }
              onClick={ onClick }
            >
              <div className={ itemClass }>
                <span>
                  { editor }
                </span>
                { item.data.name }
              </div>
            </div>
          )
        }}
        items={ getItemOptions(item) }
        className={ classes.itemContainer }
      />
    )
  }
  else {
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
}

const RendererItemOptions = ({
  children,
  ...props
}) => {
  const classes = getMergedClasses(useStyles({
    contrast: props.contrast,
    vertical: props.vertical,
    align: props.align,
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