import React, { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import uuid from 'uuid/v4'

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

import SettingsSnippetEditDialog from './SettingsSnippetEditDialog'
import SettingsDeleteDialog from './SettingsDeleteDialog'

import icons from '../../icons'

const EditIcon = icons.edit
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

const SettingsSnippetGroup = ({
  global = false,
  snippets,
  setDeleteSnippet,
  setEditSnippet,
  onOpenAddDialog,
}) => {
  const classes = useStyles()

  const fields = [{
    title: 'Name',
    name: 'name',
  }]

  const data = snippets.map(snippet => {
    return {
      id: snippet.id,
      name: snippet.name,
      code: snippet.code,
    }
  })

  return (
    <div className={ classes.content }>
      <Grid container className={ classes.titleContainer }>
        <Grid item xs={ 12 }>
          <Typography variant="h6">{ global ? 'Global ' : ''} Snippets</Typography>
        </Grid>
      </Grid>
      <Grid container className={ classes.tableContainer }>
        <Grid item xs={ 12 }>
          <SimpleTable
            hideHeader
            data={ data }
            fields={ fields }
            getActions={ (item) => (
              <span>
                <IconButton
                  onClick={ () => setDeleteSnippet(item, global) }
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={ () => setEditSnippet(item, global) }
                >
                  <EditIcon />
                </IconButton>
              </span>
            )}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={ 4 }>
          <Button
            className={ classes.addButton }
            size="small"
            color="secondary"
            variant="contained"
            onClick={ onOpenAddDialog }
          >
            Add { global ? 'global ' : ''} snippet
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

const SettingsSnippets = ({
  onClose,
}) => {

  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onSetSnippets: uiActions.setSnippets,
  })

  const snippets = useSelector(selectors.ui.snippets)
  const globalSnippets = useSelector(selectors.ui.globalSnippets)

  const [ editSnippet, setEditSnippet ] = useState(null)
  const [ deleteSnippet, setDeleteSnippet ] = useState(null)
  
  const onCloseEditDialog = useCallback(() => setEditSnippet(null))
  const onCloseDeleteDialog = useCallback(() => setDeleteSnippet(null))

  const onOpenAddDialog = useCallback(() => {
    setEditSnippet({
      name: '',
      code: '',
    })
  })

  const onSaveEditForm = useCallback((values) => {
    let newSnippets = snippets
    // we are editing an existing snippet
    if(editSnippet.id) {
      newSnippets = snippets.map(snippet => {
        if(snippet.id != editSnippet.id) return snippet
        return Object.assign({}, snippet, values)
      })
    }
    // we are adding a new snippet
    else {
      const newSnippet = Object.assign({}, values, {
        id: uuid(),
      })
      newSnippets = snippets.concat([newSnippet])
    }
    actions.onSetSnippets({
      data: newSnippets,
      onComplete: () => {
        setEditSnippet(null)
      }
    })
  }, [
    editSnippet,
    snippets,
  ])

  const onSaveDeleteForm = useCallback(() => {
    const newSnippets = snippets.filter(snippet => snippet.id != deleteSnippet.id)
    actions.onSetSnippets({
      data: newSnippets,
      onComplete: () => {
        setDeleteSnippet(null)
      }
    })
  }, [
    deleteSnippet,
    snippets,
  ])

  return (
    <div className={ classes.container }>
      <SettingsSnippetGroup
        global={ false }
        snippets={ snippets }
        setDeleteSnippet={ setDeleteSnippet }
        setEditSnippet={ setEditSnippet }
        onOpenAddDialog={ onOpenAddDialog }
      />
      <SettingsSnippetGroup
        global={ true }
        snippets={ globalSnippets }
        setDeleteSnippet={ setDeleteSnippet }
        setEditSnippet={ setEditSnippet }
        onOpenAddDialog={ onOpenAddDialog }
      />
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
        editSnippet && (
          <SettingsSnippetEditDialog
            snippet={ editSnippet }
            onSubmit={ onSaveEditForm }
            onClose={ onCloseEditDialog }
          />
        )
      }
      {
        deleteSnippet && (
          <SettingsDeleteDialog
            title="Delete Snippet?"
            message={`Are you sure you want to delete the ${ deleteSnippet.name } snippet?`}
            onSubmit={ onSaveDeleteForm }
            onClose={ onCloseDeleteDialog }
          />
        )
      }
    </div>
  )
}

export default SettingsSnippets
