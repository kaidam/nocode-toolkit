import React, { lazy } from 'react'

import { createStyles, makeStyles } from '@material-ui/core/styles'

import classnames from 'classnames'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import Link from '@nocode-toolkit/website/lib/Link'

import Suspense from '../system/Suspense'
import ContentIcon from './Icon'
import icons from '../../icons'
import itemTypes from '../../types/item'

const ItemOptions = lazy(() => import(/* webpackChunkName: "ui" */ '../buttons/ItemOptions'))

const ExpandMoreIcon = icons.expandMore
const ExpandLessIcon = icons.expandLess

const useStyles = makeStyles(theme => createStyles({
  menuItem: {
    paddingLeft: theme.spacing(0.4), 
    paddingRight: theme.spacing(1),
    marginLeft: theme.spacing(0.2),
    marginTop: theme.spacing(0.2),
    marginBottom: theme.spacing(0.2),
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

const ContentListItem = ({
  item,
  itemRoute,
  isCurrentPage,
  isOpen,
  parentAnchorEl,
  children,
  onClick,
  onContextMenu,
  onMenuOpen,
  onMenuClose,
}) => {
  const classes = useStyles()

  const itemType = itemTypes(item)

  const listItemClassname = classnames([classes.menuItem], {
    [classes.highlightListItemBackground]: isCurrentPage,
    [classes.normalListItemBackground]: !isCurrentPage,
  })

  const colorClassname = classnames({
    [classes.highlightListItem]: isCurrentPage,
    [classes.normalListItem]: !isCurrentPage,
  })

  const listItem = (
    <div
      style={{
        cursor: 'pointer',
      }}
    >
      <ListItem
        dense
        className={ listItemClassname }
        selected={ isCurrentPage }
        onClick={ onClick }
        onContextMenu={ onContextMenu }
      >
        <Suspense>
          <ListItemIcon 
            className={ classes.menuIcon }
            onClick={ (e) => {
              e.preventDefault()
              e.stopPropagation()
              return false
            }}
          >
            <ItemOptions
              item={ item }
              parentAnchorEl={ parentAnchorEl }
              onOpen={ onMenuOpen }
              onClose={ onMenuClose }
            />
          </ListItemIcon>
        </Suspense>
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
          itemType.hasChildren(item) ?
            isOpen ? 
              <ExpandLessIcon className={ colorClassname } /> : 
              <ExpandMoreIcon className={ colorClassname } />
              
          : null
        }
      </ListItem>
      { children }
    </div>
  )

  if(itemType.isLink(item)) {
    return (
      <a
        href={ item.url }
        onContextMenu={ onContextMenu }
        target="_blank"
      >
        { listItem } 
      </a>
    )
  }
  else if(itemType.hasRoute(item) && itemRoute) {
    return (
      <Link
        name={ itemRoute.name }
        onContextMenu={ onContextMenu }
      >
        { listItem }
      </Link>
    )
  }
  else {
    return listItem
  }
}

export default ContentListItem
