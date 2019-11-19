import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'

import Fab from '@material-ui/core/Fab'

import Actions from '../../utils/actions'

import contentActions from '../../store/modules/content'
import finderActions from '../../store/modules/finder'

import typeUI from '../../types/ui'
import icons from '../../icons'

import MenuButton from './MenuButton'

const EditIcon = icons.edit
const AddIcon = icons.add
const SettingsIcon = icons.settings

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

const SectionEditor = ({
  id,
  filter,
  location,
  structure,
  tiny,
  stashQueryParams,
}) => {
  const actions = Actions(useDispatch(), {
    onOpenContentForm: contentActions.openDialogContentForm,
    onOpenFinder: finderActions.openDialogFinder,
  })
  const classes = useStyles()

  const menuItems = useMemo(
    () => {
      const items = []

      const addMenuItems = typeUI.addContentOptions({
        filter,
        location,
        structure,
        stashQueryParams,
        onOpenContentForm: actions.onOpenContentForm,
        onOpenFinder: actions.onOpenFinder,
      })

      items.push({
        title: 'Add Content',
        help: `Add content to this section`,
        icon: AddIcon,
        items: addMenuItems,
      })

      items.push({
        title: 'Settings',
        help: `Configure this section`,
        icon: SettingsIcon,
        handler: typeUI.editContentHandler({
          item: {
            id,
            driver: 'local',
            type: 'section',
          },
          location: 'root',
          structure: 'tree',
          onOpenContentForm: actions.onOpenContentForm,
        }),
      })

      return items
    },
    [
      filter,
      location,
      structure,
      stashQueryParams,
      window._nocodeRebuldCount,
    ]
  )

  return (
    <MenuButton
      items={ menuItems }
      tiny
      getButton={ onClick => (
        <Fab
          size="small"
          color="secondary"
          className={ tiny ? classes.tinyRoot : null }
          onClick={ onClick }
        >
          <EditIcon />
        </Fab>
      )}
    />
  )
}

export default SectionEditor