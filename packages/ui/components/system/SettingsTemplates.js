import React, { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import SimpleTable from '../table/SimpleTable'
import Actions from '../../utils/actions'
import selectors from '../../store/selectors'
import uiActions from '../../store/modules/ui'

import SettingsDeleteDialog from './SettingsDeleteDialog'

import icons from '../../icons'

const DeleteIcon = icons.delete

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    padding: theme.spacing(5),
    flexGrow: 1,
    overflowY: 'auto',
  },
  appbar: {
    flexGrow: 0,
  },
  grow: {
    flexGrow: 1,
  },
  titleContainer: {
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    borderTop: '1px solid #ccc'
  },
  addButton: {
    marginTop: theme.spacing(1),
  }
}))

const SettingsTemplates = ({
  onClose,
}) => {

  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onDeleteTemplate: uiActions.deleteTemplate,
  })

  const templates = useSelector(selectors.ui.templates)

  const [ deleteTemplate, setDeleteTemplate ] = useState(null)
  const onCloseDeleteDialog = useCallback(() => setDeleteTemplate(null))

  const onSaveDeleteForm = useCallback(() => {
    actions.onDeleteTemplate({
      id: deleteTemplate.id,
      onComplete: () => {
        setDeleteTemplate(null)
      }
    })
  }, [
    deleteTemplate,
  ])

  const fields = [{
    title: 'Name',
    name: 'name',
  }]

  return (
    <div className={ classes.container }>
      <div className={ classes.content }>
        <Grid container className={ classes.titleContainer }>
          <Grid item xs={ 12 }>
            <Typography variant="h6">Templates</Typography>
          </Grid>
        </Grid>
        <Grid container className={ classes.tableContainer }>
          <Grid item xs={ 12 }>
            <SimpleTable
              hideHeader
              data={ templates }
              fields={ fields }
              getActions={ (item) => {
                if(item.system) return null
                return (
                  <span>
                    <IconButton
                      onClick={ () => setDeleteTemplate(item) }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                )
              }}
            />
          </Grid>
        </Grid>
      </div>
      <div className={ classes.appbar }>
        <AppBar color="default" position="relative">
          <Toolbar>
            <div className={classes.grow} />
            <Button
              color="default"
              variant="contained"
              onClick={ onClose }
            >
              Close
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      {
        deleteTemplate && (
          <SettingsDeleteDialog
            title="Delete Template?"
            message={`Are you sure you want to delete the ${ deleteTemplate.name } template?`}
            onSubmit={ onSaveDeleteForm }
            onClose={ onCloseDeleteDialog }
          />
        )
      }
    </div>
  )
}

export default SettingsTemplates
