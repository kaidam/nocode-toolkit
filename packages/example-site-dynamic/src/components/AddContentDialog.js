import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

import uiActions from '../store/moduleUI'

const styles = theme => {
  return {
    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    }
  }
}

@connect((state, ownProps) => {
  const test = state.ui.test
  return {
    test,
  }
}, {
  loadTest: uiActions.loadTest,
})
class AddContentDialog extends React.Component {

  render() {
    const {
      classes,
      test,
      loadTest,
    } = this.props
    return (
      <div>
        <Divider className={ classes.divider } />
        <Button
          variant="contained"
          color="primary"
          onClick={ () => loadTest(5) }
        >
          Add content { test }
        </Button>
      </div>
    )
  }
}

AddContentDialog.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(AddContentDialog)