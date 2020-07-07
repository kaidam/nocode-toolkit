import React, { useCallback, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { v4 as uuid } from 'uuid'

import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import FormDialog from '../form/Dialog'
import DeleteConfirm from '../dialog/DeleteConfirm'

import websiteSelectors from '../../store/selectors/website'
import websiteActions from '../../store/modules/website'
import SimpleTable from '../table/SimpleTable'

import icons from '../../icons'

const DeleteIcon = icons.delete
const EditIcon = icons.edit

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(4),
    minHeight: '160px',
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flexGrow: 1,
  },
  addButton: {
    flexGrow: 0,
  },
  caption: {
    marginTop: theme.spacing(2),
  },
}))

const SNIPPET_SCHEMAS = {
  page: {
    schema: [{
      id: 'name',
      title: 'Name',
      helperText: 'Enter the name of the snippet',
      validate: {
        type: 'string',
        methods: [
          ['required', 'The name is required'],
        ],
      },
    },{
      id: 'html',
      title: 'HTML',
      helperText: 'Enter some HTML code for this snippet',
      component: 'textarea',
      rows: 5,
      validate: {
        type: 'string',
        methods: [
          ['required', 'The html is required'],
        ],
      },
    }],
    initialValues: {
      name: '',
      html: '',
    }
  },
  global: {
    schema: [{
      id: 'name',
      title: 'Name',
      helperText: 'Enter the name of the snippet',
      validate: {
        type: 'string',
        methods: [
          ['required', 'The name is required'],
        ],
      },
    },{
      id: 'head',
      title: 'Head HTML',
      helperText: 'Enter some HTML code for the HEAD tag',
      component: 'textarea',
      rows: 5,
    },{
      id: 'before_body',
      title: 'Before Body HTML',
      helperText: 'Enter some HTML code for before the BODY tag',
      component: 'textarea',
      rows: 5,
    },{
      id: 'after_body',
      title: 'After Body HTML',
      helperText: 'Enter some HTML code for after the BODY tag',
      component: 'textarea',
      rows: 5,
    }],
    initialValues: {
      name: '',
      head: '',
      before_body: '',
      after_body: '',
    }
  },
  file: {
    schema: [{
      id: 'name',
      title: 'Name',
      helperText: 'Enter the name of the snippet',
      validate: {
        type: 'string',
        methods: [
          ['required', 'The name is required'],
        ],
      },
    },{
      id: 'file',
      title: 'Upload file',
      helperText: 'Upload a file and it will be published alongside your website',
      component: 'file',
      providers: ['local'],
      placeholder: 'text',
      noReset: true,
    }],
    initialValues: {
      name: '',
      file: null,
    }
  }
}

const TABLE_FIELDS = [{
  title: 'Name',
  name: 'name',
}]

