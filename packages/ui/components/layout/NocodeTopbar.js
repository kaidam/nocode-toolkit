import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

import GlobalOptions from '../buttons/GlobalOptions'

const useStyles = makeStyles(theme => createStyles({
  appBar: {
    position: 'relative',
    zIndex: theme.zIndex.drawer + 1,
    height: [`${theme.layout.uiTopbarHeight}px`, '!important'],
    backgroundColor: '#fff',
    boxShadow: 'none',
    borderBottom: 'solid 3px rgba(0, 0, 0, 1)',
  },
  toolbar: {
    height: [`${theme.layout.uiTopbarHeight}px`, '!important'],
    minHeight: [`${theme.layout.uiTopbarHeight}px`, '!important'],
    maxHeight: [`${theme.layout.uiTopbarHeight}px`, '!important'],
  },
  appBarTitle: {
    flexGrow: 1,
  },
  logo: {
    height: `${theme.layout.uiLogoHeight}px`,
    padding: '3px',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    color: '#000',
  },
  globalOptions: {
    paddingRight: theme.spacing(1.5),
  }
}))

const NocodeTopbar = ({

}) => {
  const classes = useStyles()

  return (
    <AppBar 
      position="static" 
      className={ classes.appBar }
    >
      <Toolbar
        className={ classes.toolbar }
      >
        <div className={ classes.appBarTitle }>
          <a
            href="/"
          >
            <img src="images/favicon.png" className={ classes.logo } />
          </a>
        </div>
        <div className={ classes.globalOptions }>
          <GlobalOptions />
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default NocodeTopbar
