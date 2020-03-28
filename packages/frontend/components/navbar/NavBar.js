import React, { useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import contentSelectors from '../../store/selectors/content'

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

  // the name of the section this navbar is for
  section,

  // the suspended component we use to render the item
  // options - this gives control to the template
  // as to what the tree item menu does
  ItemEditorComponent,

  // when an item is clicked - run this function
  onClick,
}) => {

  const classes = useStyles({
    contrast,
  })

  const treeSelector = useMemo(contentSelectors.sectionTree, [])
  const tree = useSelector(state => treeSelector(state, section))

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
        children={ tree }
        ItemEditorComponent={ ItemEditorComponent }
        getButton={ getButton }
      />
    )
  }
  else {
    return (
      <nav>
        <ul className={ classes.navbar }>
          {
            tree.map((item, i) => {
              return (
                <NavBarItem
                  key={ i }
                  item={ item }
                  ItemEditorComponent={ ItemEditorComponent }
                  contrast={ contrast }
                  vertical={ vertical }
                  align={ align }
                  onClick={ onClick }
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