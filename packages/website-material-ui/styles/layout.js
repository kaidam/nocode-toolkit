import { createStyles } from '@material-ui/core/styles'

const styles = theme => {
  return createStyles({
    '@global': {
      'body, html, #_nocode_root': {
        backgroundColor: theme.palette.common.white,
        width: '100%',
        height: '100%',
        margin: '0px',
        border: 0,
      },
    },
    root: {
      height: '100%',
    },
    appBar: {
      position: 'relative',
      zIndex: theme.zIndex.drawer + 1,
      height: [`${theme.layout.topbarHeight}px`, '!important'],
      backgroundColor: '#fff',
      backgroundColor: theme.palette.primary.main,
      boxShadow: 'none',
      borderBottom: 'solid 1px rgba(0, 0, 0, 0.12)',
    },
    headerToolbar: {
      height: [`${theme.layout.topbarHeight}px`, '!important'],
    },
    footerToolbar: {
      height: [`${theme.layout.footerHeight}px`, '!important'],
    },
    largeNav: {
      display: 'none',
      [theme.breakpoints.up(theme.layout.largeScreenBreakpoint)]: {
        display: 'block',
      },
      [theme.breakpoints.down(theme.layout.smallScreenBreakpoint)]: {
        display: 'none',
      },
      "& *": {
        textDecoration: 'none'
      }
    },
    smallNav: {
      display: 'none',
      [theme.breakpoints.up(theme.layout.largeScreenBreakpoint)]: {
        display: 'none',
      },
      [theme.breakpoints.down(theme.layout.smallScreenBreakpoint)]: {
        display: 'block',
      },
      "& *": {
        textDecoration: 'none'
      }
    },
    smallNavButton: {
      color: theme.palette.getContrastText(theme.palette.primary.main),
    },

    drawer: {
      height: '100%',
      borderRight: '1px solid rgba(0, 0, 0, 0.12)',
      backgroundColor: theme.palette.background.paper,
    },

    smallDrawer: {
      width: `${theme.layout.drawerWidthSmall}px`,
      minWidth: `${theme.layout.drawerWidthSmall}px`,
    },

    largeDrawer: {
      width: `${theme.layout.drawerWidthLarge}px`,
      minWidth: `${theme.layout.drawerWidthLarge}px`,
    },

    content: {
      flexGrow: 1,
      height: '100%',
      overflowY: 'auto',
      //backgroundColor: theme.palette.background.default,
      background: 'rgba(0, 0, 0, 0.001)',
    },
    contentChildren: {
      maxWidth: '960px',
      margin: '0 auto',
      minHeight: `calc(100% - ${theme.layout.footerHeight}px - 1px)`,
      padding: theme.spacing(3),
    },
    footer: {
      width: '100%',
      color: theme.palette.common.white,
      height: [`${theme.layout.footerHeight}px`, '!important'],
      backgroundColor: theme.palette.primary.main,
    },


    appBarTitle: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexGrow: 1,
    },
    main: {
      height: `calc(100% - ${theme.layout.topbarHeight + theme.layout.uiTopbarHeight}px)`,
      width: '100%',
      bottom: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'row',
    },

    footerContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },

    footerCopyright: {
      flexGrow: 0,
    },

    footerNavBar: {
      flexGrow: 1,
    },
  })
}

export default styles
