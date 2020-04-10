import React, { useEffect } from 'react'

const styles = {
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
  facebook: {
    color: '#4166B2',
  },
  twitter: {
    color: '#1995E0',
  },
  linkedin: {
    color: '#0277B5',
  },
  youtube: {
    color: '#FF0202',
  },
}

const LINKS = [
  'facebook',
  'twitter',
  'linkedin',
  'youtube',
]

let hasInjectedCSS = false

const Render = ({
  data,
  cell,
}) => {
  data = data || {}
  useEffect(() => {
    if(hasInjectedCSS) return
    hasInjectedCSS = true
    const link = document.createElement("link")
    link.setAttribute("rel", "stylesheet")
    link.setAttribute("href", "https://use.fontawesome.com/releases/v5.2.0/css/all.css")
    link.setAttribute("crossOrigin", "anonymous")
    document.body.appendChild(link)
  }, [hasInjectedCSS])
  
  const links = LINKS
    .filter(name => data[name] ? true : false)
    .map((name, i) => {
      const value = data[name]
      return (
        <div style={ styles.item } key={ i }>
          <a href={ value }>
            <span style={ styles[name] }>
              <i className={`fab fa-${name} fa-2x`}></i>
            </span>
          </a>
        </div>
      )
    })
  return (
    <div style={ styles.container }>
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
}

const widget = () => ({
  id: 'social_links',
  Render,
  form,
})

export default widget