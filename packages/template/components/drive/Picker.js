import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import driveSelectors from '../../store/selectors/drive'
import driveActions from '../../store/modules/drive'
import systemSelectors from '../../store/selectors/system'
import systemActions from '../../store/modules/system'

const DrivePicker = ({
  
}) => {
  const dispatch = useDispatch()
  
  const [ pickerLoaded, setPickerLoaded ] = useState(false)
  const pickerConfig = useSelector(driveSelectors.picker)
  const drivePickerCredentials = useSelector(systemSelectors.drivePickerCredentials)
  const gapiType = typeof(window.gapi)

  useEffect(() => {
    if(drivePickerCredentials) return
    dispatch(systemActions.loadDrivePickerCredentials())
  }, [
    drivePickerCredentials,
  ])

  const onClose = useCallback(() => {
    setPickerLoaded(false)
    dispatch(driveActions.cancelPicker())
  })

  const onChoose = useCallback((data) => {
    setPickerLoaded(false)
    dispatch(driveActions.acceptPicker(data))
  })

  useEffect(() => {
    if(gapiType !== 'undefined') {
      setPickerLoaded(true)
      return
    }

    window._nocodeGooglePickerLoaded = () => {
      setPickerLoaded(true)
    }

    const script = document.createElement("script")
    script.src = 'https://apis.google.com/js/api.js?onload=_nocodeGooglePickerLoaded'
    script.async = false
    document.body.appendChild(script)
  }, [
    gapiType,
  ])

  useEffect(() => {
    if(!drivePickerCredentials || !pickerLoaded || !pickerConfig) return
  
    console.log('loading picker')
    window.gapi.load('picker', {
      callback: () => {
        console.log('picker loaded')
        const {
          app_id,
          token,
          file_picker_key,
        } = drivePickerCredentials
        const pickerApi = window.google.picker
        let view = null

        if(pickerConfig.filter == 'folder') {
          view = new pickerApi.DocsView()
            .setIncludeFolders(true) 
            .setMimeTypes('application/vnd.google-apps.folder')
            .setSelectFolderEnabled(true)
        }
        else if(pickerConfig.filter == 'document') {
          view = new pickerApi.View(pickerApi.ViewId.DOCUMENTS)
        }
        else if(pickerConfig.filter == 'image') {
          view = new pickerApi.View(pickerApi.ViewId.DOCS_IMAGES)
        }

        if(window.globalPicker) {
          window.globalPicker.dispose()
          window.globalPicker = null
        }

        window.globalPicker = new pickerApi.PickerBuilder()
          .enableFeature(pickerApi.Feature.SUPPORT_DRIVES)
          .setAppId(app_id)
          .setOAuthToken(token)
          .addView(view)
          .setDeveloperKey(file_picker_key)
          .setCallback((data) => {
            if(data.action == 'loaded') return
            if(data.action == 'cancel') {
              window.globalPicker.dispose()
              window.globalPicker = null
              onClose()
              return
            }
            window.globalPicker.dispose()
            window.globalPicker = null
            onChoose(data.docs[0])
          })
          .build()
        window.globalPicker.setVisible(true)
        document.querySelector('div.picker-dialog-bg').style.zIndex = 10000
        document.querySelector('div.picker-dialog').style.zIndex = 10001        
      },
    })

  }, [
    drivePickerCredentials,
    pickerLoaded,
    pickerConfig,
  ])

  return null
}

export default DrivePicker