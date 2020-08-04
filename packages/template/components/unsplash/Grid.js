import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import icons from '../../icons'

const AddIcon = icons.add

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
  },
  gridTile: {
    cursor: 'pointer',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}))


const UnsplashGrid = ({
  items,
  onSelectItem,
}) => {

  const classes = useStyles()

  if(!items || items.length <= 0) {
    return (
      <div className={ classes.root }>
        <Typography variant="body1">
          Enter a search query to find images to add...
        </Typography>
      </div>
    )
  }

  return (
    <div className={ classes.root }>
      <GridList
        cellHeight={ 180 }
        className={ classes.gridList }
        cols={ 4 }
      >
        {
          items.map((item, i) => {
            return (
              <GridListTile
                key={ i }
                className={ classes.gridTile }
                onClick={ (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onSelectItem(item)
                }}
              >
                <img src={ item.urls.thumb } alt={ 'test' } />
                <GridListTileBar
                  title={ `by: ${item.user.name}` }
                  subtitle={ item.user.location || ' ' }
                  actionIcon={
                    <IconButton className={ classes.icon }>
                      <AddIcon />
                    </IconButton>
                  }
                />
              </GridListTile>
            )
          })
        }
      </GridList>
    </div>
  )
}

export default UnsplashGrid
