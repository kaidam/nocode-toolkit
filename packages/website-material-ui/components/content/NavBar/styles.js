import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => {
  return {
    root: {
      padding: theme.spacing(1.5),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '100%',
    },
    content: {
      flexGrow: 0,
    },
    editor: {
      flexGrow: 0,
    },
    editorListIcon: {
      minWidth: '10px',
      marginRight: '10px',
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
    navWrapper: {
      float: 'left',
    },
    navItem: {
      ...theme.typography.button,
      display: 'block',
      fontWeight: '500',
      color: theme.palette.primary.contrastText,
      textAlign: 'center',
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      marginRight: theme.spacing(1),
      textDecoration: 'none',
      cursor: 'pointer',
    },
    navActive: {
      color: [theme.palette.primary.main, '!important'],
      backgroundColor: [theme.palette.primary.contrastText, '!important'],
      borderRadius: [theme.spacing(1), '!important'],
    },
    navNormal: {

    },
    navItemLarge: {
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.contrastText,
        borderRadius: theme.spacing(1),
        '& .navbar-ui-icon': {
          color: theme.palette.primary.main,
        },
      },
      '& .navbar-ui-icon': {
        color: theme.palette.primary.main,
      },
    },
    inactiveEditorContainer: {
      '& .navbar-ui-icon': {
        color: theme.palette.primary.contrastText,
      },
    },
    smallNavButton: {
      color: theme.palette.primary.contrastText,
    },
    smallNavA: {
      color: theme.palette.text.primary,
      textDecoration: 'none',
      cursor: 'pointer',
    },
    menuIcon: {
      minWidth: '40px',
    },
  }
})

export default useStyles