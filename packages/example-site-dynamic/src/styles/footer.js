const styles = theme => {
  return {
    root: {
      color: theme.palette.primary.contrastText,
    },
    footerLink: {
      color: theme.palette.primary.contrastText,
      textDecoration: 'none',
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.contrastText,
        borderRadius: theme.spacing(1),
      },
    },
  }
}

export default styles
