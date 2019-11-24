import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import icons from '../../icons'
import library from '../../types/library'

const AddIcon = icons.add

const useStyles = makeStyles(theme => createStyles({
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


const FinderGrid = ({
  driver,
  items,
  addFilter,
  onOpenFolder,
  onAddContent,
}) => {

  const classes = useStyles()
  const finderSchema = library.get([driver, 'finder'].join('.'))

  return (
    <div className={ classes.root }>
      <GridList
        cellHeight={ 180 }
        className={ classes.gridList }
        cols={ 4 }
      >
        {
          items.map((item, i) => {

            const isFolder = finderSchema.finder.isFolder(item)
            const thumbnail = finderSchema.finder.getItemThumbnail(item)
            const itemTitle = finderSchema.finder.getItemTitle(item)
            const itemSubtitle = finderSchema.finder.getItemSubtitle(item)
            const itemData = finderSchema.finder.getItemAdditionalData(item)

            return (
              <GridListTile
                key={ i }
                className={ classes.gridTile }
                onClick={ (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if(isFolder) {
                    onOpenFolder(item.id)
                  }
                  else {
                    onAddContent({id:item.id, data:itemData})
                  }
                }}
              >
                <img src={ thumbnail } alt={ 'test' } />
                <GridListTileBar
                  title={itemTitle}
                  subtitle={itemSubtitle}
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

export default FinderGrid
