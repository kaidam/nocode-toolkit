import React, { lazy, useRef } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import systemSelectors from '../../store/selectors/system'

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
      'flex-start' :
      'center',
  }),
  content: ({
    vertical,
  }) => ({
    overflowY: 'auto',
    overflowX: 'hidden',
    flexGrow: 1,
    padding: vertical ?
      theme.spacing(1) :
      0,
  }),
  editor: ({
    vertical,
  }) => ({
    flexGrow: 0,
    paddingTop: vertical ?
      theme.spacing(2) :
      0,
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

  return (
    <div
      className={ rootClassname }
    >
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
        />
      </div>
      {
        showUI && (
          <div className={ classes.editor }>
            <Suspense
              Component={ EditableNavBar }
              props={{
                section,
                contrast,
              }}
            />
          </div>
        )
      }
    </div>
  )
}

export default NavBarSection