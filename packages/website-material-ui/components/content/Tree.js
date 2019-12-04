import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import BaseTree from '@nocode-toolkit/ui/components/content/Tree'
import ContentIcon from '@nocode-toolkit/ui/components/content/Icon'

import icons from '@nocode-toolkit/ui/icons'

const ExpandMoreIcon = icons.expandMore
const ExpandLessIcon = icons.expandLess

const useStyles = makeStyles(theme => createStyles({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  menu: {
    overflowY: 'auto',
    overflowX: 'hidden',
    flexGrow: 1,
  },
  sectionEditor: {
    flexGrow: 0,
    borderBottom: '1px solid #ccc',
    padding: theme.spacing(1),
  },
  sublist: {
    paddingLeft: theme.spacing(1.5),
    '& > ul': {
      paddingTop: ['0px', '!important'],
      paddingBottom: ['0px', '!important'],
    }
  },
  menuItem: {
    paddingLeft: theme.spacing(0.4), 
    paddingRight: theme.spacing(1),
    marginLeft: theme.spacing(0.2),
    marginTop: theme.spacing(0.2),
    marginBottom: theme.spacing(0.2),
    cursor: 'pointer',
  },
  menuIcon: {
    marginRight: '0px',
    minWidth: '40px',
  },
  normalListItem: {
    color: theme.palette.grey[600],
  },
  highlightListItem: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  highlightListItemBackground: {
    border: [`1px dotted ${theme.palette.primary.main}`, '!important'],
    backgroundColor: ['#fff', '!important'],
    borderTopLeftRadius: '35px',
    borderBottomLeftRadius: '35px',
  },
  normalListItemBackground: {
    border: [`1px solid #fff`, '!important'],
    borderTopLeftRadius: '35px',
    borderBottomLeftRadius: '35px',
  },
}))

const eventSink = (e) => {
  e.preventDefault()
  e.stopPropagation()
  return false
}

const RenderRoot = ({
  content,
  editor,
}) => {
  const classes = useStyles()

  return (
    <div
      className={ classes.root }
    >
      {
        editor && (
          <div className={ classes.sectionEditor }>
            { editor }
          </div>
        )
      }
      <div className={ classes.menu }>
        { content }
      </div>
    </div>
  )
}

const RendererList = ({
  children,
}) => {
  return (
    <List>
      { children }
    </List> 
  )
}

const RendererChildItems = ({
  open,
  children,
}) => {
  const classes = useStyles()
  return (
    <Collapse in={ open } timeout="auto" unmountOnExit>
      <div className={ classes.sublist }>
        { children }
      </div>
    </Collapse>
  )
}

const RendererItemOptions = ({
  children,
}) => {
  const classes = useStyles()
  return (
    <ListItemIcon 
      className={ classes.menuIcon }
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
  onClick,
  onRightClick,
}) => {
  const classes = useStyles()

  const listItemClassname = classnames([classes.menuItem], {
    [classes.highlightListItemBackground]: isCurrentPage,
    [classes.normalListItemBackground]: !isCurrentPage,
  })

  const colorClassname = classnames({
    [classes.highlightListItem]: isCurrentPage,
    [classes.normalListItem]: !isCurrentPage,
  })

  return (
    <ListItem
      dense
      className={ listItemClassname }
      selected={ isCurrentPage }
      onClick={ onClick }
      onContextMenu={ onRightClick }
    >
      { itemOptions }
      <ListItemIcon
        className={ classes.menuIcon }
      >
        <ContentIcon
          item={ item }
          className={ colorClassname }
        />
      </ListItemIcon>
      <ListItemText
        classes={{
          primary: colorClassname
        }}
        primary={ item.data.name }
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
}) => {
  return (
    <BaseTree
      renderers={ renderers }
      section={ section }
      onClick={ onClick }
    />
  )
}

export default Tree