import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import nocodeSelectors from '../../../store/selectors/nocode'
import contentActions from '../../../store/modules/content'
import itemUtils from '../../../utils/item'

import icons from '../../../icons'

const HideIcon = icons.hide
const DeleteIcon = icons.delete

const HideItem = ({
  values,
  item,
}) => {

  const nodes = useSelector(nocodeSelectors.nodes)
  const node = nodes[values.id]

  const locations = useSelector(nocodeSelectors.locations)
  const sectionLocation = itemUtils.isSectionContent(node, locations)

  const dispatch = useDispatch()

  const onHide = async () => {
    await dispatch(contentActions.hideContent({
      id: values.id,
      name: values.name,
    })) 
  }

  const onRemove = async () => {
    await dispatch(contentActions.removeSectionContent({
      title: node.name,
      driver: 'drive',
      section: sectionLocation.location.split(':')[1],
      content_id: node.id,
    })) 
  }

  return (
    <Grid container spacing={ 2 }>
      {
        sectionLocation ? (
          <>
            <Grid item xs={ 12 } sm={ 12 }>
              <Typography>
                Remove this item from the website.
              </Typography>
              <Typography>
                This won't delete the item from your drive, just remove it from this website.
              </Typography>
            </Grid>
            <Grid item xs={ 12 } sm={ 12 }>
              <Button
                variant="contained"
                color="default"
                onClick={ onRemove }
              >
                Remove Item&nbsp;&nbsp;&nbsp;<DeleteIcon />
              </Button>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={ 12 } sm={ 12 }>
              <Typography>
                Nocode will never delete any of your drive content.
              </Typography>
              <Typography>
                You can "hide" this item so it doesn't show on your website.
              </Typography>
              <Typography>
                If you do want to delete the item - you can delete it from your google drive.
              </Typography>
            </Grid>
            <Grid item xs={ 12 } sm={ 12 }>
              <Button
                variant="contained"
                color="default"
                onClick={ onHide }
              >
                Hide Item&nbsp;&nbsp;&nbsp;<HideIcon />
              </Button>
            </Grid>
          </>
        )
      }
      
    </Grid>
  )
}

export default HideItem
