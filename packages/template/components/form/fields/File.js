import React, { useCallback, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { useSelector, useDispatch } from 'react-redux'
import { useDropzone } from 'react-dropzone'

import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Typography from '@material-ui/core/Typography'

import Actions from '../../../utils/actions'
import Loading from '../../system/Loading'

import UploadStatus from '../../uploader/UploadStatus'

import driveActions from '../../../store/modules/drive'
import unsplashActions from '../../../store/modules/unsplash'
import fileuploadActions from '../../../store/modules/fileupload'
import fileuploadSelectors from '../../../store/selectors/fileupload'

import icons from '../../../icons'

const DeleteIcon = icons.delete

const useStyles = makeStyles(theme => createStyles({
  container: {
    marginTop: theme.spacing(1),
  },
  image: {
    maxWidth: '100px',
    border: '1px solid #000',
    marginTop: theme.spacing(2),
  },
  placeholder: {
    width: '100px',
    height: '100px',
    border: '1px solid #000',
    backgroundColor: '#e5e5e5',
    marginTop: theme.spacing(2),
  },
  editIcon: {
    marginRight: theme.spacing(1),
  },
  buttons: {
    marginTop: theme.spacing(2),
  },
  buttonTitle: {
    display: 'inline-block',
    paddingRight: '10px',
  },
  buttonIcon: {
    width: '20px',
    height: '20px',
  },
  button: {
    margin: theme.spacing(0.5),
    fontSize: '0.8em',
  },
  errorText: {
    marginTop: theme.spacing(2),
    color: 'red',
  }
}))

const isImage = (url) => {
  if(url.match(/\.(jpg|png|jpeg|gif)$/i)) return true
  if(url.indexOf('unsplash.com') >= 0) return true
  return false
}

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
  
  const uploadInProgress = useSelector(fileuploadSelectors.inProgress)
  const uploadStatus = useSelector(fileuploadSelectors.status)
  const syncLoading = useSelector(fileuploadSelectors.loading.syncFiles)
  const uploadError = useSelector(fileuploadSelectors.errors.uploadFiles)

  const actions = Actions(useDispatch(), {
    onSyncFiles: fileuploadActions.syncFiles,
    onUploadFiles: fileuploadActions.uploadFiles,
    reset: fileuploadActions.reset,
    getDriveItem: driveActions.getDriveItem,
    getUnsplashItem: unsplashActions.getUnsplashItem,
  })

  const {
    getRootProps,
    getInputProps,
    inputRef,
  } = useDropzone({
    onDrop: async (files) => {
      const file = files[0]
      const result = await actions.onUploadFiles({
        group: name,
        files,
      })
      if(result) setFieldValue(name, result[0], file)
    },
    multiple: false,
  })

  const onOpenUploader = useCallback(() => {
    inputRef.current.click()
  }, [])

  const onResetValue = useCallback(() => {
    setFieldValue(name, null)
  }, [name])

  const onChooseDriveImage = useCallback(async () => {
    const image = await actions.getDriveItem({
      listFilter: 'folder,image',
      addFilter: 'image',
    })
    if(!image) return
    const result = await actions.onSyncFiles({
      driver: 'drive',
      id: image.id,
    })
    setFieldValue(name, result)
  }, [])

  const onChooseUnsplashImage = useCallback(async () => {
    const image = await actions.getUnsplashItem({
      
    })
    setFieldValue(name, image)
  }, [])

  const buttons = useMemo(() => {

    const local = {
      title: 'Choose File',
      help: 'Upload an image from your computer',
      icon: icons.upload,
      handler: onOpenUploader,
    }

    const google = {
      title: 'Google Drive',
      help: 'Choose an image on your google drive',
      icon: icons.drive,
      handler: onChooseDriveImage,
    }

    const unsplash = {
      title: 'Unsplash',
      help: 'Choose an image from Unsplash',
      icon: icons.unsplash,
      handler: onChooseUnsplashImage,
    }

    return [
      !item.providers || item.providers.indexOf('local') >= 0 ?
        local :
        null,
      !item.providers || item.providers.indexOf('google') >= 0 ?
        google :
        null,
      !item.providers || item.providers.indexOf('unsplash') >= 0 ?
        unsplash :
        null,
      !item.noReset ? {
        title: 'Reset',
        help: 'Clear this image',
        icon: DeleteIcon,
        handler: onResetValue
      } : null
    ]
      .filter(item => item)
      .map((item, i) => {
        const Icon = item.icon
        return (
          <Tooltip title={ item.help } key={ i }>
            <Button
              variant="outlined"
              size="small"
              onClick={ item.handler }
              className={ classes.button }
            >
              { item.title }&nbsp;&nbsp;&nbsp;<Icon size={ 16 } className={ classes.buttonIcon } />
            </Button>
          </Tooltip>
        )
      })
  }, [
    onResetValue,
  ])

  const helperText = item.helperText

  let showProgress = false

  if(uploadInProgress) {
    const nonGroupUpload = Object.keys(uploadStatus).find(filename => {
      return uploadStatus[filename].group != name
    })
    if(!nonGroupUpload) showProgress = true
  }

  return showProgress || syncLoading ? (
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
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <InputLabel 
            htmlFor={ name }>{ item.title || item.id }</InputLabel>
          {
            helperText ? (
              <FormHelperText error={ false } id={ name + "-helperText" }>
                { helperText }
              </FormHelperText>
            ) : null
          }
        </Grid>
        {
          item.placeholder != 'text' ? (
            <Grid item xs={12} sm={3}>
              {
                value && value.url && isImage(value.url) ? 
                  (
                    <img className={ classes.image } src={ value.url } />
                  ) :
                  (
                    <div className={ classes.placeholder }></div>
                  )
              }
            </Grid>
          ) : null
        }
        <Grid item xs={12} sm={item.placeholder == 'text' ? 12 : 9}>
          <div className={ classes.buttons }>
            { buttons }
          </div>
          {
            value && value.url && item.placeholder == 'text' && (
              <Typography variant="caption">
                { value.url }
              </Typography>
            )
          }
        </Grid>
        <Grid item xs={12}>
          {
            uploadError && (
              <Typography className={ classes.errorText }>
                { uploadError }
              </Typography>
            )
          }
          <div {...getRootProps()}>
            <input {...getInputProps()} />
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default ImageField
