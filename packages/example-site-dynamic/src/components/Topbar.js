import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import MoreVert from '@material-ui/icons/MoreVert'

import { Link } from '@nocodesites/utils'

import styles from '../styles/topbar'
import config from '../config'
import documentUtils from '../utils/document'

class Topbar extends React.Component {

  state = {
    anchorEl: null,
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  // merge the static pages configured in config.js with the google docs
  getDataPages() {
    const { 
      pages,
      websiteSettings,
    } = this.props

    let externalPages = []
    
    if(websiteSettings.topbarExternalLinks) {
      try {
        externalPages = JSON.parse(websiteSettings.topbarExternalLinks || '[]')
        externalPages = externalPages.map(page => {
          return Object.assign({}, page, {
            external: true,
          })
        })
      } catch(e) {
        console.error(e)
      }
    }
    
    const googlePages = (pages || []).map(page => {
      return {
        title: page.name,
        url: documentUtils.url(page)
      }
    })

    const allPages = [{
      title: 'Home',
      url: '/',
    }].concat(googlePages).concat(externalPages)

    return allPages
  }

  getPageLink(page, className) {
    const {
      pathname,
      classes,
    } = this.props
    className = page.url.replace(/\/$/, '') == pathname.replace(/\/$/, '') ? `${className} ${classes.navActive}` : className

    return page.external ? (
      <a
        href={ page.url}
        className={ className }
      >
        { page.title }
      </a>
    ) : (
      <Link
        to={ page.url }
        className={ className }
      >
        { page.title }
      </Link>
    )
  }

  getLargeNav() {
    const { 
      pathname,
      classes,
    } = this.props
    const allPages = this.getDataPages()
    return (
      <nav className={ classes.largeNav }>
        <ul className={ classes.navUl }>
          {
            allPages.map((page, i) => {
              const className = pathname == page.url ? 'highlight-link' : ''

              return (
                <li
                  key={ i }
                  className={ classes.navLi }
                >
                  { this.getPageLink(page, classes.navLiA) }
                </li>
              )
            })
          }
        </ul>
      </nav>
    )
  }

  getSmallNav() {
    const { 
      pathname,
      classes,
    } = this.props
    const allPages = this.getDataPages()
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <div className={ classes.smallNav }>
        <IconButton
          aria-owns={ open ? 'menu-appbar' : null }
          aria-haspopup="true"
          onClick={ this.handleMenu }
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={ anchorEl }
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={ open }
          onClose={ this.handleClose }
        >
          {
            allPages.map((page, i) => {
              return (
                <MenuItem
                  key={ i }
                >
                  { this.getPageLink(page, classes.smallNavA) }
                </MenuItem>
              )
            })
          }
        </Menu>
      </div>
    )
  }

  render() {
    return (
      <div>
        { this.getSmallNav() }
        { this.getLargeNav() }
      </div>
    )
  }
}

Topbar.propTypes = {
  classes: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired,
  pages: PropTypes.array.isRequired,
}

export default withStyles(styles)(Topbar)
