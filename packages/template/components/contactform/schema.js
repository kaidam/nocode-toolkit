export const processSettings = (data) => {
  const settings = typeof(data.displayMode) === 'string' && data.displayMode != "" ? data : {
    buttonTitle: data.buttonTitle || 'Contact Us',
    nameField: 'yesrequired',
    emailField: 'yesrequired',
    commentsField: 'yesrequired',
    displayMode: 'window',
  }

  return settings
}

export const getAllFields = (settings) => {

  const nameRequired = settings.nameField == 'yesrequired'
  const emailRequired = settings.emailField == 'yesrequired'
  const phoneRequired = settings.phoneField == 'yesrequired'
  const messageRequired = settings.messageField == 'yesrequired'

  return [
    {
      id: 'name',
      title: 'Full Name' + (nameRequired ? ' (*)' : ''),
      description: 'Enter your full name',
      validate: value => {
        if(settings.nameField != 'yesrequired') return null
        return value ? null : `your name is a required field`
      },
    }, {
      id: 'email',
      title: 'Email Address' + (emailRequired ? ' (*)' : ''),
      description: 'Please enter your email address',
      validate: value => {
        if(settings.emailField != 'yesrequired') return null
        return value ? null : `your email is a required field`
      },
    }, {
      id: 'phone',
      title: 'Phone Number' + (phoneRequired ? ' (*)' : ''),
      description: 'Please enter your phone number',
      validate: value => {
        if(settings.phoneField != 'yesrequired') return null
        return value ? null : `your phone is a required field`
      },
    }, {
      id: 'message',
      title: 'Your Message' + (messageRequired ? ' (*)' : ''),
      component: 'textarea',
      description: 'Please enter a message',
      validate: value => {
        if(settings.messageField != 'yesrequired') return null
        return value ? null : `your message is a required field`
      },
    }
  ]
}

export const getFields = (settings) => {
  return getAllFields(settings).filter(field => {
    return settings[`${field.id}Field`] === 'yes' || settings[`${field.id}Field`] === 'yesrequired'
  })
}
