import React, { lazy } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import contentSelectors from '../../store/selectors/content'
import settingsSelectors from '../../store/selectors/settings'
import Layout from '../layout/Layout'

const useStyles = makeStyles(theme => ({
  container: ({
    imageDropshadow,
    autoLineHeight,
  }) => {

    const ret = {}

    if(imageDropshadow) {
      ret['& .nocode-document-image-container'] = {
        boxShadow: '0px 5px 5px 0px rgba(0,0,0,0.2)',
      }
      ret['& .nocode-document-image'] = {
        display: 'block',
      }
    }

    if(autoLineHeight) {
      ret['& #nocode-document-html p'] = {
        lineHeight: [1.5, '!important'],
      }
    }

    return ret
  }
}))

const DocumentPage = ({

} = {}) => {

  const settings = useSelector(settingsSelectors.settings)

  const {
    node,
    layout,
  } = useSelector(contentSelectors.document)

  const classes = useStyles({
    imageDropshadow: settings.imageDropshadow,
    autoLineHeight: settings.autoLineHeight
  })

  return (
    <div className="document-container">
      <div className={ classes.container }>
        <Layout
          content_id={ node.id }
          layout_id={ 'layout' }
          layout_data={ layout }
          editable={ false }
        />
      </div>
    </div>
  )
}

export default DocumentPage
