import React, { lazy, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import classnames from 'classnames'

import contentSelectors from '../../store/selectors/content'
import systemSelectors from '../../store/selectors/system'
import Suspense from '../system/Suspense'

import NavBarItem from './NavBarItem'
import NavBarDropdown from './NavBarDropdown'

const NavBarDropdownUI = lazy(() => import(/* webpackChunkName: "ui" */ './NavBarDropdownUI'))
const DraggableNavBar = lazy(() => import(/* webpackChunkName: "ui" */ './DraggableNavBar'))

import icons from '../../icons'

const MenuIcon = icons.menu

const useStyles = makeStyles(theme => {
  return {
    navbar: {
      listStyleType: 'none',
      margin: '0',
      padding: '0',
      overflow: 'hidden',
      fontSize: '1em',
      textAlign: 'right',
    },
    iconButton: ({vertical}) => ({
      marginLeft: theme.spacing(vertical ? 0 : 1),
    }),
    icon: ({contrast}) => ({
      fontSize: '1.4em',
      color: contrast ?
        theme.palette.primary.contrastText :
        theme.palette.primary.main,
    }),
  }
})

const NavBar = ({

  // if true - then we render the entire navbar into a single
  // menu - this is for small screens
  small,

  contrast,
  vertical,
  align,
  float,

  // the name of the section this navbar is for
  section,
  items,
  editable,
  isItemActive,
}) => {

  const classes = useStyles({
    contrast,
    vertical,
  })

  const treeSelector = useMemo(contentSelectors.sectionTree, [])
  const navbarItems = useSelector(state => treeSelector(state, section))
  const showUI = useSelector(systemSelectors.showUI)

  const useNavbarItems = useMemo(() => {
    return items ? items : navbarItems
  }, [
    items,
    navbarItems,
  ])

  if(small) {
    const getButton = useCallback((onClick) => {
      return (
        <IconButton
          size="small"
          className={ classnames('nocode-navbar-open-button', classes.iconButton) }
          onClick={ onClick }
        >
          <MenuIcon className={ classnames('nocode-navbar-open-button-icon', classes.icon) } fontSize="inherit" />
        </IconButton>
      )
    }, [
      classes,
    ])

    if(showUI) {
      return (
        <Suspense>
          <NavBarDropdownUI
            children={ useNavbarItems }
            getButton={ getButton }
          />
        </Suspense>
      )
    }
    else {
      return (
        <NavBarDropdown
          children={ useNavbarItems }
          getButton={ getButton }
        />
      )
    }
    
  }
  else {

    const getNavbarItem = useCallback((node, i) => {
      return (
        <NavBarItem
          key={ i }
          showUI={ showUI }
          editable={ editable }
          node={ node }
          contrast={ contrast }
          vertical={ vertical }
          align={ align }
          float={ float }
          isItemActive={ isItemActive }
        />
      )
    }, [
      showUI,
      editable,
      contrast,
      vertical,
      align,
      float,
      isItemActive,
    ])

    return showUI && editable ? (
      <Suspense>
        <DraggableNavBar
          section={ section }
          items={ useNavbarItems }
          contrast={ contrast }
          vertical={ vertical }
          align={ align }
          float={ float }
          getNavbarItem={ getNavbarItem }
        />
      </Suspense>
    ) : (
      <nav className={ classnames('nocode-navbar-nav') }>
        <ul className={ classnames('nocode-navbar-ul', classes.navbar) }>
          {
            useNavbarItems.map(getNavbarItem)
          }
        </ul>
      </nav>
    )
  }  
}

export default NavBar