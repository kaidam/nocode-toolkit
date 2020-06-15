import React, { lazy, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import contentSelectors from '../../store/selectors/content'
import systemSelectors from '../../store/selectors/system'
import Suspense from '../system/Suspense'

import NavBarItem from './NavBarItem'
import NavBarDropdown from './NavBarDropdown'

const NavBarDropdownUI = lazy(() => import(/* webpackChunkName: "ui" */ './NavBarDropdownUI'))
const DraggableNavBar = lazy(() => import(/* webpackChunkName: "ui" */ './DraggableNavBar'))

import icons from '../../icons'

const MoreVertIcon = icons.moreVert

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
  withHome,

  // the name of the section this navbar is for
  section,
}) => {

  const classes = useStyles({
    contrast,
    vertical,
  })

  const treeSelector = useMemo(contentSelectors.sectionTree, [])
  const tree = useSelector(state => treeSelector(state, section))
  const homeItem = useSelector(contentSelectors.homeSingletonItem)
  const showUI = useSelector(systemSelectors.showUI)

  const navbarItems = useMemo(() => {
    if(!withHome || !homeItem) return tree
    return [homeItem].concat(tree)
  }, [
    tree,
    withHome,
    homeItem,
  ])

  if(small) {
    const getButton = useCallback((onClick) => {
      return (
        <IconButton
          size="small"
          className={ classes.iconButton }
          onClick={ onClick }
        >
          <MoreVertIcon className={ classes.icon } fontSize="inherit" />
        </IconButton>
      )
    }, [
      classes,
    ])

    if(showUI) {
      return (
        <Suspense>
          <NavBarDropdownUI
            children={ navbarItems }
            getButton={ getButton }
          />
        </Suspense>
      )
    }
    else {
      return (
        <NavBarDropdown
          children={ navbarItems }
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
          node={ node }
          contrast={ contrast }
          vertical={ vertical }
          align={ align }
        />
      )
    }, [
      showUI,
      contrast,
      vertical,
      align, 
    ])

    return showUI ? (
      <Suspense>
        <DraggableNavBar
          section={ section }
          items={ navbarItems }
          contrast={ contrast }
          vertical={ vertical }
          align={ align }
          getNavbarItem={ getNavbarItem }
        />
      </Suspense>
    ) : (
      <nav>
        <ul className={ classes.navbar }>
          {
            navbarItems.map(getNavbarItem)
          }
        </ul>
      </nav>
    )
  }  
}

export default NavBar