import React from 'react'

import DialogContentText from '@material-ui/core/DialogContentText'
import Button from '@material-ui/core/Button'

import driveUtils from '../../utils/drive'

const FolderInfoDescription = ({
  store,
}) => {
  const folderId = store.getState().system.website.meta.nocodeFolderId
  const openFolderUrl = driveUtils.getEditUrl({
    id: folderId,
    mimeType: 'folder',
  })
  return (
    <>
      <DialogContentText>
        A nocode website will load it's content from a folder on your Google Drive.        
      </DialogContentText>
      <DialogContentText>
        To help you get setup, we have created a folder in your drive for this website.
      </DialogContentText>
      <DialogContentText>
        <Button
          color="primary"
          variant="outlined"
          onClick={ () => {
            window.open(openFolderUrl)
          }}
        >
          View Drive Folder
        </Button>
      </DialogContentText>
    </>
  )
}

export default FolderInfoDescription
