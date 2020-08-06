import React, { lazy, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Divider from '@material-ui/core/Divider'
import systemSelectors from '../../store/selectors/system'

import Suspense from '../system/Suspense'
import Tree from './Tree'
import Layout from '../layout/Layout'

const Toolbar = lazy(() => import(/* webpackChunkName: "ui" */ './Toolbar'))
const DraggableLayout = lazy(() => import(/* webpackChunkName: "ui" */ '../layout/DraggableLayout'))
const DraggableTree = lazy(() => import(/* webpackChunkName: "ui" */ './DraggableTree'))

const useStyles = makeStyles(theme => ({
  root: ({autoHeight}) => ({
    height: autoHeight ? '100%' : '',
    display: 'flex',
    flexDirection: 'column',
  }),
  header: {
    flexGrow: 0,
  },
  contentContainer: ({autoHeight}) => ({
    height: autoHeight ? '100%' : '',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflowY: autoHeight ? 'auto' : '',
    overflowX: 'hidden',
  }),
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
  autoHeight = true,
  onClick,
}) => {
  const classes = useStyles({
    autoHeight,
  })
  const showUI = useSelector(systemSelectors.showUI)

  const containerRef = useRef()
  const focusRef = useRef()

  const layoutProps = {
    content_id: `section:${section}`,
    layout_id: 'widgets',
    simpleMovement: true,
    simpleEditor: true,
    divider: true,
    autoHeight: false,
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