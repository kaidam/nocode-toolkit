import React, { useState, useCallback, useMemo, useRef } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { useSelector, useDispatch } from 'react-redux'
import { useDropzone } from 'react-dropzone'


import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'

import Actions from '../../../utils/actions'

import MenuButton from '../../buttons/MenuButton'
import EmbeddedFinder from '../../finder/Embedded'
import Loading from '../../system/Loading'

import UploadStatus from '../../uploader/UploadStatus'

import fileuploadActions from '../../../store/modules/fileupload'
import selectors from '../../../store/selectors'

import icons from '../../../icons'
import typeUI from '../../../types/ui'

const EditIcon = icons.edit
const UploadIcon = icons.upload
const DriveIcon = icons.drive
const DeleteIcon = icons.delete

const useStyles = makeStyles(theme => createStyles({
  container: {
    marginTop: theme.spacing(1),
  },
  image: {
    maxWidth: '200px',
    border: '1px solid #000',
  },
  editIcon: {
    marginRight: theme.spacing(1),
  }
}))

const ImageField = ({
  field: {
    name,
    value,
  },
  form: {
    setFieldValue,
  },
  item,
}) => {
  const classes = useStyles()
  const syncLoading = useSelector(selectors.fileupload.loading.syncFiles)
  const uploadInProgress = useSelector(selectors.fileupload.inProgress)
  const uploadStatus = useSelector(selectors.fileupload.status)
  const uploadError = useSelector(selectors.fileupload.errors.uploadFiles)

  const actions = Actions(useDispatch(), {
    onSyncFiles: fileuploadActions.syncFiles,
    onUploadFiles: fileuploadActions.uploadFiles,
    reset: fileuploadActions.reset,
  })

  const [ finderDriver, setFinderDriver ] = useState(null)

  const onAddFinderContent = useCallback(({id}) => {
    onCloseFinder()
    actions.onSyncFiles({
      driver: 'drive',
      fileid: id,
      onComplete: (file) => {
        setFieldValue(name, file)
      }
    })
  }, [setFieldValue, name])

  const onAddUploaderContent = useCallback((files) => {
    setFieldValue(name, files[0])
  }, [setFieldValue, name])

  
  const {
    getRootProps,
    getInputProps,
    inputRef,
  } = useDropzone({
    onDrop: (files) => {
      actions.onUploadFiles({
        files,
        onComplete: onAddUploaderContent,
      })
    },
    multiple: false,
  })

  const onOpenFinder = useCallback((driver) => setFinderDriver(driver))
  const onCloseFinder = useCallback(() => setFinderDriver(null))
  const onOpenUploader = useCallback(() => {
    inputRef.current.click()
  }, [])

  const onResetValue = useCallback(() => {
    setFieldValue(name, null)
  }, [setFieldValue, name])

  const finderDialog = useMemo(() => {
    if(!finderDriver) return null
    return (
      <EmbeddedFinder
        open
        driver={ finderDriver }
        addFilter="image"
        listFilter="folder,image"
        onAddContent={ onAddFinderContent }
        onCancel={ onCloseFinder }
      />
    )
  }, [finderDriver])

  const menuItems = useMemo(() => {

    const remoteImageTypes = typeUI.addContentOptionsWithCallback({
      filter: (parentFilter) => parentFilter.indexOf('image') >= 0,
      handler: (type, schema) => onOpenFinder(schema.driver),
    })

    return [{
      title: 'Upload',
      help: 'Upload an image from your computer',
      icon: UploadIcon,
      handler: onOpenUploader,
    }]
      .concat(remoteImageTypes)
      .concat({
        title: 'Reset',
        help: 'Clear this image',
        icon: DeleteIcon,
        handler: onResetValue
      })
  }, [onOpenFinder, onOpenUploader, onResetValue])

  const getButton = useCallback(onClick => (
    <Button
      size="small"
      variant="contained"
      onClick={ onClick }
    >
      <EditIcon className={ classes.editIcon } />
      Edit
    </Button>
  ), [])

  const description = item.helperText

  return uploadInProgress || syncLoading ? (
    <div className={ classes.container }>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {
            uploadInProgress ? (
              <UploadStatus
                inProgress={ uploadInProgress }
                error={ uploadError }
                status={ uploadStatus }
              />
            ) : (
              <Loading />
            )
          }
        </Grid>
      </Grid>
    </div>
  ) : (
    <div className={ classes.container }>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <InputLabel 
            htmlFor={ name }>{ item.title || item.id }</InputLabel>
          {
            description ? (
              <FormHelperText error={ false } id={ name + "-description" }>
                { description }
              </FormHelperText>
            ) : null
          }
        </Grid>
        {
          value && value.url ? (
            <Grid item xs={12} sm={4}>
              <img className={ classes.image } src={ value.url } />
              </Grid>
          ) : null
        }
        <Grid item xs={12} sm={4}>
          <MenuButton
            items={ menuItems }
            getButton={ getButton }
          />
        </Grid>
        <Grid item xs={12}>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
          </div>
        </Grid>
      </Grid>
      { finderDialog }
    </div>
  )
}

export default ImageField
