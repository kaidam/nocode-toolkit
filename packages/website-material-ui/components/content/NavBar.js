import React, { lazy, useMemo, useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import BaseNavBar from '@nocode-toolkit/ui/components/content/NavBar'
import selectors from '@nocode-toolkit/ui/store/selectors'

import MoreVert from '@material-ui/icons/MoreVert'

const useStyles = makeStyles(theme => createStyles({
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
  smallNav: {
    display: 'none',
    [theme.breakpoints.up(theme.layout.largeScreenBreakpoint)]: {
      display: 'none',
    },
    [theme.breakpoints.down(theme.layout.smallScreenBreakpoint)]: {
      display: 'block',
    },
  },
  navUl: {
    listStyleType: 'none',
    margin: '0',
    padding: '0',
    overflow: 'hidden',
    fontSize: '1em',
  },
  navWrapper: {
    float: 'left',
  },
  navItem: {
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
    cursor: 'pointer',
  },
  navActive: {
    color: [theme.palette.primary.main, '!important'],
    backgroundColor: [theme.palette.primary.contrastText, '!important'],
    borderRadius: [theme.spacing(1), '!important'],
  },
  navNormal: {

  },
  navItemLarge: {
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.contrastText,
      borderRadius: theme.spacing(1),
      '& .navbar-ui-icon': {
        color: theme.palette.primary.main,
      },
    },
    '& .navbar-ui-icon': {
      color: theme.palette.primary.main,
    },
  },
  inactiveEditorContainer: {
    '& .navbar-ui-icon': {
      color: theme.palette.primary.contrastText,
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
  menuIcon: {
    minWidth: '40px',
  },
}))

const getMergedClasses = (classes, props, names) => {
  const classOverrides = props.classes || {}
  return names.reduce((all, name) => {
    all[name] = classOverrides[name] || classes[name]
    return all
  }, {})
}

const eventSink = (e) => {
  e.preventDefault()
  e.stopPropagation()
  return false
}

const RenderRoot = ({
  navbar,
  editor,
}) => {
  const classes = useStyles()
  return (
    <div className={ classes.root }>
      <div className={ classes.content }>
        { navbar }
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

const RenderNavbarLarge = ({
  children,
}) => {
  const classes = useStyles()
  return (
    <nav>
      <ul className={ classes.navUl }>
        { children }
      </ul>
    </nav>
  )
}

const RenderNavbarSmall = ({
  children,
  props,
}) => {
  const classes = useStyles()

  const route = useSelector(selectors.router.route)

  const [ anchorEl, setAnchorEl ] = useState(null)
  const handleMenu = useCallback((event) => setAnchorEl(event.currentTarget), [])
  const handleClose = useCallback((event) => setAnchorEl(null), [])
  const open = Boolean(anchorEl)

  const useClasses = getMergedClasses(classes, props, [
    'smallNavButton',
  ])

  useEffect(() => {
    setAnchorEl(null)
  }, [route])

  return (
    <div>
      <IconButton
        aria-owns={ open ? 'menu-appbar' : null }
        aria-haspopup="true"
        onClick={ handleMenu }
      >
        <MoreVert className={ useClasses.smallNavButton } />
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
  )
}

const RenderItem = ({
  item,
  editor,
  isCurrent,
  linkProps,
  LinkComponent,
  className,
  editorContainerClassName,
  props,
  withHighlight,
}) => {

  const classes = useStyles()
  const useClasses = getMergedClasses(classes, props, [
    'navActive',
    'navNormal',
  ])

  const highLightClassName = isCurrent && withHighlight ? `${className} ${useClasses.navActive}` : `${className} ${useClasses.navNormal}`

  return (
    <LinkComponent
      className={ highLightClassName }
      {...linkProps}
    >
      <span className={ editorContainerClassName }>
        { editor }
      </span>
      { item.data.name }
    </LinkComponent>
  )
}

const RenderItemLarge = ({
  item,
  editor,
  isCurrent,
  linkProps,
  LinkComponent,
  props,
}) => {
  const classes = useStyles()
  
  const useClasses = getMergedClasses(classes, props, [
    'navWrapper',
    'navItem',
    'navItemLarge',
  ])

  const editorContainerClassName = isCurrent ? '' : useClasses.inactiveEditorContainer
    
  return (
    <li
      className={ useClasses.navWrapper }
    >
      <RenderItem
        item={ item }
        editor={ editor }
        isCurrent={ isCurrent }
        linkProps={ linkProps }
        LinkComponent={ LinkComponent }
        className={ `${useClasses.navItem} ${useClasses.navItemLarge}` }
        editorContainerClassName={ editorContainerClassName }
        props={ props }
        withHighlight
      />
    </li>
  )
}

const RenderItemSmall = ({
  item,
  editor,
  isCurrent,
  linkProps,
  LinkComponent,
  props,
}) => {
  const classes = useStyles()
  const useClasses = getMergedClasses(classes, props, [
    'navItem',
    'navItemSmall',
  ])

  return (
    <MenuItem>
      <RenderItem
        item={ item }
        editor={ editor }
        isCurrent={ isCurrent }
        linkProps={ linkProps }
        LinkComponent={ LinkComponent }
        className={ `${useClasses.navItem} ${useClasses.navItemSmall}` }
        props={ props }
      />
    </MenuItem>
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

const renderersLarge = {
  root: RenderRoot,
  navbar: RenderNavbarLarge,
  item: RenderItemLarge,
  itemOptions: RendererItemOptions,
}

const renderersSmall = {
  root: RenderRoot,
  navbar: RenderNavbarSmall,
  item: RenderItemSmall,
  itemOptions: RendererItemOptions,
}

const NavBar = ({
  section,
  withHome,
  ...props
}) => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <div className={ classes.largeNav }>
        <BaseNavBar
          section={ section }
          withHome={ withHome }
          renderers={ renderersLarge }
          {...props}
        />
      </div>
      <div className={ classes.smallNav }>
        <BaseNavBar
          section={ section }
          withHome={ withHome }
          renderers={ renderersSmall }
          {...props}
        />
      </div>
    </React.Fragment>
    
  )
}

export default NavBar