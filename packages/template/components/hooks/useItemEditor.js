import { useCallback } from 'react'
import useItemOptions from './useItemOptions'
import icons from '../../icons'

const useItemEditor = ({
  node,
  open,
  folderPages,
  onOpen,
}) => {

  const {
    getItemOptions,
  } = useItemOptions()

  const getEditorItems = useCallback(() => {
    let title = 'Open Page'
    let icon = icons.forward
    if(node.type == 'folder') {
      // if we don't have folder pages
      // it means we are toggling the state of the menu
      if(!folderPages) {
        icon = open ?
          icons.expandLess :
          icons.expandMore
        title = open ?
          'Close Folder' :
          'Open Folder'
      }
      else {
        title = 'Open Folder'
      }
    }
    return getItemOptions({
      node,
      getInjectedItems: () => {
        return onOpen ?
          [{
            title,
            icon,
            handler: onOpen,
          }, '-'] :
          []
      }
    })
  }, [
    getItemOptions,
    node,
    open,
    folderPages,
    onOpen,
  ])

  return {
    getEditorItems,
  }
}

export default useItemEditor