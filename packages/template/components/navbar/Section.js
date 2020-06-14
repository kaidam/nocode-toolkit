import React, { lazy, useRef } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

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
    justifyContent: 'flex-end',
  }),
  content: ({
    vertical,
  }) => ({
    overflowY: 'auto',
    overflowX: 'hidden',
    flexGrow: 1,
  }),
  editorContainer: ({
    vertical,
  }) => ({
    flexGrow: 1,
  }),
}))

const NavBarSection = ({
  small,
  section,
  contrast,
  vertical,
  align,
  withHome,
  className,
}) => {
  const classes = useStyles({
    vertical,
    align,
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
          contrast,
          vertical,
          focusRef,
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
        small={ small }
        contrast={ contrast }
        vertical={ vertical }
        align={ align }
        withHome={ withHome }
      />
    </div>
  )

  return (
    <div
      className={ rootClassname }
    >
      { editor }
      { content }
    </div>
  )
}

export default NavBarSection