import React, { lazy, useRef } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Divider from '@material-ui/core/Divider'

import systemSelectors from '../../store/selectors/system'

import Suspense from '../system/Suspense'
import NavBar from './NavBar'

const Settings = lazy(() => import(/* webpackChunkName: "ui" */ './Settings'))

const useStyles = makeStyles(theme => ({
  root: ({
    vertical,
  }) => ({
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    alignItems: 'center',
  }),
  content: ({
    vertical,
  }) => ({
    // overflowY: 'auto',
    // overflowX: 'hidden',
    // flexGrow: 1,
  }),
  editor: ({
    vertical,
  }) => ({
    //flexGrow: 1,
  }),
}))

const NavBarSection = ({
  small,
  section,
  items,
  contrast,
  vertical,
  align = 'left',
  editable = true,
  withSettings = true,
  isItemActive,
  className,
  getAddItems,
}) => {
  const classes = useStyles({
    vertical,
    align,
    contrast,
  })
  const showUI = useSelector(systemSelectors.showUI)
  const rootClassname = classnames(classes.root, className)
  const focusRef = useRef()

  const editor = showUI ? (
    <div className={ classes.editorContainer }>
      <Suspense
        Component={ Settings }
        props={{
          section,
          small,
          contrast,
          vertical,
          focusRef,
          align,
          getAddItems,
          withSettings,
        }}
      />
    </div>
  ) : null

  const content = (
    <div
      className={ classes.content }
      ref={ focusRef }
    >
      <NavBar
        section={ section }
        items={ items }
        editable={ editable }
        small={ small }
        contrast={ contrast }
        vertical={ vertical }
        align={ align }
        isItemActive={ isItemActive }
      />
    </div>
  )

  const renderContent = align == 'left' ? (
    <>
      { editor }
      { content }
    </>
  ) : (
    <>
      { content }
      { editor }
    </>
  )

  return (
    <div
      className={ rootClassname }
    >
      { renderContent }
    </div>
  )
}

export default NavBarSection