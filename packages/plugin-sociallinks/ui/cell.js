import React from 'react'
import SocialLinks from './SocialLinks'

const sociallinks = {
  driver: 'local',
  plugin: 'sociallinks',
  type: 'sociallinks',
  title: 'Social Links',
  icon: 'people',
  metadata: {},
  parentFilter: ['cell'],
  initialValues: {
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: '',
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
  }],
  cellConfig: {
    padding: 1,
    component: SocialLinks,
  },
}

const schema = {
  sociallinks,
}

export default schema