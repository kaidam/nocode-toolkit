import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import selectors from '../../../store/selectors'
import SmallIconButton from '../../buttons/SmallIconButton'
import icons from '../../../icons'

import Actions from '../../../utils/actions'
import sectionActions from '../../../store/modules/section'

import SectionEditor from '../../buttons/SectionEditor'

const AddPanelTopIcon = icons.addPanelTop
const AddPanelBottomIcon = icons.addPanelBottom

const TreeSectionEditor = ({
  section,
}) => {

  const actions = Actions(useDispatch(), {
    onAddPanel: sectionActions.addPanel,
  })

  const sectionPanelSelector = useMemo(selectors.section.panels, [])
  const panelData = useSelector(state => sectionPanelSelector(state, section))

  const parentFilter = useCallback((parentFilter) => parentFilter.indexOf('section') >= 0)
  const hasPanelTop = panelData.panelTop ? true : false
  const hasPanelBottom = panelData.panelBottom ? true : false

  const extraAddItems = useMemo(() => {
    const panels = []

    if(!hasPanelTop) {
      panels.push({
        title: 'Add panel above',
        icon: AddPanelTopIcon,
        handler: () => actions.onAddPanel({
          section,
          panelName: 'panelTop',
        })
      })
    }
    if(!hasPanelBottom) {
      panels.push({
        title: 'Add panel below',
        icon: AddPanelBottomIcon,
        handler: () => actions.onAddPanel({
          section,
          panelName: 'panelBottom',
        })
      })
    }

    if(panels.length > 0) {
      return [{
        title: 'Panel',
        icon: AddPanelTopIcon,
        items: panels,
      }]
    }
  }, [
    hasPanelTop,
    hasPanelBottom,
    section,
  ])

  return (
    <SectionEditor
      id={ section }
      tiny
      filter={ parentFilter }
      location={ `section:${section}` }
      structure="tree"
      extraAddItems={ extraAddItems }
    />
  )
}

export default TreeSectionEditor