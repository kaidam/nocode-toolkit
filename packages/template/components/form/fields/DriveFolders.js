import React, { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'

import Actions from '../../../utils/actions'

import useSection from '../../hooks/useSection'
import contentActions from '../../../store/modules/content'
import dialogSelectors from '../../../store/selectors/dialog'
import SimpleTable from '../../table/SimpleTable'
import driveUtils from '../../../utils/drive'

import Window from '../../dialog/Window'

const useStyles = makeStyles(theme => ({
  root: {
    
  },
  margin: {
    marginBottom: theme.spacing(1),
  },
  bigMargin: {
    marginBottom: theme.spacing(3),
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  select: {
    display: 'flex',
  },
  
}))


const FIELDS = [{
  title: 'Name',
  name: 'name',
}]


const DriveFoldersEditor = ({
  values,
}) => {
  const classes = useStyles()

  const editId = values.id

  const [ _, section ] = editId.split(':')

  const actions = Actions(useDispatch(), {
    onAddFolder: contentActions.addManagedFolder,
    onRemoveFolder: contentActions.removeManagedFolder,
    onUpdateAnnotation: contentActions.updateAnnotation,
    onCancel: contentActions.closeManageFoldersDialog,
  })

  const {
    sourceFolders,
    defaultFolderId,
    addTargetFolderId,
  } = useSection({
    section,
  })

  const onUpdateTargetFolder = useCallback((e) => {
    const id = e.target.value
    actions.onUpdateAnnotation({
      id: `section:${section}`,
      data: {
        addTargetFolderId: id,
      },
    })
  }, [
    section,
  ])

  const tableData = useMemo(() => {
    return (sourceFolders || []).map(folder => {
      const isDefault = folder.id == defaultFolderId
      const name = isDefault ? `Nocode Default Folder` : folder.name
      return {
        id: folder.id,
        name: (
          <a href={ driveUtils.getItemUrl(folder) } target="_blank">{ name }</a>
        ),
        _data: folder,
      }
    })
  }, [
    sourceFolders,
    defaultFolderId,
    addTargetFolderId,
  ])

  const getActions = useCallback((folder) => {
    const isDefault = folder.id == defaultFolderId || sourceFolders.length <= 1

    return (
      <div>
        {
          !isDefault && (
            <Button
              className={ classes.button }
              size="small"
              variant="outlined"
              onClick={ () => {
                actions.onRemoveFolder({
                  section,
                  id: folder.id,
                  name: folder._data.name,
                })
              }}
            >
              Remove
            </Button>
          )
        }
        <Button
          className={ classes.button }
          size="small"
          variant="outlined"
          onClick={ () => {
            window.open(driveUtils.getItemUrl(folder._data))
          }}
        >
          View in drive
        </Button>
      </div>
    )
  }, [
    sourceFolders,
    defaultFolderId,
    addTargetFolderId,
  ])

  const sectionTitle = (section || '')
    .replace(/^(\w)/, (st) => st.toUpperCase())

  return (
    <div className={ classes.root }>
      <Grid container spacing={ 2 }>

        <Grid item xs={ 12 } sm={ 6 }>
        <div className={ classes.margin }>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={ () => {
                actions.onAddFolder({
                  section,
                })
              }}
            >
              Add Folder
            </Button>
          </div>
          <div className={ classes.bigMargin }>
            <SimpleTable
              hideHeader
              data={ tableData }
              fields={ FIELDS }
              getActions={ getActions }
            />
          </div>
          <div className={ classes.margin }>
            <Typography variant="body1">
              The content in the above folders will be merged into the {sectionTitle} section.
            </Typography>
          </div>
        </Grid>
        <Grid item xs={ 12 } sm={ 6 }>
          <div className={ classes.bigMargin }>
            <FormControl component="fieldset" className={ classes.select }>
              <InputLabel htmlFor="choose-folder">Add newly created content to:</InputLabel>
              <Select
                value={ addTargetFolderId }
                onChange={ onUpdateTargetFolder }
                inputProps={{
                  name: 'choose-folder',
                  id: 'choose-folder',
                }}
              >
                {
                  sourceFolders.map((folder, i) => {
                    const isDefault = folder.id == defaultFolderId
                    return (
                      <MenuItem
                        key={ i }
                        value={ folder.id }
                      >
                        { isDefault ? `Nocode Default Folder` : folder.name }
                      </MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </div>
          
        </Grid>
      </Grid>
    </div>
  )
}

export default DriveFoldersEditor
