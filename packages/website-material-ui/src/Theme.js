import React from 'react'
import {
  ThemeProvider,
} from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

class Theme extends React.Component {

  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {

    const {
      theme,
      children,
    } = this.props

    return (
      <ThemeProvider 
        theme={ theme }
      >
        <CssBaseline />
        { children }
      </ThemeProvider>
    )
  }
}

export default Theme
