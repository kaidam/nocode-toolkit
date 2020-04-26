import React, { lazy, useRef, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

import routerActions from '../../store/modules/router'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import Suspense from '../system/Suspense'
import Link from '../widgets/Link'
import icons from '../../icons'

import eventUtils from '../../utils/events'

const EditableItem = lazy(() => import(/* webpackChunkName: "ui" */ '../content/EditableItem'))

const ExpandMoreIcon = icons.expandMore
const ExpandLessIcon = icons.expandLess

const useStyles = makeStyles(theme => ({
  menuItem: ({depth}) => ({
    paddingLeft: theme.spacing(1) + theme.spacing(depth * 2), 
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
  item,
  showUI,
  folderPages,
  containerRef,
  scrollToCurrentPage,
  onDisableScrollToCurrentPage,
  onToggleFolder,
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

  const dispatch = useDispatch()

  const itemRef = useRef()

  const listItemClassname = classnames({
    [classes.active]: currentPage,
  }, classes.menuItem)

  const colorClassname = classnames({
    [classes.active]: currentPage,
  })

  // scroll to the current element so when the page initially renders
  // we can see the selected item
  useEffect(() => {
    if(!currentPage || !containerRef.current || !scrollToCurrentPage) return
    setTimeout(() => {
      if(!containerRef.current || !itemRef.current) return
      containerRef.current.scrollTop = itemRef.current.offsetTop
    }, 1)
  }, [
    currentPage,
  ])

  const getRenderedItem = (onItemClick, uiMode) => {
    const rawTitle = (
      <ListItemText
        className={ classes.itemText }
        classes={{
          primary: colorClassname
        }}
        primary={ item.node.name }
      />
    )
    const title = uiMode ? (
      <Tooltip
        title="Click to Edit"
        placement="top"
        arrow
      >
        { rawTitle }
      </Tooltip>
    ) : rawTitle
    return (
      <ListItem
        dense
        ref={ itemRef }
        className={ listItemClassname }
        selected={ item.currentPage }
        onClick={ onItemClick }
        onContextMenu={ uiMode ? onItemClick : null }
      >
        { title }
        {
          node.type == 'folder' ?
            open ? 
              <ExpandLessIcon className={ colorClassname } onClick={ eventUtils.cancelEventHandler(onOpenItem) } /> : 
              <ExpandMoreIcon className={ colorClassname } onClick={ eventUtils.cancelEventHandler(onOpenItem) } />
          : null
        }
      </ListItem>
    )
  }

  let linkType = ''
  if(item.node.type == 'link') linkType = 'external'
  else if(item.node.type == 'folder') linkType = folderPages ? 'internal' : ''
  else linkType = 'internal'

  const onClickItem = useCallback(() => {
    onDisableScrollToCurrentPage()

    // if we do not have folder pages - we toggle the
    // folder to show the contents
    if(node.type == 'folder' && !folderPages) {
      onToggleFolder(node.id)  
      return true
    }
    else {
      return false
    }
  }, [
    node,
    folderPages,
    onToggleFolder,
  ])

  const onOpenItem = useCallback(() => {
    const handled = onClickItem()
    if(handled) return
    if(linkType == 'external') {
      window.open(item.node.url)
    }
    else if(linkType == 'internal' && item.route) {
      dispatch(routerActions.navigateTo(item.route.name))
    }
  }, [
    linkType,
    item,
  ])

  if(showUI) {
    return (
      <Suspense>
        <EditableItem
          node={ item.node }
          getRenderedItem={ getRenderedItem }
          autoTooltip={ false }
          onOpen={ onOpenItem }
        />
      </Suspense>
    )
  }

  const renderedItem = getRenderedItem(onClickItem)

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