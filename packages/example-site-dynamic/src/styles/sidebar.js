const styles = theme => {
  const highlightColor = theme.palette.primary.main
  return {
    link: {
      color: theme.palette.text.primary,
      textTransform: 'uppercase',
      '& *': {
      	fontSize: ['0.95em', '!important']
      },
    },
    sublist: {
      paddingLeft: theme.spacing(1.5),
      '& > ul': {
        paddingTop: ['0px', '!important'],
        paddingBottom: ['0px', '!important'],
      }
    },
    normalListItem: {
      color: theme.palette.grey[600],
      //marginTop: theme.spacing(0.2),
      //marginBottom: theme.spacing(0.2),
    },
    highlightListItem: {
      //color: theme.palette.getContrastText(highlightColor),
      color: highlightColor,
      fontWeight: 'bold',
    },
    highlightListItemBackground: {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(0.2),
      marginBottom: theme.spacing(0.2),
      backgroundColor: ['#fff', '!important'],
      border: [`1px dashed ${highlightColor}`, '!important'],
      borderTopLeftRadius: '35px',
      borderBottomLeftRadius: '35px',
    },
    normalListItemBackground: {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(0.2),
      marginBottom: theme.spacing(0.2),
      border: [`1px solid #fff`, '!important'],
      borderTopLeftRadius: '35px',
      borderBottomLeftRadius: '35px',
    }
  }
}

export default styles
