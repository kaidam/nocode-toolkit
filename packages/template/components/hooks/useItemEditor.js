import { useCallback } from 'react'
import useItemOptions from './useItemOptions'
import icons from '../../icons'
import library from '../../library'

const useItemEditor = ({
  node,
  // is the folder currently open
  isOpen,
  // are folder pages active?
  folderPages,
  // this is for the "open page / open folder handler"
  onOpenItem,
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
        icon = isOpen ?
          icons.expandLess :
          icons.expandMore
        title = isOpen ?
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
        return onOpenItem ?
          [{
            title,
            icon,
            handler: onOpenItem,
          }, '-'] :
          []
      }
    })
  }, [
    getItemOptions,
    node,
    isOpen,
    folderPages,
    onOpenItem,
  ])

  return {
    getEditorItems,
  }
}

export default useItemEditor