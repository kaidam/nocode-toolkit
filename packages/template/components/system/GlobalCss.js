import { withStyles } from '@material-ui/core/styles'

const GlobalCss = withStyles({
  // @global is handled by jss-plugin-global.
  '@global': {
    // You should target [class*="MuiButton-root"] instead if you nest themes.
    '.MuiBackdrop-root': {
        backdropFilter: 'blur(10px)',
    },
  },
})(() => null);

export default GlobalCss
