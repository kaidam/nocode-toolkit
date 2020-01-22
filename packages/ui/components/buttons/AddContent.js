import React from 'react'
import { useDispatch } from 'react-redux'
import Fab from '@material-ui/core/Fab'

import Actions from '../../utils/actions'

import contentActions from '../../store/modules/content'
import finderActions from '../../store/modules/finder'

import typeUI from '../../types/ui'
import icons from '../../icons'

import MenuButton from './MenuButton'

const AddIcon = icons.add

const AddContent = ({
  filter,
  location,
  structure,
  stashQueryParams,
  getButton,
}) => {

  const actions = Actions(useDispatch(), {
    onOpenContentForm: contentActions.openDialogContentForm,
    onOpenFinder: finderActions.openDialogFinder,
  })
  
  const menuItems = typeUI.addContentOptions({
    filter,
    location,
    structure,
    stashQueryParams,
    onOpenContentForm: actions.onOpenContentForm,
    onOpenFinder: actions.onOpenFinder,
  })
  
  return (
    <MenuButton
      items={ menuItems }
      getButton={ onClick => {
        if(getButton) return getButton(onClick)
        return (
          <Fab
            size="small"
            color="secondary"
            onClick={ onClick }
          >
            <AddIcon />
          </Fab>
        )
      }}
    />
  )
}

export default AddContent