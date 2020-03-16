import React, { lazy, useCallback } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import Suspense from '../system/Suspense'
import Link from '../widgets/Link'
import icons from '../../icons'

const ExpandMoreIcon = icons.expandMore
const ExpandLessIcon = icons.expandLess

const useStyles = makeStyles(theme => ({
  menuItem: ({depth}) => ({
    paddingLeft: theme.spacing(depth * 2), 
    paddingRight: theme.spacing(1),
    marginLeft: theme.spacing(0.2),
    marginTop: theme.spacing(0.2),
    marginBottom: theme.spacing(0.2),
    cursor: 'pointer',
    color: theme.palette.grey[600],
  }),
  itemText: {
    marginLeft: theme.spacing(1),
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  link: {
    textDecoration: 'none',
  },
}))

const TreeItem = ({
  ItemEditorComponent,
  item,
  folderPages,
  onToggleFolder,
  onClick,
}) => {

  const {
    depth,
    open,
    currentPage,
    node,
  } = item

  const classes = useStyles({
    depth,
  })

  const listItemClassname = classnames({
    [classes.active]: currentPage,
  }, classes.menuItem)

  const colorClassname = classnames({
    [classes.active]: currentPage,
  })

  const onClickItem = useCallback(() => {
    // if we do not have folder pages - we toggle the
    // folder to show the contents
    if(node.type == 'folder' && !folderPages) {
      onToggleFolder(node.id)  
    }
    else if(onClick) {
      onClick()
    }
  }, [
    node,
    folderPages,
    onToggleFolder,
    onClick,
  ])

  const renderedItem = (
    <ListItem
      dense
      className={ listItemClassname }
      selected={ item.currentPage }
      onClick={ onClickItem }
    >
      {
        ItemEditorComponent && (
          <Suspense
            Component={ ItemEditorComponent }
            props={{
              item,
            }}
          /> 
        )
      }
      <ListItemText
        className={ classes.itemText }
        classes={{
          primary: colorClassname
        }}
        primary={ item.node.name }
      />
      {
        node.type == 'folder' ?
          open ? 
            <ExpandLessIcon className={ colorClassname } /> : 
            <ExpandMoreIcon className={ colorClassname } />
        : null
      }
    </ListItem>
  )

  let linkType = ''
  if(item.node.type == 'externalLink') linkType = 'external'
  else if(item.node.type == 'folder') linkType = folderPages ? 'internal' : ''
  else linkType = 'internal'

  if(linkType == 'external') {
    return (
      <Link
        url={ item.node.url }
        className={ classes.link }
      >
        { renderedItem }
      </Link>
    )
  }
  else if(linkType == 'internal' && item.route) {
    return (
      <Link
        path={ item.route.path }
        name={ item.route.name }
        className={ classes.link }
      >
        { renderedItem }
      </Link>
    )
  }
  else {
    return renderedItem
  }
}

export default TreeItem