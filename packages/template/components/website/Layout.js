import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'

import LayoutCard from '../widgets/LayoutCard'

const useStyles = makeStyles(theme => ({
 
}))

const SettingsLayout = ({
  greyBg,
  selected,
  layouts,
  onSelect,
}) => {

  const classes = useStyles()
  
  return (
    <Grid
      container
      spacing={ 4 }
      justify="center"
      alignItems="stretch"
    >
      {
        Object.keys(layouts).map(key => {
          return (
            <Grid key={ key } item xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 }>
              <LayoutCard
                id={ key }
                data={ layouts[key] }
                isSelected={ key == selected }
                greyBg={ greyBg }
                onSelect={ onSelect }
              />
            </Grid>
          )
        })
      }
    </Grid>
  )
}

export default SettingsLayout