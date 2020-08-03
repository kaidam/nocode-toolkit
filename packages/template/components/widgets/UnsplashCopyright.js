import React from 'react'

const UnsplashCopyright = ({
  unsplash,
  withWrapper,
}) => {
  
  let copyrightContent = null

  if(!unsplash) return null
  
  const {
    user: {
      fullname,
      username,
    }
  } = unsplash

  copyrightContent = (
    <div>
      image by <a
        style={{
          color: '#000000',
        }}
        target="_blank"
        href={`http://unsplash.com/@${username}?utm_source=nocode&utm_medium=referral`}
      >{ fullname }</a> on <a
        style={{
          color: '#000000',
        }}
        target="_blank"
        href="https://unsplash.com/?utm_source=nocode&utm_medium=referral"
      >Unsplash</a>
    </div>
  )

  return withWrapper ? (
    <div
      style={{
        position: 'absolute',
        bottom: '15px',
        right: '10px',
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: '7px',
        fontSize: '0.8em',
      }}
    >
      { copyrightContent }
    </div>
  ) : copyrightContent
}

export default UnsplashCopyright