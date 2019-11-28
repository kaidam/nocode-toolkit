import React, { useCallback } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import {
  useDispatch,
  nocodeActions,
} from '@nocode-toolkit/website/actions'

import {
  useRoute,
} from '@nocode-toolkit/website/selectors'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Header from '@nocode-toolkit/ui/components/core/Header'
import Link from '@nocode-toolkit/ui/components/core/Link'

const useStyles = makeStyles(theme => createStyles({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  link: {
    textDecoration: 'none',
    '& *': {
      color: '#fff',
      textDecoration: 'none',
    }
  },
  contentChildren: {
    padding: theme.spacing(3),
  },
}))

const Layout = ({
  children,
}) => {
  const classes = useStyles()
  const route = useRoute()
  const dispatch = useDispatch()
  const changeMessage = useCallback((message) => {
    dispatch(nocodeActions.setConfig({
      name: 'clickMessage',
      data: message,
    }))
  }, [])
  return (
    <div className={classes.root}>
      <Header
        title={ `TEST SITE: ${route.name}` }
      >
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link rel="stylesheet" href="site.css" />
      </Header>
      
      <AppBar 
        position="static"
      >
        <Toolbar>

          <div className={ classes.grow }>
            
            <Link
              path="/"
              className={ classes.link }
              onClick={ () => changeMessage('clicked homepage') }
            >
              <Typography variant="h6" color="inherit">
                Material UI example
              </Typography>
            </Link>
            
          </div>

          <div className={ classes.grow }>
            <Link
              path="/apples"
              className={ classes.link }
              onClick={ () => changeMessage('clicked apples') }
            >
              <Typography variant="h6" color="inherit">
                Apples
              </Typography>
            </Link>
          </div>

          <div className={ classes.grow }>
            <Link
              path="/oranges"
              className={ classes.link }
              onClick={ () => changeMessage('clicked oranges') }
            >
              <Typography variant="h6" color="inherit">
                Oranges
              </Typography>
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <main>
        <div className={ classes.contentChildren }>
          { children }
        </div>
      </main>
    </div>
  )
}

export default Layout