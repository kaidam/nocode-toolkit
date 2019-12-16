import React, { useMemo } from 'react'
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
      return typeUI.addContentOptions({
        filter,
        location,
        structure,
        stashQueryParams,
        onOpenContentForm: actions.onOpenContentForm,
        onOpenFinder: actions.onOpenFinder,
      })
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
      )}
    />
  )
}

export default SectionEditor