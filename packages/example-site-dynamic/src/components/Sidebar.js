import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'

import FolderIcon from '@material-ui/icons/Folder'
import DocumentIcon from '@material-ui/icons/InsertDriveFile'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Link from '@nocode-toolkit/website/src/Link'

import styles from '../styles/sidebar'

const AddContentDialog = lazy(() => import(/* webpackChunkName: "ui" */ './AddContentDialog'))

class Sidebar extends React.Component {

  constructor(props) {
    super(props)
    const {      
      currentItem,
    } = this.props

    this.state = {
      pathToItem: this.getPathToItem(currentItem),
    }
  }

  getPathToItem(itemId) {
    const {      
      allItems,
    } = this.props

    const parentIds = Object.keys(allItems).reduce((all, id) => {
      const item = allItems[id]
      const childrenIds = item.children || []
      childrenIds.forEach(childId => {
        all[childId] = id
      })
      return all
    }, {})

    const pathToItem = []
    let nextParentId = parentIds[itemId]

    while(nextParentId != null) {
      pathToItem.unshift(nextParentId)
      nextParentId = parentIds[nextParentId]
    }

    return pathToItem
  }

  componentDidUpdate(prevProps) {
    const {      
      currentItem,
    } = this.props

    if(currentItem != prevProps.currentItem) {
      this.updatePathToItem(this.getPathToItem(currentItem))
    }
  }

  updatePathToItem(pathToItem) {
    this.setState({
      pathToItem,
    })
  }

  onClick() {
    if(!this.props.onClick) return
    this.props.onClick()
  }

  renderItem(path, item) {
    const {
      allItems,
    } = this.props
    const childItems = (item.children || []).map(id => allItems[id])
    return this.renderItems(path, childItems)
  }

  renderItems(path, items) {

    const {
      classes,
      currentItem,
    } = this.props

    if(items.length <= 0) return null

    const openFolders = this.state.pathToItem

    return (
      <List>
        {
          items.map((item, i) => {

            const isFolder = item.type == 'folder'
            const isOpen = openFolders.indexOf(item.id) >= 0
            const isCurrentPage = currentItem == item.id

            const backgoundClassname = isCurrentPage ? classes.highlightListItemBackground : classes.normalListItemBackground
            const colorClassName = isCurrentPage ? classes.highlightListItem : classes.normalListItem
            
            const listItemContents = (
              <div key={ i }>
                <ListItem
                  button
                  dense
                  className={ backgoundClassname }
                  selected={ isCurrentPage }
                  onClick={ () => {
                    if(isFolder) {
                      const newPath = isOpen ? 
                        path :
                        path.concat(item.id)
                      this.updatePathToItem(newPath)
                    }
                  }}
                >
                  <ListItemIcon>
                    {
                      isFolder ? (
                        <FolderIcon 
                          className={ colorClassName }
                        />
                      ) : (
                        <DocumentIcon 
                          className={ colorClassName }
                        />
                      )
                    }
                  </ListItemIcon>
                  <Typography
                    className={ colorClassName }
                  >
                    { item.name }
                  </Typography>
                  {
                    isFolder ?
                      isOpen ? 
                        null : 
                        <ExpandMoreIcon className={ colorClassName } />
                        
                    : null
                  }
                </ListItem>
                {
                  isFolder ? (
                    <Collapse in={ isOpen } timeout="auto" unmountOnExit>
                      <div className={ classes.sublist }>
                        { this.renderItem(path.concat([item.id]), item) }
                      </div>
                    </Collapse>
                  ) : null
                }
              </div>
            )

            return isFolder ? listItemContents : (
              <Link
                path={ `/${item.id}` }
                onClick={ () => this.onClick(item.fullUrl) }
                key={ i }
              >
                { listItemContents } 
              </Link>
            )
          })
        }
      </List>
    )
  }

  render() {
    const {
      rootItems,
      showUI,
    } = this.props

    const list = this.renderItem([], {
      children: rootItems,
    })

    return (
      <React.Fragment>
        { list }
        {
          showUI && (
            <Suspense fallback={<div>loading...</div>}>
              <AddContentDialog />
            </Suspense>
          )
        }
      </React.Fragment>
    )
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Sidebar)