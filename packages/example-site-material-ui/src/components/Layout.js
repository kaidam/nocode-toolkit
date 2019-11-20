import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import selectors from '@nocode-toolkit/website/src/selectors'
import Header from '@nocode-toolkit/website/src/Header'
import Link from '@nocode-toolkit/website/src/Link'
import nocodeActions from '@nocode-toolkit/website/src/store/moduleNocode'

const changeColor = (color) => nocodeActions.setConfig({
  name: 'primaryColor',
  data: color,
})

const styles = theme => {
  return {
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
    }
  }
}

@connect(
  state => {
    const route = selectors.router.route(state)
    return {
      route,
    }
  },
  {
    changeColor,
  }
)
class Layout extends React.Component {

  render() {
    const {
      classes,
      changeColor,
      route,
      children,
    } = this.props

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
                onClick={ () => changeColor('#ff0000') }
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
                onClick={ () => changeColor('#0000ff') }
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
                onClick={ () => changeColor('#ff0000') }
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
}

export default withStyles(styles)(Layout)