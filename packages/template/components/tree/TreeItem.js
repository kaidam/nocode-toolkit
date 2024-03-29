import React, { lazy, useRef, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

import routerActions from '../../store/modules/router'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import settingsSelectors from '../../store/selectors/settings'

import colorUtils from '../../utils/color'
import Suspense from '../system/Suspense'
import Link from '../widgets/Link'
import icons from '../../icons'

import {
  hasMouse,
} from '../../utils/browser'
import eventUtils from '../../utils/events'

const EditableItem = lazy(() => import(/* webpackChunkName: "ui" */ '../content/EditableItem'))
const TreeItemButton = lazy(() => import(/* webpackChunkName: "ui" */ './TreeItemButton'))

const FocusElementOverlay = lazy(() => import(/* webpackChunkName: "ui" */ '../widgets/FocusElementOverlay'))

const ExpandMoreIcon = icons.expandMore
const ExpandLessIcon = icons.expandLess
const RightIcon = icons.right

const useStyles = makeStyles(theme => ({
  menuItem: ({depth, active, isHovered}) => ({
    paddingLeft: theme.spacing(depth * 2), 
    paddingRight: theme.spacing(1),
    marginLeft: theme.spacing(0.2),
    marginTop: theme.spacing(0.2),
    marginBottom: theme.spacing(0.2),
    cursor: 'pointer',
    color: theme.palette.grey[600],
    backgroundColor: active ? [colorUtils.getAlpha(theme.palette.primary.main, isHovered ? 0.2 : 0.1), '!important'] : '',
    '&:hover': {
      backgroundColor: colorUtils.getAlpha(theme.palette.primary.main, 0.2),
    }
  }),
  itemText: {
    marginLeft: theme.spacing(1),
  },
  active: {
    color: theme.palette.primary.main,
    //fontWeight: 'bold',
  },
  link: {
    textDecoration: 'none',
  },
  nonFolderIcon: {
    opacity: 0,
  },
}))

const NonFolderIcon = ({
  className,
}) => {
  return (
    <RightIcon
      className={ className }
    />
  )
}

const TreeItem = ({
  node,
  depth,
  open,
  showUI, 
  containerRef,
  scrollToCurrentPage,
  onDisableScrollToCurrentPage,
  onToggleFolder,
  onClick,
}) => {

  const settings = useSelector(settingsSelectors.settings)
  const folderPages = settings.folderPages === true || settings.folderPages === "yes"

  const [ isHovered, setIsHovered ] = useState(null)
  const [ isMenuOpen, setIsMenuOpen ] = useState(false)

  const onLeave = () => {
    if(isHovered) clearInterval(isHovered)
    setIsHovered(null)
  }

  const onHover = (e) => {
    if(isHovered) clearInterval(isHovered)
    e.persist()
    const parentElement = e.target.parentElement
    if(parentElement) {
      const intervalId = setInterval(() => {
        if(!parentElement.querySelector(':hover')) {
          clearInterval(intervalId)
          setIsHovered(null)
        }
      }, 100)
      setIsHovered(intervalId)
    }
  }

  const onOpenMenu = useCallback(() => {
    setIsMenuOpen(true)
  })

  const onCloseMenu = useCallback(() => {
    setIsMenuOpen(false)
    onLeave()
  }, [
    onLeave,
  ])

  const classes = useStyles({
    depth,
    isHovered: isHovered ? true : false,
    active: node.currentPage,
  })

  const dispatch = useDispatch()

  const itemRef = useRef()

  const listItemClassname = classnames({
    [classes.active]: node.currentPage,
    'nocode-tree-item': true,
    'nocode-tree-item-active': node.currentPage,
  }, classes.menuItem)

  const colorClassname = classnames({
    [classes.active]: node.currentPage,
  })

  // scroll to the current element so when the page initially renders
  // we can see the selected item
  useEffect(() => {
    if(!node.currentPage || !containerRef.current || !scrollToCurrentPage) return
    setTimeout(() => {
      if(!containerRef.current || !itemRef.current) return
      containerRef.current.scrollTop = itemRef.current.offsetTop
    }, 1)
  }, [
    node.currentPage,
  ])

  let rightIcon = null

  if(node.type == 'folder') {
    let FolderIcon = null
    if(folderPages) FolderIcon = RightIcon
    else {
      FolderIcon = open ?
        ExpandLessIcon :
        ExpandMoreIcon
    }
    rightIcon = (
      <FolderIcon
        className={ colorClassname }
        onClick={ (e) => {
          eventUtils.cancelEvent(e)
          onOpenItem()
        }}
      />
    )
  }
  else if(showUI) {
    rightIcon = (
      <NonFolderIcon
        className={ classes.nonFolderIcon }
      />
    )
  }

  let linkType = ''
  if(node.type == 'link') {
    linkType = node.url.indexOf('code:') == 0 ? 'code' : 'external'
  }
  else if(node.type == 'folder') linkType = folderPages ? 'internal' : ''
  else linkType = 'internal'

  const onClickItem = useCallback(() => {
    const isFolderToggle = node.type == 'folder' && !folderPages
    if(onClick) onClick({
      isFolderToggle,
    })
    onDisableScrollToCurrentPage()
    // if we do not have folder pages - we toggle the
    // folder to show the contents
    if(isFolderToggle) {
      onToggleFolder(node.id)  
      return true
    }
    else {
      return false
    }
  }, [
    onClick,
    node,
    folderPages,
    onToggleFolder,
  ])

  const onOpenItem = useCallback(() => {
    const handled = onClickItem()
    if(handled) return
    if(linkType == 'external') {
      window.open(node.url)
    }
    else if(linkType == 'code') {
      const code = node.url.replace(/^code:/, '')
      eval(code)
    }
    else if(linkType == 'internal' && node.route) {
      dispatch(routerActions.navigateTo(node.route.name))
    }
  }, [
    linkType,
    node,
    onClickItem,
  ])

  const getRenderedItem = (onItemClick) => {
    return (
      <>
        <ListItem
          dense
          ref={ itemRef }
          className={ listItemClassname }
          selected={ node.currentPage }
          onMouseEnter={ onHover }
          onMouseLeave={ onLeave }
          onClick={ onItemClick }
        >
          <ListItemText
            className={ classnames('nocode-tree-text', classes.itemText) }
            classes={{
              primary: colorClassname
            }}
            primary={ node.name }
          />
          {
            (showUI && hasMouse() && (isHovered || isMenuOpen)) ? (
              <Suspense>
                <TreeItemButton
                  node={ node }
                  isOpen={ open }
                  onOpenItem={ onOpenItem }
                  onOpen={ onOpenMenu }
                  onClose={ onCloseMenu }
                />
              </Suspense>
            ) : (
              rightIcon
            )
          }
        </ListItem>
        {
          isMenuOpen && (
            <Suspense>
              <FocusElementOverlay
                contentRef={ itemRef }
                padding={{
                  top: 4,
                  bottom: 4,
                  right: 2,
                  left: 6,
                }}
              />
            </Suspense>
          )
        }
      </>
    )
  }

  if(showUI && !hasMouse()) {
    return (
      <Suspense>
        <EditableItem
          clickPositioning
          clickOffset={{
            x: 25,
            y: 0,
          }}
          node={ node }
          isOpen={ open }
          getRenderedItem={ getRenderedItem }
          autoTooltip={ false }
          onOpenItem={ onOpenItem }
          onOpenMenu={ onOpenMenu }
          onCloseMenu={ onCloseMenu }
        />
      </Suspense>
    )
  }

  const renderedItem = getRenderedItem(onClickItem)

  if(linkType == 'external') {
    return (
      <Link
        url={ node.url }
        className={ classes.link }
      >
        { renderedItem }
      </Link>
    )
  }
  else if(linkType == 'code') {
    return (
      <Link
        url="#"
        className={ classes.link }
        onClick={(e) => {
          eventUtils.cancelEvent(e)
          const code = node.url.replace(/^code:/, '')
          eval(code)
        }}
      >
        { renderedItem }
      </Link>
    )
  }
  else if(linkType == 'internal' &&  node.route) {
    return (
      <Link
        path={ node.route.path }
        name={ node.route.name }
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