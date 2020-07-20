import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import contentActions from '../../../store/modules/content'
import websiteSelectors from '../../../store/selectors/website'

import icons from '../../../icons'

const HomeIcon = icons.home

const MakeHomepage = ({
  values,
  item,
}) => {

  const dispatch = useDispatch()

  const homepage = useSelector(websiteSelectors.homepage)
  
  const setHomepage = () => {
    dispatch(contentActions.changeHomepage({
      content_id: values.id,
    }))
  }

  const isHomepage = homepage && homepage == values.id

  return (
    <Grid container spacing={ 2 }>
      {
        !isHomepage && (
          <Grid item xs={ 12 } sm={ 12 }>
            <Button
              variant="contained"
              color="default"
              disabled={ isHomepage }
              onClick={ setHomepage }
            >
              Make this the homepage&nbsp;&nbsp;&nbsp;<HomeIcon />
            </Button>
          </Grid>
        )
      }
      <Grid item xs={ 12 } sm={ 12 }>
        <Typography>
          {
            isHomepage ?
              `This page is currently set as the homepage.` :
              item.helperText
          }
        </Typography>
      </Grid>
    </Grid>
  )
}

export default MakeHomepage
