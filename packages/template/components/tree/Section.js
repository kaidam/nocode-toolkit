import React, { lazy, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import settingsSelectors from '../../store/selectors/settings'
import systemSelectors from '../../store/selectors/system'

import Suspense from '../system/Suspense'
import Tree from './Tree'
import Layout from '../layout/Layout'

const EditableTree = lazy(() => import(/* webpackChunkName: "ui" */ './EditableTree'))
const EditableTreeWidgets = lazy(() => import(/* webpackChunkName: "ui" */ './EditableTreeWidgets'))
const EditableLayout = lazy(() => import(/* webpackChunkName: "ui" */ '../layout/EditableLayout'))

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  header: {
    flexGrow: 0,
  },
  widgets: {
    flexGrow: 0,
  },
  content: {
    flexGrow: 1,
  },
}))

const TreeSection = ({
  section,
}) => {
  const classes = useStyles()
  const showUI = useSelector(systemSelectors.showUI)
  const settings = useSelector(settingsSelectors.settings)
  const folderPages = settings.folderPages === 'yes'
  const containerRef = useRef()

  const layoutProps = {
    content_id: `section:${section}`,
    layout_id: 'widgets',
    simpleMovement: true,
  }

  return (
    <div
      className={ classes.root }
    >
      {
        showUI && (
          <div className={ classes.header }>
            <Suspense
              Component={ EditableTreeWidgets }
              props={ layoutProps }
            />
          </div>
        )
      }
      {
        showUI ? (
          <Suspense
            Component={ EditableLayout }
            props={ layoutProps }
          />
        ) : (
          <Layout { ...layoutProps } />
        )
      }
      {
        showUI && (
          <div className={ classes.header }>
            <Suspense
              Component={ EditableTree }
              props={{
                section,
              }}
            />
          </div>
        )
      }
      <div
        className={ classes.content }
        ref={ containerRef }
      >
        <Tree
          section={ section }
          folderPages={ folderPages }
          containerRef={ containerRef }
        />
      </div>
    </div>
  )
}

export default TreeSection