const styles = theme => {
  return {
    root: {
      padding: theme.spacing(1.5),
    },
    title: {
      flex: '0 0 auto',
    },
    largeNav: {
      display: 'none',
      [theme.breakpoints.up(theme.layout.largeScreenBreakpoint)]: {
        display: 'block',
      },
      [theme.breakpoints.down(theme.layout.smallScreenBreakpoint)]: {
        display: 'none',
      },
    },
    smallNav: {
      display: 'none',
      [theme.breakpoints.up(theme.layout.largeScreenBreakpoint)]: {
        display: 'none',
      },
      [theme.breakpoints.down(theme.layout.smallScreenBreakpoint)]: {
        display: 'block',
      },
    },
    navUl: {
      listStyleType: 'none',
      margin: '0',
      padding: '0',
      overflow: 'hidden',
      fontSize: '1em',
    },
    navLi: {
      float: 'left',
    },
    navLiA: {
      ...theme.typography.button,
      display: 'block',
      fontWeight: '500',
      color: theme.palette.primary.contrastText,
      textAlign: 'center',
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      textDecoration: 'none',
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.contrastText,
        borderRadius: theme.spacing(1),
      },
    },
    smallNavA: {
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
    navActive: {
      color: [theme.palette.primary.main, '!important'],
      backgroundColor: [theme.palette.primary.contrastText, '!important'],
      borderRadius: [theme.spacing(1), '!important'],
    },
  }
}

export default styles
