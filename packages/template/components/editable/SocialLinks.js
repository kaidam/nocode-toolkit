import React, { lazy } from 'react'
import { useSelector } from 'react-redux'

import Suspense from '../system/Suspense'
import systemSelectors from '../../store/selectors/system'

import Widget from '../../widgets/SocialLinks'

const WidgetRender = Widget.Render
const EditableSettings = lazy(() => import(/* webpackChunkName: "ui" */ '../settings/EditableSettings'))

const SocialLinks = ({
  
}) => {
  const showUI = useSelector(systemSelectors.showUI)

  const content = (
    <WidgetRender
      getEmptyContent={ () => {
        return showUI ? (
          <span style={{
            color: '#666',
            backgroundColor: '#fff',
            padding: '5px',
            //fontSize: '0.8em'
          }}>click to edit your social links</span>
        ) : null
      }}
    />
  )

  return showUI ? (
    <Suspense>
      <EditableSettings
        title="Social Links"
        group="social_links"
      >
        { content }
      </EditableSettings>
    </Suspense>
  ) : content
}

export default SocialLinks