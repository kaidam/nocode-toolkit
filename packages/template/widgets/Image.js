import React from 'react'
import Link from '../components/widgets/Link'
import UnsplashCopyright from '../components/widgets/UnsplashCopyright'
import icons from '../icons'

const SIZES = {
  small: '50%',
  medium: '65%',
  large: '80%',
  default: '100%',
}

const Render = ({
  data = {},
  link,
  copyrightBelow = false,
}) => {
  if(!data) return null
  if(!data.image) return null

  const {
    size,
    image: {
      url,
      unsplash,
    }
  } = data

  const useSize = SIZES[size] || SIZES.default
  
  const copyrightContent = (
    <UnsplashCopyright
      unsplash={ unsplash }
      withWrapper={ copyrightBelow ? false : true }
    />
  )

  const copyrightInImageContent = copyrightBelow ? null : copyrightContent
  const copyrightBelowContent = copyrightBelow ? copyrightContent : null

  const img = (
    <img
      width="100%"
      src={ url }
    />
  )

  const imageContent = link ? (
    <Link
      path={ link.path }
      name={ link.name }
    >
      { img }
    </Link>
  ) : img

  return (
    <div
      style={{
        display: 'inline-block',
        width: useSize,
      }}
    >
      <div
        style={{
          position: 'relative',
        }}
      >
        { imageContent }
        { copyrightInImageContent }
      </div>
      { copyrightBelowContent }
    </div>
  )
}

const form = [{
  id: 'image',
  title: 'Image',
  schema: [{
    id: 'image',
    title: 'Image',
    helperText: 'Upload an image',
    component: 'image',
    default: null,
  },{
    id: 'size',
    title: 'Size',
    helperText: 'How large should the image be displayed',
    component: 'select',
    default: 'default',
    options: [{
      title: 'Fit',
      value: 'default',
    },{
      title: 'Large',
      value: 'large',
    },{
      title: 'Medium',
      value: 'medium',
    },{
      title: 'Small',
      value: 'small',
    }]
  }],
}]

export default {
  id: 'image',
  title: 'Image',
  description: 'Display an image you upload, from Google drive or from Unplash',
  Render,
  locations: ['document'],
  group: 'Content',
  form,
  icon: icons.image,
}