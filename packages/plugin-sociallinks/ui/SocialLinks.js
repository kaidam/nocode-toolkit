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

const SocialLinks = ({
  content,
}) => {
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
    .filter(name => content[name] ? true : false)
    .map((name, i) => {
      const value = content[name]
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

export default SocialLinks