const SnippetGroup = ({
  title,
  message,
  data,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const classes = useStyles()

  const snippetData = data.map(s => {
    return {
      name: s.data.name,
      ...s
    }
  })

  return (
    <div className={ classes.content }>
      <div className={ classes.toolbar }>
        <div className={ classes.title }>
          <Typography variant="h6" gutterBottom>
            { title }
          </Typography>
        </div>
        <div className={ classes.addButton }>
          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={ onAdd }
          >
            Add
          </Button>
        </div>
      </div>
      
      <div className={ classes.caption }>
        <Typography variant="caption" gutterBottom>
          { message }
        </Typography>
      </div>
      
      <SimpleTable
        hideHeader
        data={ snippetData }
        fields={ TABLE_FIELDS }
        getActions={ (item) => (
          <span>
            <IconButton
              onClick={ () => onDelete(item) }
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={ () => onEdit(item) }
            >
              <EditIcon />
            </IconButton>
          </span>
        )}
      />
    </div>
  )
}

const SettingsSnippets = ({
  
}) => {

  const classes = useStyles()
  const dispatch = useDispatch()

  const website = useSelector(websiteSelectors.websiteData)
  const [ editSnippet, setEditSnippet ] = useState(false)
  const [ deleteSnippet, setDeleteSnippet ] = useState(false)
  
  const {
    snippets = [],
  } = (website.meta || {})

  const pageSnippets = snippets.filter(snippet => snippet.type == 'page')
  const globalSnippets = snippets.filter(snippet => snippet.type == 'global')
  const fileSnippets = snippets.filter(snippet => snippet.type == 'file')

  const onSaveSnippet = useCallback(async (data) => {
    const newSnippet = Object.assign({}, editSnippet, {data})
    let newSnippets = []
    if(newSnippet.id) {
      newSnippets = snippets.map(s => s.id == newSnippet.id ? newSnippet : s)
    }
    else {
      newSnippet.id = uuid()
      newSnippets = snippets.concat([newSnippet])
    }
    const result = await dispatch(websiteActions.updateMeta(website.id, {
      snippets: newSnippets,
    }))
    if(result) setEditSnippet(null)
  }, [
    editSnippet,
    snippets,
  ])

  const onDeleteSnippet = useCallback(async () => {
    const newSnippets = snippets.filter(s => s.id != deleteSnippet.id)
    const result = await dispatch(websiteActions.updateMeta(website.id, {
      snippets: newSnippets,
    }))
    if(result) setDeleteSnippet(null)
  }, [
    deleteSnippet,
    snippets,
  ])

  return (
    <Grid container spacing={ 4 }>
      <Grid item xs={ 12 } sm={ 12 } md={ 12 } lg={ 4 }>
        <Paper className={ classes.paper }>
          <SnippetGroup
            title="Page Snippets"
            message="Chunks of HTML that you can add to pages"
            data={ pageSnippets }
            onAdd={ () => setEditSnippet({
              type: 'page',
              data: {},
            })}
            onEdit={ (s) => setEditSnippet(s) }
            onDelete={ (s) => setDeleteSnippet(s) }
          />
        </Paper>
      </Grid>
      <Grid item xs={ 12 } sm={ 12 } md={ 12 } lg={ 4 }>
        <Paper className={ classes.paper }>
          <SnippetGroup
            title="Global Snippets"
            message="Appear on all pages and are useful for adding script tags or custom CSS"
            data={ globalSnippets }
            onAdd={ () => setEditSnippet({
              type: 'global',
              data: {},
            })}
            onEdit={ (s) => setEditSnippet(s) }
            onDelete={ (s) => setDeleteSnippet(s) }
          />
        </Paper>
      </Grid>
      <Grid item xs={ 12 } sm={ 12 } md={ 12 } lg={ 4 }>
        <Paper className={ classes.paper }>
          <SnippetGroup
            title="File Snippets"
            message="Upload files that will be published alongside your website"
            data={ fileSnippets }
            onAdd={ () => setEditSnippet({
              type: 'file',
              data: {},
            })}
            onEdit={ (s) => setEditSnippet(s) }
            onDelete={ (s) => setDeleteSnippet(s) }
          />
        </Paper>
      </Grid>
      {
        editSnippet && (
          <FormDialog
            title={`${editSnippet.id ? 'Edit' : 'Add'} ${editSnippet.type.replace(/^(\w)/, s => s.toUpperCase())} Snippet`}
            size="sm"
            schema={ SNIPPET_SCHEMAS[editSnippet.type].schema }
            initialValues={ editSnippet.id ? editSnippet.data : SNIPPET_SCHEMAS[editSnippet.type].initialValues }
            withCancel
            onSubmit={ onSaveSnippet }
            onCancel={ () => setEditSnippet(null) }
          />
        )
      }
      {
        deleteSnippet && (
          <DeleteConfirm
            title="Delete Snippet?"
            onConfirm={ onDeleteSnippet }
            onCancel={ () => setDeleteSnippet(null) }
          >
            <Typography>
              Are you <strong>absolutely sure</strong> you want to delete the { deleteSnippet.data.name } snippet?
            </Typography>
          </DeleteConfirm>
        )
      }
    </Grid>
  )
}

export default SettingsSnippets



/*

      {
        editSnippet && (
          <FormDialog
            title="Add User"
            size="sm"
            schema={ USER_SCHEMA }
            initialValues={ USER_INITIAL_VALUES }
            withCancel
            onSubmit={ onAddUser }
            onCancel={ () => setAddingUser(false) }
          />
        )
      }
      {
        deletingUser && (
          <DeleteConfirm
            title="Remove User?"
            onConfirm={ () => {
              onDeleteUser(deletingUser)
              setDeletingUser(null)
            }}
            onCancel={ () => setDeletingUser(null) }
          >
            <Typography>
              Are you <strong>absolutely sure</strong> you want to delete the { deletingUser } user?
            </Typography>
          </DeleteConfirm>
        )
      }

*/