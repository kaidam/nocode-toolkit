import React, { useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import contentSelectors from '../../store/selectors/content'
import routerSelectors from '../../store/selectors/router'
import systemSelectors from '../../store/selectors/system'

import NavBarItem from './NavBarItem'
import NavBarMenu from './NavBarMenu'

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
    icon: ({contrast} = {}) => ({
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
  })

  const treeSelector = useMemo(contentSelectors.sectionTree, [])
  const tree = useSelector(state => treeSelector(state, section))
  const homeItem = useSelector(contentSelectors.homeItem)
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
          className={ classes.icon }
          onClick={ onClick }
        >
          <MoreVertIcon fontSize="inherit" />
        </IconButton>
      )
    }, [])

    return (
      <NavBarMenu
        children={ navbarItems }
        showUI={ showUI }
        getButton={ getButton }
      />
    )
  }
  else {
    return (
      <nav>
        <ul className={ classes.navbar }>
          {
            navbarItems.map((item, i) => {
              return (
                <NavBarItem
                  key={ i }
                  showUI={ showUI }
                  item={ item }
                  contrast={ contrast }
                  vertical={ vertical }
                  align={ align }
                />
              )
            })
          }
        </ul>
      </nav>
    )
  }

  
}

export default NavBar