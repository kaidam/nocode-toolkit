import { useCallback } from 'react'
import useItemOptions from './useItemOptions'
import icons from '../../icons'

const useItemEditor = ({
  node,
  onOpen,
}) => {

  const {
    getItemOptions,
  } = useItemOptions()

  const getEditorItems = useCallback(() => {
    return getItemOptions({
      node,
      getInjectedItems: () => {
        return onOpen ?
          [{
            title: 'Open Page',
            icon: icons.forward,
            handler: onOpen,
          }, '-'] :
          []
      }
    })
  }, [
    getItemOptions,
    node,
    onOpen,
  ])

  return {
    getEditorItems,
  }
}

export default useItemEditor