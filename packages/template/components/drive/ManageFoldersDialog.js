import React, { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import Actions from '../../utils/actions'

import useSection from '../hooks/useSection'
import contentActions from '../../store/modules/content'
import dialogSelectors from '../../store/selectors/dialog'
import SimpleTable from '../table/SimpleTable'
import driveUtils from '../../utils/drive'

import Window from '../dialog/Window'

const useStyles = makeStyles(theme => createStyles({
  root: {
    
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
  
  const getActions = useCallback((item) => {
    return (
      <div>
        <Button
          size="small"
          onClick={ () => {
            window.open(driveUtils.getItemUrl(item._data))
          }}
        >
          View in drive
        </Button>
      </div>
    )
  })

  const sectionTitle = (section || '')
    .replace(/^(\w)/, (st) => st.toUpperCase())
  
  return (
    <Window
      open
      title={`Manage Drive Folders for ${sectionTitle}`}
      fullHeight
      withCancel
      size="md"
      submitTitle="Add Drive Folder"
      cancelTitle="Close"
      submitButtonColor="secondary"
      onCancel={ actions.onCancel }
      onSubmit={ () => console.log('add') }
    >
      <div className={ classes.root }>
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