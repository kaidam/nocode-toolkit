import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import SettingsWidget from '@nocode-toolkit/ui/components/widgets/SettingsWidget'

const useStyles = makeStyles(theme => createStyles({  
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: theme.spacing(2),
  },
  copyrightText: {
    color: theme.palette.primary.contrastText,
  },
}))

const RenderRoot = ({
  content,
  editor,
}) => {
  const classes = useStyles()
  return (
    <div className={ classes.container }>
      {
        editor && (
          <div className={ classes.editButton }>
            { editor }
          </div>
        )
      }
      { content }
    </div>
  )
}

const RenderContent = ({
  settings,
}) => {
  const classes = useStyles()
  const copyright_message = settings.data.copyright_message || '&copy; &year; My Company Name'
  const copyrightMessage = (copyright_message || '').replace(/\&year;?/, () => new Date().getFullYear())
  return (
    <Typography
      variant="body1"
      className={ classes.copyrightText }
    >
      <span dangerouslySetInnerHTML={{__html: copyrightMessage}}>
      </span>
    </Typography>
  )
}

const renderers = {
  root: RenderRoot,
  content: RenderContent,
}

const Copyright = ({

}) => {
  return (
    <SettingsWidget
      renderers={ renderers }
    />
  )
}

export default Copyright