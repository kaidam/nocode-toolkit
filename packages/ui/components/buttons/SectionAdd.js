import React, { useMemo, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'

import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

import Actions from '../../utils/actions'

import contentActions from '../../store/modules/content'
import finderActions from '../../store/modules/finder'

import typeUI from '../../types/ui'
import icons from '../../icons'

import MenuButton from './MenuButton'

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

const SectionAdd = ({
  id,
  filter,
  location,
  structure,
  sectionType,
  tiny,
  stashQueryParams,
  extraItems = [],
  getButton,
}) => {
  const actions = Actions(useDispatch(), {
    onOpenContentForm: contentActions.openDialogContentForm,
    onOpenFinder: finderActions.openDialogFinder,
  })
  const classes = useStyles()
  const menuItems = useMemo(
    () => {
      const baseItems = typeUI.addContentOptions({
        filter,
        location,
        structure,
        sectionType,
        stashQueryParams,
        onOpenContentForm: actions.onOpenContentForm,
        onOpenFinder: actions.onOpenFinder,
      })

      const allItems = baseItems.concat(extraItems || [])
      const groups = allItems.filter(item => item.isGroup)
      const nonGroups = allItems.filter(item => !item.isGroup)
      return groups.concat(nonGroups)
    },
    [
      filter,
      location,
      structure,
      sectionType,
      stashQueryParams,
      window._nocodeRebuildCount,
      extraItems,
    ]
  )

  return (
    <MenuButton
      items={ menuItems }
      tiny
      getButton={ onClick => {
        if(getButton) return getButton(onClick)
        return (
          <Tooltip title="Add Content">
            <Fab
              size="small"
              color="secondary"
              className={ tiny ? classes.tinyRoot : null }
              onClick={ onClick }
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        )
      }}
    />
  )
}

export default SectionAdd