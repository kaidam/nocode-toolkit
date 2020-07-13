import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import icons from '../icons'
import settingsSelectors from '../store/selectors/settings'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
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
  {icon: 'facebook', key: 'facebookUrl'},
  {icon: 'twitter', key: 'twitterUrl'},
  {icon: 'linkedin', key: 'linkedinUrl'},
  {icon: 'youtube', key: 'youtubeUrl'},
  {icon: 'pinterest', key: 'pinterestUrl'},
  {icon: 'instagram', key: 'instagramUrl'},
]

const IconMap = {
  facebook: icons.facebook,
  twitter: icons.twitter,
  linkedin: icons.linkedin,
  youtube: icons.youtube,
  pinterest: icons.pinterest,
  instagram: icons.instagram,
}

const Render = ({
}) => {
  
  const classes = useStyles()
  
  const settings = useSelector(settingsSelectors.settings)

  const links = LINKS
    .filter(item => settings[item.key] ? true : false)
    .map((item, i) => {
      const value = settings[item.key]
      console.log(item)
      const url = value.match(/^https?:\/\//i) ?
        value :
        `http://${value}`
      // Icon is now a React class
      const Icon = IconMap[item.icon]
      const socialClasses = classnames(classes.smIcon, classes[item.icon])
      return (
        <div className={ classes.icon } key={ i }>
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

export default {
  id: 'social_links',
  title: 'Social Links',
  description: 'Render links to your social media accounts',
  Render,
  form,
}