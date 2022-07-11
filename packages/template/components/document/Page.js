import React, { lazy } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import contentSelectors from '../../store/selectors/content'
import settingsSelectors from '../../store/selectors/settings'
import Layout from '../layout/Layout'
import useGoogleDocumentImages from '../hooks/useGoogleDocumentImages'

const useStyles = makeStyles(theme => ({
  container: ({
    imageDropshadow,
    autoLineHeight,
  }) => {

    const ret = {
      '& h1,h2,h3,h4,h5,h6': {
        'wordBreak': 'break-word',
      }
    }

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

  useGoogleDocumentImages({
    containerSelector: '.document-container'
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
