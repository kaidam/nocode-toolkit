import React, { useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

import Actions from '../../utils/actions'
import selectors from '../../store/selectors'

import contentActions from '../../store/modules/content'
import finderActions from '../../store/modules/finder'

import itemTypes from '../../types/item'
import typeUI from '../../types/ui'
import icons from '../../icons'

import MenuButton from './MenuButton'

const SettingsIcon = icons.settings
const MoreVertIcon = icons.moreVert
const OpenIcon = icons.open
const SearchIcon = icons.search
const DriveIcon = icons.drive
const UndoIcon = icons.undo

const useStyles = makeStyles({
  tinyRoot: {
    width: '24px',
    height: '24px',
    minHeight: '24px',
    '& svg': {
      fontSize: '1rem',
    }
  }
})

const SectionSettings = ({
  id,
  tiny,
}) => {
  const actions = Actions(useDispatch(), {
    onOpenContentForm: contentActions.openDialogContentForm,
    onOpenFolder: finderActions.openSectionFolder,
    onAddContent: finderActions.addContent,
    onOpenFinder: finderActions.openDialogFinder,
    onRemoveContent: contentActions.removeContent,
  })

  const sectionSyncFolderSelector = useMemo(selectors.content.sectionSyncFolder, [])
  const sectionSyncFolder = useSelector(state => sectionSyncFolderSelector(state, id))
  const website = useSelector(selectors.ui.website)

  const autoFolderProp = `nocodeFolderId_${id}`
  const autoFolderId = website && website.meta ? website.meta[autoFolderProp] : null
  const sectionSyncFolderId = sectionSyncFolder && sectionSyncFolder.id

  const hasCustomSyncFolder = autoFolderId && sectionSyncFolderId && autoFolderId != sectionSyncFolderId

  const itemType = sectionSyncFolder ? itemTypes(sectionSyncFolder) : null

  const classes = useStyles()

  const settingsHandler = useCallback(typeUI.editContentHandler({
    item: {
      id,
      driver: 'local',
      type: 'section',
    },
    location: 'root',
    structure: 'tree',
    onOpenContentForm: actions.onOpenContentForm,
  }), [id, actions])

  const settingsItem = {
    title: 'Settings',
    icon: SettingsIcon,
    handler: settingsHandler,
  }

  const openItem = {
    title: 'Open in Google Drive',
    icon: OpenIcon,
    secondaryIcon: DriveIcon,
    url: itemType ? itemType.getItemUrl(sectionSyncFolder) : null,
  }

  const changeSyncFolder = sectionSyncFolder ? {
    title: `Change folder`,
    icon: SearchIcon,
    secondaryIcon: DriveIcon,
    handler: () => {
      actions.onOpenFinder({
        driver: 'drive',
        location: `section:${id}`,
        params: {
          listFilter: 'folder',
          addFilter: 'folder',
          mode: 'sync',
        }
      })
    }
  } : null

  const revertSyncFolder = sectionSyncFolder ? {
    title: `Reset folder`,
    icon: UndoIcon,
    secondaryIcon: DriveIcon,
    handler: () => {
      actions.onAddContent({
        id: autoFolderId,
        data: {
          ghost: true,
        },
        overrides: {
          driver: 'drive',
          location: `section:${id}`,
          mode: 'sync',
        }
      })
    }
  } : null

  const useItems = [
    settingsItem,
    openItem,
    changeSyncFolder,
    hasCustomSyncFolder ? revertSyncFolder : null,
  ].filter(i => i)
    
  return (
    <MenuButton
      items={ useItems }
      tiny
      getButton={ onClick => (
        <Tooltip title="Edit Settings">
          <Fab
            size="small"
            className={ tiny ? classes.tinyRoot : null }
            onClick={ onClick }
          >
            <MoreVertIcon />
          </Fab>
        </Tooltip>
      )}
    />
  )
}

export default SectionSettings