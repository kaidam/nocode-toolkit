import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import MenuIcon from '@material-ui/icons/Menu'
import Divider from '@material-ui/core/Divider'

import selectors from '@nocode-toolkit/website/lib/selectors'
import Header from '@nocode-toolkit/website/lib/Header'
import Link from '@nocode-toolkit/website/lib/Link'

import styles from '../styles/layout'

import Sidebar from '../components/Sidebar'
//import Topbar from '../components/Topbar'
//import Footer from '../components/Footer'

@connect((state, ownProps) => {
  return {
    route: selectors.router.route(state),
    queryParams: selectors.router.queryParams(state),
    allItems: selectors.nocode.itemGroup(state, 'content'),
    sidebarItems: selectors.nocode.item(state, 'root', 'sidebar'),
    config: selectors.nocode.config(state),
    pathname: selectors.router.path(state),
    logoUrl: null,
    showUI: selectors.nocode.config(state, 'showUI'),
  }
})
class Layout extends React.Component {

  state = {
    drawerOpen: false,
  }

  constructor(props) {
    super(props)
    this.openDrawer = this.toggleDrawerHandler.bind(this, true)
    this.closeDrawer = this.toggleDrawerHandler.bind(this, false)
  }

  toggleDrawerHandler = (open) => {
    this.setState({
      drawerOpen: open,
    })
  }

  render() {
    const { 
      classes,
      children,
      config,
      route,
      queryParams,
      allItems,
      sidebarItems,
      pathname,
      showUI,
    } = this.props

    return (
      <div className={ classes.root }>
        <Header
          title={ config.title || 'Website Title' } 
          meta={[
            { name: "description", content: config.description },
            { name: "keywords", content: config.keywords },
          ]}
        >    
          <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        </Header>
        <AppBar 
          position="static" 
          className={ classes.appBar }
        >
          <Toolbar classes={{
            root: classes.toolbar,
          }}>
            <IconButton 
              className={ classes.smallNav }
              aria-label="Menu"
              onClick={ this.openDrawer }
            >
              <MenuIcon className={ classes.smallNavButton } />
            </IconButton>
            <Drawer 
              open={ this.state.drawerOpen }
              onClose={ this.closeDrawer }
              className={ classes.smallNav }
            >
              <div className={ [classes.drawer, classes.smallNav].join(' ') }>
                <Sidebar
                  allItems={ allItems }
                  rootItems={ sidebarItems }
                  currentItem={ route.item }
                  onClick={ this.closeDrawer }
                  showUI={ showUI }
                />
              </div>
            </Drawer>
            <div className={ classes.appBarTitle }>
              <Link
                path="/"
              >
                logo
              </Link>
            </div>
            <div>topbar</div>
          </Toolbar>
        </AppBar>
        <div className={ classes.main }>
          <div className={ [classes.drawer, classes.largeNav].join(' ') }>
            <Sidebar
              allItems={ allItems }
              rootItems={ sidebarItems }
              currentItem={ route.item }
              showUI={ showUI }
            />
          </div>
          
          <main className={ classes.content }>
            <div className={ classes.contentChildren }>
              { children }
            </div>
            <Divider />
            <div className={ classes.footer }>
              footer
            </div>
          </main>
        </div>
      </div>
    )
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Layout)

/*

  <img src={ logoUrl } className={ classes.logo } />

  <Topbar
    pages={ topbarPages }
    pathname={ pathname }
  />


  <Footer 
    websiteSettings={ websiteSettings }
  />

*/