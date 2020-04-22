import React, { useState, useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { v4 as uuid } from 'uuid'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import SimpleTable from '../table/SimpleTable'
import EditDialog from './SnippetEditDialog'
import DeleteDialog from './DeleteDialog'

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
    padding: theme.spacing(2),
    flexGrow: 1,
  },
  appbar: {
    flexGrow: 0,
  },
  grow: {
    flexGrow: 1,
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    height: "100%",
    overflowY: 'auto',
  },
  listCell: {
    flexGrow: 1,
    width: '50%',
  },
  titleContainer: {
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    borderTop: '1px solid #ccc'
  },
  addButton: {
    marginBottom: theme.spacing(1),
  },
  snippetTitle: {
    height: '50px',
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
      headCode: snippet.headCode,
      beforeBodyCode: snippet.beforeBodyCode,
      afterBodyCode: snippet.afterBodyCode,
      global: snippet.global,
    }
  })

  return (
    <div className={ classes.content }>
      <Grid container className={ classes.titleContainer }>
        <Grid item xs={ 12 }>
          <Typography variant="h6">{ global ? 'Global ' : ''} Snippets</Typography>
        </Grid>
      </Grid>
      <Grid container className={ classes.titleContainer }>
        <Grid item xs={ 12 }>
          <Typography className={ classes.snippetTitle }>
            {
              global ?
                `Appear on all pages and are useful for adding script tags or custom CSS` :
                `Chunks of HTML that you can add to pages`
            }
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={ 12 }>
          <Button
            className={ classes.addButton }
            size="small"
            color="secondary"
            variant="contained"
            onClick={ () => onOpenAddDialog(global) }
          >
            Add { global ? 'global ' : ''} snippet
          </Button>
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
                  onClick={ () => setDeleteSnippet(item) }
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={ () => setEditSnippet(item) }
                >
                  <EditIcon />
                </IconButton>
              </span>
            )}
          />
        </Grid>
      </Grid>
    </div>
  )
}

const SettingsSnippets = ({
  snippets,
  onUpdate,
}) => {

  const classes = useStyles()

  const pageSnippets = snippets.filter(snippet => !snippet.global)
  const globalSnippets = snippets.filter(snippet => snippet.global)
  
  const [ editSnippet, setEditSnippet ] = useState(null)
  const [ deleteSnippet, setDeleteSnippet ] = useState(null)
  
  const onCloseEditDialog = useCallback(() => setEditSnippet(null))
  const onCloseDeleteDialog = useCallback(() => setDeleteSnippet(null))

  const onOpenAddDialog = useCallback((global) => {
    setEditSnippet({
      name: '',
      code: '',
      headCode: '',
      beforeBodyCode: '',
      afterBodyCode: '',
      global,
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
    onUpdate(newSnippets)
    setEditSnippet(null)
  }, [
    editSnippet,
    snippets,
  ])

  const onSaveDeleteForm = useCallback(() => {
    const newSnippets = snippets.filter(snippet => snippet.id != deleteSnippet.id)
    onUpdate(newSnippets)
    setDeleteSnippet(null)
  }, [
    deleteSnippet,
    snippets,
  ])

  return (
    <div className={ classes.container }>
      <div className={ classes.listContainer }>
        <div className={ classes.listCell }>
          <SettingsSnippetGroup
            global={ false }
            snippets={ pageSnippets }
            setDeleteSnippet={ setDeleteSnippet }
            setEditSnippet={ setEditSnippet }
            onOpenAddDialog={ onOpenAddDialog }
          />
        </div>
        <div className={ classes.listCell }>
          <SettingsSnippetGroup
            global={ true }
            snippets={ globalSnippets }
            setDeleteSnippet={ setDeleteSnippet }
            setEditSnippet={ setEditSnippet }
            onOpenAddDialog={ onOpenAddDialog }
          />
        </div>
      </div>
      {
        editSnippet && (
          <EditDialog
            snippet={ editSnippet }
            onSubmit={ onSaveEditForm }
            onClose={ onCloseEditDialog }
          />
        )
      }
      {
        deleteSnippet && (
          <DeleteDialog
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
