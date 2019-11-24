import React from 'react'

const DocumentImage = ({
  content,
  showUI,
}) => {
  if(!content) return null
  
  const {
    url,
    driver,
    unsplash = {},
  } = content.image

  let copyrightContent = null

  if(driver == 'unsplash') {
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
  }

  const copyright = copyrightContent ? (
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
  ) : null

  return (
    <div
      style={{
        position: 'relative',
        width: showUI ? 'calc(100% - 42px)' : '100%',
        maxWidth: showUI ? 'calc(100% - 42px)' : '100%',
      }}
    >
      <img
        width="100%"
        src={ url }
      />
      { copyright }
    </div>
    
  )
}

export default DocumentImage