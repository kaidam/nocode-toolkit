import React from 'react'
import { useSelector } from 'react-redux'
import DialogContentText from '@material-ui/core/DialogContentText'
import Button from '@material-ui/core/Button'

import websiteSelectors from '../../store/selectors/website'
import driveUtils from '../../utils/drive'

const FolderInfoDescription = ({
  
}) => {
  const websiteMeta = useSelector(websiteSelectors.websiteMeta)
  const folderId = websiteMeta.nocodeFolderId
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
