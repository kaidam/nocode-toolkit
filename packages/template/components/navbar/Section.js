import React, { lazy, useRef } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import systemSelectors from '../../store/selectors/system'
import settingsSelectors from '../../store/selectors/settings'

import Suspense from '../system/Suspense'
import NavBar from './NavBar'

const EditableNavBar = lazy(() => import(/* webpackChunkName: "ui" */ './EditableNavBar'))

const useStyles = makeStyles(theme => ({
  root: ({
    vertical,
  }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: vertical ?
      'center' :
      'center',
  }),
  content: ({
    vertical,
  }) => ({
    overflowY: 'auto',
    overflowX: 'hidden',
    flexGrow: 1,
  }),
  editor: ({
    vertical,
  }) => ({
    flexGrow: 0,
    paddingLeft: theme.spacing(2),
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
  const settings = useSelector(settingsSelectors.settings)
  const folderPages = settings.folderPages === 'yes'

  const editor = showUI ? (
    <div className={ classes.editor }>
      <Suspense
        Component={ EditableNavBar }
        props={{
          section,
          contrast,
        }}
      />
    </div>
  ) : null

  const content = (
    <div
      className={ classes.content }
    >
      <NavBar
        section={ section }
        small={ small }
        contrast={ contrast }
        vertical={ vertical }
        align={ align }
        withHome={ withHome }
        folderPages={ folderPages }
      />
    </div>
  )

  return (
    <div
      className={ rootClassname }
    >
      
      { content }
      { editor }
    </div>
  )
}

export default NavBarSection