import React from 'react'
import { useDispatch } from 'react-redux'
import Actions from '../../utils/actions'
import documentActions from '../../store/modules/document'
import CellOptions from '../layout/CellOptions'

const CellOptionsWrapper = (props) => {
  const actions = Actions(useDispatch(), {
    editLayout: documentActions.editLayout,
    saveContent: documentActions.saveContent,
  })
  return (
    <CellOptions
      onEditLayout={ actions.editLayout }
      onSaveContent={ actions.saveContent }
      {...props}
    />
  )
}

export default CellOptionsWrapper