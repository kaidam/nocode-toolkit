import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import settingsSelectors from '../../store/selectors/settings'

import icons from '../../icons'

const useWidgets = ({
  
} = {}) => {
  
  const forms = useSelector(settingsSelectors.forms)
  const activePluginMap = useSelector(settingsSelectors.activePluginMap)
  const snippets = useSelector(settingsSelectors.pageSnippets)

  const widgets = useMemo(() => {
    const plugins = [
      forms.stripe_payment_button && activePluginMap.stripe_payment_button ? {
        title: 'Payment Button',
        icon: icons.image,
        form: 'stripe_payment_button',
      } : null,
      forms.contactform  && activePluginMap.contactform ? {
        title: 'Contact Form',
        icon: icons.contact,
        form: 'contactform',
      } : null
    ].filter(i => i)

    const snippetItems = snippets
      .map(snippet => {
        return {
          title: snippet.name,
          icon: icons.code,
          form: 'snippet',
          data: {
            id: snippet.id
          },
        }
      })

    const media = [
      {
        title: 'Image',
        icon: icons.image,
        form: 'image',
      },
      {
        title: 'Youtube Video',
        icon: icons.video,
        form: 'video',
      },
      {
        title: 'Social Links',
        icon: icons.people,
        form: 'video',
      },
    ]

    const text = [
      {
        title: 'Heading',
        icon: icons.title,
        form: 'heading',
      },
      {
        title: 'Text Block',
        icon: icons.text,
        form: 'richtext',
      },
      {
        title: 'Search',
        icon: icons.search,
        form: 'search',
      },
      {
        title: 'HTML',
        icon: icons.code,
        form: 'html',
      },
    ]

    return [
      {
        title: 'Media',
        icon: icons.image,
        items: media,
      },
      {
        title: 'Text',
        icon: icons.text,
        items: text,
      },
      plugins.length > 0 ? {
        title: 'Plugins',
        icon: icons.plugin,
        items: plugins,
      } : null,
      snippetItems.length > 0 ? {
        title: 'Snippets',
        icon: icons.code,
        items: snippetItems,
      } : null,
    ].filter(i => i)
  }, [
    forms,
    activePluginMap,
    snippets,
  ])

  return widgets
}

export default useWidgets