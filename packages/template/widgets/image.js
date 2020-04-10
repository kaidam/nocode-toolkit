import React from 'react'

const SIZES = {
  small: '50%',
  medium: '65%',
  large: '80%',
  default: '100%',
}

const Render = ({
  data = {},
  cell,
}) => {
  if(!data) return null

  const {
    size,
    image: {
      url,
      driver,
      unsplash = {},
    }
  } = data

  const useSize = SIZES[size] || SIZES.default
  
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
        display: 'inline-block',
        width: useSize,
      }}
    >
      <div
        style={{
          position: 'relative',
        }}
      >
        <img
          width="100%"
          src={ url }
        />
        { copyright }
      </div>
    </div>
  )
}

const form = {
  id: 'image',
  title: 'Image',
  initialValues: {
    image: null,
    size: 'default',
  },
  schema: [{
    id: 'image',
    title: 'Image',
    helperText: 'Upload an image',
    component: 'image',
  },{
    id: 'size',
    title: 'Size',
    helperText: 'How large should the image be displayed',
    component: 'select',
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
}

const widget = () => ({
  id: 'image',
  Render,
  form,
})

export default widget