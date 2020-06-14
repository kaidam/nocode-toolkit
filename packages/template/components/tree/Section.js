import React, { lazy, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import systemSelectors from '../../store/selectors/system'

import Suspense from '../system/Suspense'
import Tree from './Tree'
import Layout from '../layout/Layout'

const EditableToolbar = lazy(() => import(/* webpackChunkName: "ui" */ './EditableToolbar'))
const EditableLayout = lazy(() => import(/* webpackChunkName: "ui" */ '../layout/EditableLayout'))
const EditableTree = lazy(() => import(/* webpackChunkName: "ui" */ './EditableTree'))

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
  contentContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
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
  
  const containerRef = useRef()
  const focusRef = useRef()

  const layoutProps = {
    content_id: `section:${section}`,
    layout_id: 'widgets',
    simpleMovement: true,
    divider: true,
  }

  return (
    <div
      className={ classes.root }
    >
      {
        showUI && (
          <div className={ classes.header }>
            <Suspense
              Component={ EditableToolbar }
              props={{
                section,
                focusRef,
              }}
            />
          </div>
        )
      }
      <div ref={ focusRef } className={ classes.contentContainer }>
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
        <div
          className={ classes.content }
          ref={ containerRef }
        >
          {
            showUI ? (
              <Suspense>
                <EditableTree
                  section={ section }
                  containerRef={ containerRef }
                />
              </Suspense>
            ) : (
              <Tree
                section={ section }
                containerRef={ containerRef }
              />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default TreeSection