import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import selectors from '@nocode-toolkit/website/src/selectors'

import styles from '../styles/document'

@connect((state, ownProps) => {
  const route = selectors.router.route(state) || {}
  const item = selectors.nocode.item(state, 'content', route.item)
  const content = selectors.nocode.external(state, route.item)
  
  return {
    item,
    content,
  }
})
class DocumentPage extends React.Component {
  render() {
    const {
      classes,
      item,
      content,
    } = this.props
    return (
      <div className="document-container">
        <Paper className={ classes.paper }>
          <Typography variant="h5" className={ classes.pageHeader }>{ item.name }</Typography>
          <div dangerouslySetInnerHTML={{__html: content}}>
          </div>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(DocumentPage)
