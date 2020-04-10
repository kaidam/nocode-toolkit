import React, { useEffect } from 'react'
import {
  ThemeProvider,
} from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import useTheme from './useTheme'

/*

  the base material theme library - included directly by templates
  that use material in their layout.  Included via ui.js
  for templates that only use material for nocode UI components.

*/
const MaterialTheme = ({
  processor,
  children,
}) => {

  // pick values from the store that we feed to a theme processor
  const theme = useTheme(processor)

  // remove the server side rendered CSS
  useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])

  return (
    <ThemeProvider 
      theme={ theme }
    >
      <CssBaseline />
      { children }
    </ThemeProvider>
  )
}

export default MaterialTheme