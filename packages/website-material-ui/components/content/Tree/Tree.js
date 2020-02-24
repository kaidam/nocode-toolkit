import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import BaseTree from '@nocode-toolkit/ui/components/content/Tree/Tree'
import ContentIcon from '@nocode-toolkit/ui/components/content/Icon'

import icons from '@nocode-toolkit/ui/icons'

const ExpandMoreIcon = icons.expandMore
const ExpandLessIcon = icons.expandLess

import {
  getMergedClasses,
  eventSink,
} from '../../utils'

const useStyles = makeStyles(theme => createStyles({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    overflowY: 'auto',
    overflowX: 'hidden',
    flexGrow: 1,
  },
  editor: {
    flexGrow: 0,
    borderBottom: '1px solid #ccc',
  },
  panelTop: {
    flexGrow: 0,
  },
  panelBottom: {
    flexGrow: 0,
  },

  list: {

  },

  itemChildren: {
    paddingLeft: theme.spacing(1.5),
    '& > ul': {
      paddingTop: ['0px', '!important'],
      paddingBottom: ['0px', '!important'],
    }
  },

  optionsIcon: {
    marginRight: '0px',
    minWidth: '40px',
  },
  itemIcon: {
    marginRight: '0px',
    minWidth: '40px',
  },

  menuItem: {
    paddingLeft: theme.spacing(0.4), 
    paddingRight: theme.spacing(1),
    marginLeft: theme.spacing(0.2),
    marginTop: theme.spacing(0.2),
    marginBottom: theme.spacing(0.2),
    cursor: 'pointer',
    color: theme.palette.grey[600],
  },
  
  activeMenuItem: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    backgroundColor: ['#fff', '!important'],
  },

  activeColor: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },

  itemText: {
    marginLeft: theme.spacing(1),
  },
}))

const RenderRoot = ({
  panelTop,
  editor,
  content,
  children,
  panelBottom,
  ...props
}) => {

  const classes = getMergedClasses(useStyles(), props.classes)

  return (
    <div
      className={ classes.root }
    >
      {
        panelTop && (
          <div className={ classes.panelTop }>
            { panelTop }
          </div>
        )
      }
      {
        editor && (
          <div className={ classes.editor }>
            { editor }
          </div>
        )
      }
      <div className={ classes.content }>
        { children }
        { content }
      </div>
      {
        panelBottom && (
          <div className={ classes.panelBottom }>
            { panelBottom }
          </div>
        )
      }
    </div>
  )
}

const RendererList = ({
  children,
  ...props
}) => {

  const classes = getMergedClasses(useStyles(), props.classes)

  return (
    <List
      className={ classes.list }
    >
      { children }
    </List> 
  )
}

const RendererChildItems = ({
  open,
  children,
  ...props
}) => {
  const classes = getMergedClasses(useStyles(), props.classes)
  return (
    <Collapse in={ open } timeout="auto" unmountOnExit>
      <div className={ classes.itemChildren }>
        { children }
      </div>
    </Collapse>
  )
}

const RendererItemOptions = ({
  children,
  ...props
}) => {
  const classes = getMergedClasses(useStyles(), props.classes)
  return (
    <ListItemIcon 
      className={ classes.optionsIcon }
      onClick={ eventSink }
    >
      { children }
    </ListItemIcon>
  )
}

const RendererItem = ({
  item,
  itemOptions,
  isCurrentPage,
  isOpen,
  hasChildren,
  withIcons,
  uppercase,
  onClick,
  onRightClick,
  ...props
}) => {
  const classes = getMergedClasses(useStyles(), props.classes)

  const listItemClassname = classnames([classes.menuItem], {
    [classes.activeMenuItem]: isCurrentPage,
  })

  const colorClassname = classnames({
    [classes.activeColor]: isCurrentPage,
  })

  const itemIcon = withIcons ? (
    <ListItemIcon
      className={ classes.itemIcon }
    >
      <ContentIcon
        item={ item }
        className={ colorClassname }
      />
    </ListItemIcon>
  ) : null

  const text = uppercase ?
    item.data.name.toUpperCase() : 
    item.data.name

  return (
    <ListItem
      dense
      className={ listItemClassname }
      selected={ isCurrentPage }
      onClick={ onClick }
      onContextMenu={ onRightClick }
    >
      { itemOptions }
      { itemIcon }
      <ListItemText
        className={ classes.itemText }
        classes={{
          primary: colorClassname
        }}
        primary={ text }
      />
      {
        hasChildren ?
          isOpen ? 
            <ExpandLessIcon className={ colorClassname } /> : 
            <ExpandMoreIcon className={ colorClassname } />
            
        : null
      }
    </ListItem>
  )
}

const renderers = {
  root: RenderRoot,
  list: RendererList,
  childItems: RendererChildItems,
  itemOptions: RendererItemOptions,
  item: RendererItem,
}

const Tree = ({
  section,
  onClick,
  ...props
}) => {
  return (
    <BaseTree
      renderers={ renderers }
      section={ section }
      onClick={ onClick }
      {...props}
    />
  )
}

export default Tree