import React from 'react'
import DriveUI from './drive/UI'
import UnsplashUI from './unsplash/UI'

const FinderUI = (props) => {

  if(props.driver == 'drive') {
    return (
      <DriveUI
        {...props}
      />
    )
  }
  else if(props.driver == 'unsplash') {
    return (
      <UnsplashUI
        {...props}
      />
    )
  }
  else {
    return null
  }
}

export default FinderUI