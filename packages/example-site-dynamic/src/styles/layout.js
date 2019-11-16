const styles = theme => {
  return {
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
    layout: {
      width: 'auto',
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      [theme.breakpoints.up(900 + theme.spacing(3) * 2)]: {
        width: 900,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    toolbar: {
      height: [`${theme.layout.topbarHeight}px`, '!important'],
    },
    appBarTitle: {
      flexGrow: 1,
    },
    main: {
      height: `calc(100% - ${theme.layout.topbarHeight}px)`,
      width: '100%',
      bottom: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'row',
    },
    drawer: {
      height: '100%',
      width: `${theme.layout.drawerWidth}px`,
      minWidth: `${theme.layout.drawerWidth}px`,
      borderRight: '1px solid rgba(0, 0, 0, 0.12)',
      overflowY: 'auto',
      overflowX: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    logo: {
      height: `${theme.layout.logoHeight}px`,
      padding: '3px',
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
    sidebarContent: {
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingBottom: theme.spacing(3),
    },
    sidebarContentSub: {
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingBottom: theme.spacing(1),
    },
    rightBar: {
      height: '100%',
      width: `${theme.layout.drawerWidth}px`,
      minWidth: '240px',
      borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
      overflowY: 'auto',
      backgroundColor: theme.palette.background.paper,
    },
    footer: {
      width: '100%',
      color: theme.palette.common.white,
      padding: theme.spacing(3),
      height: [`${theme.layout.footerHeight}px`, '!important'],
      backgroundColor: theme.palette.primary.main,
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
    blogTitle: {
      fontSize: '1.1rem',
      fontWeight: 'bold'
    }
  }
}

export default styles
