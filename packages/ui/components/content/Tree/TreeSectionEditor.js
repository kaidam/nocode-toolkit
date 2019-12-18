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

  return (
    <SectionEditor
      id={ section }
      tiny
      filter={ parentFilter }
      location={ `section:${section}` }
      structure="tree"
    >
      {
        hasPanelTop ? null : (
          <span style={{
            paddingRight: '8px',
          }}>
            <SmallIconButton
              tiny
              color="default"
              Icon={ AddPanelTopIcon }
              tooltip="Add Panel Above"
              onClick={ () => actions.onAddPanel({
                section,
                panelName: 'panelTop',
              }) }
            />
          </span>
        )
      }
      {
        hasPanelBottom ? null : (
          <span style={{
            paddingRight: '8px',
          }}>
            <SmallIconButton
              tiny
              color="default"
              Icon={ AddPanelBottomIcon }
              tooltip="Add Panel Below"
              onClick={ () => actions.onAddPanel({
                section,
                panelName: 'panelBottom',
              }) }
            />
          </span>
        )
      }
    </SectionEditor>
  )
}

export default TreeSectionEditor