import React, { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import Actions from '../../utils/actions'

import useSection from '../hooks/useSection'
import contentActions from '../../store/modules/content'
import dialogSelectors from '../../store/selectors/dialog'
import SimpleTable from '../table/SimpleTable'
import driveUtils from '../../utils/drive'

import Window from '../dialog/Window'

const useStyles = makeStyles(theme => ({
  root: {
    
  },
  margin: {
    marginBottom: theme.spacing(1),
  },
  
}))

const FIELDS = [{
  title: 'Name',
  name: 'name',
}, {
  title: 'Add new content',
  name: 'status',
}]

const ManageFoldersDialog = ({
  
}) => {

  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onAddFolder: contentActions.addManagedFolder,
    onCancel: contentActions.closeManageFoldersDialog,
  })

  const {
    manageSectionFolders: {
      section,
    }
  } = useSelector(dialogSelectors.dialogParams)

  const sectionData = useSection({
    section,
  })

  const tableData = useMemo(() => {
    return sectionData.sourceFolders.map(folder => {
      const isDefault = folder.id == sectionData.defaultFolderId
      const isAddTarget = folder.id == sectionData.addTargetFolderId
      const name = isDefault ? `Default Nocode Folder` : folder.name
      return {
        id: folder.id,
        name: (
          <a href={ driveUtils.getItemUrl(folder) } target="_blank">{ name }</a>
        ),
        status: isAddTarget ? `Activated` : '',
        _data: folder,
      }
    })
  }, [
    sectionData,
  ])
  
  const getActions = useCallback((folder) => {
    const isDefault = folder.id == sectionData.defaultFolderId

    return (
      <div>
        <Button
          size="small"
          variant="outlined"
          onClick={ () => {
            window.open(driveUtils.getItemUrl(folder._data))
          }}
        >
          View in drive
        </Button>
        {
          !isDefault && (
            <Button
              size="small"
              variant="outlined"
              onClick={ () => {
                console.log('--------------------------------------------')
                console.log('remove')
              }}
            >
              Remove
            </Button>
          )
        }
      </div>
    )
  }, [
    sectionData,
  ])

  const sectionTitle = (section || '')
    .replace(/^(\w)/, (st) => st.toUpperCase())
  
  return (
    <Window
      open
      title={`Manage Drive Folders for ${sectionTitle}`}
      fullHeight
      withCancel
      size="md"
      cancelTitle="Close"
      onCancel={ actions.onCancel }
    >
      <div className={ classes.root }>
        <div>
          <div className={ classes.margin }>
            <Typography variant="caption">
              The content in the following folders will be merged into the {sectionTitle} section.
            </Typography>
          </div>
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
        </div>
        <SimpleTable
          data={ tableData }
          fields={ FIELDS }
          getActions={ getActions }
        />
      </div>
    </Window>
  )
}

export default ManageFoldersDialog