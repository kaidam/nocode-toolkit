import React, { lazy, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import systemSelectors from '../../store/selectors/system'

import Suspense from '../system/Suspense'
import Tree from './Tree'
import Layout from '../layout/Layout'

const Toolbar = lazy(() => import(/* webpackChunkName: "ui" */ './Toolbar'))
const DraggableLayout = lazy(() => import(/* webpackChunkName: "ui" */ '../layout/DraggableLayout'))
const DraggableTree = lazy(() => import(/* webpackChunkName: "ui" */ './DraggableTree'))

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
  type,
  isNavDrawer,
  onClick,
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
              Component={ Toolbar }
              props={{
                section,
                type,
                focusRef,
                isNavDrawer,
              }}
            />
          </div>
        )
      }
      <div ref={ focusRef } className={ classes.contentContainer }>
        {
          showUI ? (
            <Suspense
              Component={ DraggableLayout }
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
                <DraggableTree
                  section={ section }
                  containerRef={ containerRef }
                  onClick={ onClick }
                />
              </Suspense>
            ) : (
              <Tree
                section={ section }
                containerRef={ containerRef }
                onClick={ onClick }
              />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default TreeSection