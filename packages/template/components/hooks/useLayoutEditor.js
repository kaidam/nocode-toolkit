import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'

import nocodeSelectors from '../../store/selectors/nocode'
import useWidgetMenu from './useWidgetMenu'

const useLayoutEditor = ({
  content_id,
  layout_id,
  layouts,
}) => {
  const actions = Actions(useDispatch(), {
    onLayoutAdd: layoutActions.add,
    onWidgetAdd: layoutActions.addWidget,
  })

  const annotations = useSelector(nocodeSelectors.annotations)
  const annotation = annotations[content_id] || {}
  const data = annotation[layout_id]

  const onAddWidget = useCallback(() => {
    actions.onWidgetAdd({
      content_id,
      layouts,
    })
  }, [
    content_id,
    layouts,
  ])
    
  const onAdd = useCallback(({
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

  const getAddWidgetMenu = useWidgetMenu({
    onAdd,
  })
  
  return {
    data,
    getAddWidgetMenu,
    onAddWidget,
  }
  
}

export default useLayoutEditor