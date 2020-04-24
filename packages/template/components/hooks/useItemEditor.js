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
      getInjectedItems: () => ([{
        title: 'Open',
        icon: icons.open,
        handler: onOpen,
      }])
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