import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'

import nocodeSelectors from '../../store/selectors/nocode'
import useWidgetMenu from './useWidgetMenu'

const useLayoutEditor = ({
  content_id,
  layout_id,
}) => {
  const actions = Actions(useDispatch(), {
    onLayoutAdd: layoutActions.add,
  })

  const annotations = useSelector(nocodeSelectors.annotations)
  const annotation = annotations[content_id] || {}
  const data = annotation[layout_id]

  const onAddWidget = useCallback(({
    form,
    data,
    rowIndex = -1,
  }) => {
    actions.onLayoutAdd({
      content_id,
      layout_id,
      form,
      data,
      rowIndex,
    })
  }, [
    content_id,
    layout_id,
  ])

  const getAddMenu = useWidgetMenu({
    onAdd: onAddWidget,
  })
  
  return {
    data,
    getAddMenu,
  }
  
}

export default useLayoutEditor