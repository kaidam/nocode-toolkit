import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import LayoutCard from '../widgets/LayoutCard'

const useStyles = makeStyles(theme => ({
  root: {
    
  },
  card: {
    margin: theme.spacing(2),
  }
}))

const LayoutLibrary = ({
  selected,
  layouts,
  onSelect,
}) => {

  const classes = useStyles()
  
  return (
    <div className={ classes.root }>
      {
        Object.keys(layouts).map(key => {
          return (
            <div className={ classes.card } key={ key }>
              <LayoutCard
                id={ key }
                data={ layouts[key] }
                isSelected={ selected ? key == selected : false }
                greyBg
                onSelect={ onSelect }
              />
            </div>
          )
        })
      }
    </div>
  )
}

export default LayoutLibrary