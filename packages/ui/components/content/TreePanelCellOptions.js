import React from 'react'
import { useDispatch } from 'react-redux'
import Actions from '../../utils/actions'
import sectionActions from '../../store/modules/section'
import CellOptions from '../layout/CellOptions'

const TreePanelCellOptionsWrapper = (props) => {
  const actions = Actions(useDispatch(), {
    editLayout: sectionActions.editLayout,
    saveContent: sectionActions.saveContent,
  })
  return (
    <CellOptions
      onEditLayout={ actions.editLayout }
      onSaveContent={ actions.saveContent }
      {...props}
    />
  )
}

export default TreePanelCellOptionsWrapper