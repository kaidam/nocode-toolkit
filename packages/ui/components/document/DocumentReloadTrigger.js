import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import selectors from '../../store/selectors'
import Actions from '../../utils/actions'
import documentActions from '../../store/modules/document'

const DocumentReloadTrigger = ({
  
}) => {

  const actions = Actions(useDispatch(), {
    saveExternalContent: documentActions.saveExternalContent,
  })

  const data = useSelector(selectors.document.data)

  useEffect(() => {
    function handleWindowFocus() {
      if(!data.item || !data.item.driver || !data.item.id) return
      actions.saveExternalContent({
        driver: data.item.driver,
        id: data.item.id,
      })
    }

    window.addEventListener('focus', handleWindowFocus)

    return function cleanup() {
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [
    data,
  ])

  return null
}

export default DocumentReloadTrigger
