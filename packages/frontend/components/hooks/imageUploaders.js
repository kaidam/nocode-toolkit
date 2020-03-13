import { useMemo } from 'react'
import icons from '../../icons'

const imageUploaders = ({
  
}) => {

  const types = useMemo(() => {
    const ret = [{
      title: 'Upload',
      help: 'Upload an image from your computer',
      icon: icons.upload,
      //handler: onOpenUploader,
      handler: () => {},
    }, {
      title: 'Google Drive',
      help: 'Choose an image on your google drive',
      icon: icons.drive,
      //handler: onOpenUploader,
      handler: () => {},
    }, {
      title: 'Unsplash',
      help: 'Choose an image from Unsplash',
      icon: icons.unsplash,
      //handler: onOpenUploader,
      handler: () => {},
    }]

    return ret
  })

  return types
}

export default imageUploaders