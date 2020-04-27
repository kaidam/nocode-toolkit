import { useCallback } from 'react'
import useItemOptions from './useItemOptions'
import icons from '../../icons'
import library from '../../library'

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

    const isFolder = library.handlers.isFolder ?
      library.handlers.isFolder(node) :
      node.type == 'folder'


    if(isFolder) {
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