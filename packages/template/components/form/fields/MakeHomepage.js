import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import contentActions from '../../../store/modules/content'
import contentSelectors from '../../../store/selectors/content'
import settingsSelectors from '../../../store/selectors/settings'

import icons from '../../../icons'

const HomeIcon = icons.home

const MakeHomepage = ({
  values,
  item,
}) => {

  const dispatch = useDispatch()

  const singletonHome = useSelector(contentSelectors.homeSingletonItem)
  const settings = useSelector(settingsSelectors.settings)

  const setHomepage = () => {
    dispatch(contentActions.changeHomepageSetting({
      content_id: values.id,
    }))
  }

  const isHomepage = settings && settings.homepage == values.id

  if(singletonHome) {
    return (
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 } sm={ 12 }>
          <Typography>
            Your website is using a fixed homepage.
          </Typography>
          <Typography>
            You can change which document is used for the homepage by
            clicking on the "Home" link and selecting the option to
            "Change Homepage"
          </Typography>
        </Grid>
      </Grid>
    )
  }
  else {
    return (
      <Grid container spacing={ 2 }>
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
}

export default MakeHomepage
