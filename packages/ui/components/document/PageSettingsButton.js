import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'

import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import icons from '../../icons'
import typeUI from '../../types/ui'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'
import uiActions from '../../store/modules/ui'

import MenuButton from '../buttons/MenuButton'
import PageSettingsSaveTemplateDialog from './PageSettingsSaveTemplateDialog'

const SettingsIcon = icons.settings
const SaveIcon = icons.save

const useStyles = makeStyles({
  root: {
    //border: '1px solid #f5f5f5',
    backgroundColor: '#f5f5f5',
    textAlign: 'left',
    minHeight: '45px',
    padding: '12px',
  },
  button: {
    width: '24px',
    height: '24px',
    minHeight: '24px',
    '& svg': {
      fontSize: '1rem',
    }
  }
})

const PageSettingsButton = ({
  item,
}) => {
  const classes = useStyles()

  const [ saveTemplateWindowOpen, setSaveTemplateWindowOpen ] = useState(false)

  const actions = Actions(useDispatch(), {
    onAddPageTemplate: uiActions.addTemplate,
    onOpenContentForm: contentActions.openDialogContentForm,
  })

  const settingsHandler = useCallback(typeUI.editContentHandler({
    item: {
      id: item.id,
      driver: 'local',
      type: 'pageSettings',
    },
    location: 'root',
    structure: 'tree',
    onOpenContentForm: actions.onOpenContentForm,
  }), [item, actions])

  const openSaveHandler = useCallback(() => setSaveTemplateWindowOpen(true))
  const closeSaveHandler = useCallback(() => setSaveTemplateWindowOpen(false))
  const submitSaveHandler = useCallback(async (value) => {
    const annotation = item.annotation || {}
    await actions.onAddPageTemplate({
      name: value,
      layout: annotation.layout,
    })
    closeSaveHandler()
  }, [item])

  const menuItems = [{
    title: 'Settings',
    icon: SettingsIcon,
    handler: settingsHandler,
  }]
  
  if(item.annotation && item.annotation.layout) {
    menuItems.push({
      title: 'Save as template',
      icon: SaveIcon,
      handler: openSaveHandler,
    })
  }

  return (
    <div className={ classes.root }>
      <MenuButton
        items={ menuItems }
        icon={ SettingsIcon }
        getButton={ onClick => (
          <Tooltip title="Edit Settings">
            <Fab
              size="small"
              className={ classes.button }
              onClick={ onClick }
            >
              <SettingsIcon />
            </Fab>
          </Tooltip>
        )}
      />
      {
        saveTemplateWindowOpen && (
          <PageSettingsSaveTemplateDialog
            onSave={ submitSaveHandler }
            onCancel={ closeSaveHandler }
          />
        )
      }
    </div>
    
  )
}

export default PageSettingsButton
