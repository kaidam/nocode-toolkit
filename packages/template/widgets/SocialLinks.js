import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import useSocialLinks from '../components/hooks/useSocialLinks'
import icons from '../icons'

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

const IconMap = {
  facebook: icons.facebook,
  twitter: icons.twitter,
  linkedin: icons.linkedin,
  youtube: icons.youtube,
  pinterest: icons.pinterest,
  instagram: icons.instagram,
}

const Render = ({
  getEmptyContent,
}) => {
  
  const classes = useStyles()
  
  const socialLinks = useSocialLinks()
  
  let links = socialLinks
    .map((item, i) => {
      const Icon = IconMap[item.icon]
      const socialClasses = classnames(classes.smIcon, classes[item.icon])
      return (
        <div className={ classes.icon } key={ i }>
          <a href={ item.url } target="_blank">
            <Icon className={ socialClasses } />
          </a>
        </div>
      )
    })

  if(links.length <= 0 && getEmptyContent) {
    links = getEmptyContent()
  }

  return (
    <div className={ classes.container }>
      {
        links
      }
    </div>
  )
}

export default {
  id: 'social_links',
  title: 'Social Links',
  description: 'Render links to your social media accounts',
  Render,
  settingsGroup: 'social_links',
  locations: ['document', 'section'],
  group: 'Content',
  icon: icons.people,
}