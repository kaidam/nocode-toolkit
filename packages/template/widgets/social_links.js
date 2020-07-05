import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import icons from '../icons'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    display: 'inline-block',
    flex: 1,
    textAlign: 'center',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  smIcon: {
    minWidth: '30px',
    minHeight: '30px',
  },
  facebook: {
    fill: '#4166B2',
  },
  twitter: {
    fill: '#1995E0',
  },
  linkedin: {
    fill: '#0277B5',
  },
  youtube: {
    fill: '#FF0202',
  },
  pinterest: {
    fill: '#e60023',
  },
  instagram: {
    fill: '#000000',
  },
}))

const LINKS = [
  'facebook',
  'twitter',
  'linkedin',
  'youtube',
  'pinterest',
  'instagram',
]

const IconMap = {
  facebook: icons.facebook,
  twitter: icons.twitter,
  linkedin: icons.linkedin,
  youtube: icons.youtube,
  pinterest: icons.pinterest,
  instagram: icons.instagram,
}

let hasInjectedCSS = false

const Render = ({
  data,
  cell,
}) => {
  data = data || {}
  
  const classes = useStyles()

  const links = LINKS
    .filter(name => data[name] ? true : false)
    .map((name, i) => {
      const value = data[name]

      const url = value.match(/^https?:\/\//i) ?
        value :
        `http://${value}`
      // Icon is now a React class
      const Icon = IconMap[name]
      const socialClasses = classnames(classes.smIcon, classes[name])
      return (
        <div className={ classes.item } key={ i }>
          <a href={ url }>
            <Icon className={ socialClasses } />
          </a>
        </div>
      )
    })
  return (
    <div className={ classes.container }>
      {
        links
      }
    </div>
  )
}

const form = {
  id: 'social_links',
  title: 'Social Links',
  initialValues: {
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    pinterest: '',
    instagram: '',
  },
  schema: [{
    id: 'facebook',
    title: 'Facebook URL',
    helperText: 'The url of your Facebook profile',
  },{
    id: 'twitter',
    title: 'Twitter URL',
    helperText: 'The url of your Twitter profile',
  },{
    id: 'linkedin',
    title: 'LinkedIn URL',
    helperText: 'The url of your LinkedIn profile',
  },{
    id: 'youtube',
    title: 'Youtube URL',
    helperText: 'The url of your Youtube profile',
  },{
    id: 'pinterest',
    title: 'Pinterest URL',
    helperText: 'The url of your Pinterest profile',
  },{
    id: 'instagram',
    title: 'Instagram URL',
    helperText: 'The url of your Instagram profile',
  }],
}

const widget = () => ({
  id: 'social_links',
  title: 'Social Links',
  Render,
  form,
})

export default widget