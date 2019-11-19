import React, { lazy, useMemo, useState, useCallback } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import MoreVert from '@material-ui/icons/MoreVert'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import Link from '@nocode-toolkit/website/lib/Link'

import Suspense from '../system/Suspense'

import itemTypes from '../../types/item'
import selectors from '../../store/selectors'

const ItemOptions = lazy(() => import(/* webpackChunkName: "ui" */ '../buttons/ItemOptions'))
const SectionEditor = lazy(() => import(/* webpackChunkName: "ui" */ '../buttons/SectionEditor'))

const useStyles = makeStyles(theme => createStyles({
  root: {
    padding: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  menu: {
    flexGrow: 0,
  },
  sectionEditor: {
    flexGrow: 0,
  },
  ui: {
    flexGrow: 1,
  },
  navNormal: {

  },
  navActive: {
    color: [theme.palette.primary.main, '!important'],
    backgroundColor: [theme.palette.primary.contrastText, '!important'],
    borderRadius: [theme.spacing(1), '!important'],
    '& .linkbar-ui-icon': {
      color: [theme.palette.primary.main, '!important'],
    },
  },
  editorListIcon: {
    minWidth: '10px',
    marginRight: '10px',
  },
  largeNav: {
    display: 'none',
    [theme.breakpoints.up(theme.layout.largeScreenBreakpoint)]: {
      display: 'block',
    },
    [theme.breakpoints.down(theme.layout.smallScreenBreakpoint)]: {
      display: 'none',
    },
  },
  navUl: {
    listStyleType: 'none',
    margin: '0',
    padding: '0',
    overflow: 'hidden',
    fontSize: '1em',
  },
  navLi: {
    float: 'left',
  },
  navLiA: {
    ...theme.typography.button,
    display: 'block',
    fontWeight: '500',
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginRight: theme.spacing(1),
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.contrastText,
      borderRadius: theme.spacing(1),
      '& .linkbar-ui-icon': {
        color: theme.palette.primary.main,
      },
    },
    '& .linkbar-ui-icon': {
      color: theme.palette.primary.contrastText,
    },
    cursor: 'pointer',
  },
  smallNav: {
    display: 'none',
    [theme.breakpoints.up(theme.layout.largeScreenBreakpoint)]: {
      display: 'none',
    },
    [theme.breakpoints.down(theme.layout.smallScreenBreakpoint)]: {
      display: 'block',
    },
  },
  smallNavButton: {
    color: theme.palette.primary.contrastText,
  },
  smallNavA: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
    cursor: 'pointer',
  },
}))

const isLink = (item) => {
  if(item.id == 'home') return false
  const itemType = itemTypes(item)
  return itemType.isLink(item)
}

const NavBarPageLink = ({
  item,
  className,
  plainColors = false,
}) => {
  const classes = useStyles()
  const route = useSelector(selectors.router.route)

  let isCurrent = route.item == item.id
  if(route.name == 'root' && item.id == 'home') isCurrent = true
  
  const highLightClassName = isCurrent && !plainColors ? `${className} ${classes.navActive}` : `${className} ${classes.navNormal}`

  const editor = useMemo(() => (
    <Suspense>
      <ListItemIcon 
        className={ classes.editorListIcon }
        onClick={ (e) => {
          e.preventDefault()
          e.stopPropagation()
          return false
        }}
      >
        <ItemOptions
          item={ item }
          iconClassName={ plainColors ? '' : 'linkbar-ui-icon' }
        />
      </ListItemIcon>
    </Suspense>
  ), [item])

  return isLink(item) ? (
    <a
      href={ item.url }
      className={ highLightClassName }
      target="_external"
    >
      { editor }
      { item.data.name }
    </a>
  ) : (
    <Link
      path={ item.url }
      className={ highLightClassName }
    >
      { editor }
      { item.data.name }
    </Link>
  )
}

const NavBarLarge = ({
  items,
}) => {
  const classes = useStyles()
  return (
    <nav className={ classes.largeNav }>
      <ul className={ classes.navUl }>
        {
          items.map((item, i) => {
            return (
              <li
                key={ i }
                className={ classes.navLi }
              >
                <NavBarPageLink
                  item={ item }
                  className={ classes.navLiA }
                />
              </li>
            )
          })
        }
      </ul>
    </nav>
  )
}

const NavBarSmall = ({
  items,
}) => {
  const classes = useStyles()

  const [ anchorEl, setAnchorEl ] = useState(null)
  const handleMenu = useCallback((event) => setAnchorEl(event.currentTarget), [])
  const handleClose = useCallback((event) => setAnchorEl(null), [])
  const open = Boolean(anchorEl)

  return (
    <div className={ classes.smallNav }>
      <IconButton
        aria-owns={ open ? 'menu-appbar' : null }
        aria-haspopup="true"
        onClick={ handleMenu }
      >
        <MoreVert className={ classes.smallNavButton } />
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
        {
          items.map((item, i) => {
            return (
              <MenuItem
                key={ i }
              >
                <NavBarPageLink
                  plainColors
                  item={ item }
                  className={ classes.navLiA }
                />
              </MenuItem>
            )
          })
        }
      </Menu>
    </div>
  )
}

const NavBar = ({
  section,
  withHome,
  children,
}) => {
  const classes = useStyles()
  const sectionList = useSelector(state => selectors.content.sectionList(state, section))

  const sectionFilter = useCallback((parentFilter, schemaDefinition) => {
    if(parentFilter.indexOf('section') < 0) return false
    if(schemaDefinition.metadata.hasChildren) return false
    return true
  }, [])

  const items = useMemo(() => {
    return withHome ?
      [{
        id: 'home',
        location: {
          type: 'section',
          id: section,
        },
        data: {
          name: 'Home',
        },
        url: '/',
      }].concat(sectionList) :
      sectionList
  }, [withHome, sectionList])

  return (
    <div className={ classes.root }>
      <div className={ classes.ui }>
        { children }
      </div>
      <div className={ classes.menu }>
        <NavBarLarge items={ items } />
        <NavBarSmall items={ items } />
      </div>
      <Suspense>
        <div className={ classes.sectionEditor }>
          <SectionEditor
            id={ section }
            filter={ sectionFilter }
            location={ `section:${section}` }
            structure="list"
            tiny
          />
        </div>
      </Suspense>
    </div>
  )
}

export default NavBar
