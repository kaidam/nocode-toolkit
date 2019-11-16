const items = {
  home: {
    type: 'document',
    name: 'Home',
    content: 'This is the homepage'
  },
  folder1: {
    type: 'folder',
    name: 'Folder 1',
    children: ['subfolder1', 'document1', 'document2']
  },
  document1: {
    type: 'document',
    name: 'Document 1',
    content: 'This is document 1',
  },
  document2: {
    type: 'document',
    name: 'Document 2',
    content: 'This is document 2',
  },
  folder2: {
    type: 'folder',
    name: 'Folder 2',
    children: ['document3', 'document4']
  },
  document3: {
    type: 'document',
    name: 'Document 3',
    content: 'This is document 3',
  },
  document4: {
    type: 'document',
    name: 'Document 4',
    content: 'This is document 4',
  },
  subfolder1: {
    type: 'folder',
    name: 'Sub Folder 1',
    children: ['document5', 'document6']
  },
  document5: {
    type: 'document',
    name: 'Document 5',
    content: 'This is document 5',
  },
  document6: {
    type: 'document',
    name: 'Document 6',
    content: 'This is document 6',
  },
}

const plugins = (config = {}) => {

  const {
    mode,
  } = config

  return [
    (context, next) => {
      Object.keys(items).forEach(id => {
        const item = Object.assign({}, items[id], {id})
        if(item.type == 'document') {
          context.external(id, item.content)
          delete(item.content)
          context.route(`/${id == 'home' ? '' : id}`, {
            item: item.id,
            externals: [id]
          })
        }
        context.item('content', id, item)
      })
      context.item('root', 'sidebar', ['folder1', 'folder2'])

      if(mode == 'development') {
        context.config('reloadExternals', true)
        context.config('showUI', true)
      }

      next()
    },
  ]
}

module.exports = {
  plugins,
}