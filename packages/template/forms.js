const valueInjector = (inject = {}) => (values = {}) => Object.assign({}, values, inject)

const forms = {
  'section': {
    tabs: [{
      id: 'sorting',
      title: 'Sorting',
      schema: [{
        id: 'annotation.sorting',
        title: 'Sorting',
        helperText: 'How are children items sorted inside this folder?',
        component: 'sorting',
        default: {},
      }],
    }, {
      id: 'hidden',
      title: 'Hidden Items',
      schema: [{
        title: 'Hidden Items',
        helperText: 'Manage the hidden items in this section',
        component: 'hiddenItems',
        default: null,
      }],
    },{
      id: 'sourceFolders',
      title: 'Drive Folders',
      schema: [{
        title: 'Drive Folders',
        helperText: 'Manage the drive folders loaded into this section',
        component: 'driveFolders',
        default: null,
      }],
    }],
  },
  // this will be merged into other cell forms
  'cell.settings': {
    tabs: [{
      id: 'settings',
      title: 'Settings',
      schema: [
        [{
          id: 'settings.horizontal_align',
          title: 'Horizontal Align',
          helperText: 'The horizontal alignment of content in this cell',
          component: 'select',
          default: 'left',
          options: [{
            title: 'Left',
            value: 'left',
          },{
            title: 'Center',
            value: 'center',
          },{
            title: 'Right',
            value: 'right',
          }]
        },{
          id: 'settings.vertical_align',
          title: 'Vertical Align',
          helperText: 'The vertical alignment of content in this cell',
          component: 'select',
          default: 'center',
          options: [{
            title: 'Top',
            value: 'top',
          },{
            title: 'Center',
            value: 'center',
          },{
            title: 'Bottom',
            value: 'bottom',
          }]
        }],
        [{
          id: 'settings.padding',
          title: 'Padding',
          helperText: 'The padding in pixels for this cell',
          default: 8,
          inputProps: {
            type: 'number',
          },
        }],
      ]
    }],
  },
  'drive.folder': {
    processFormValues: valueInjector({mimeType: 'folder'}),
    tabFilter: (tab, values) => {
      const exists = values && values.id
      if(tab.id == 'actions' || tab.id == 'sorting') return exists
      return true
    },
    tabs: [{
      id: 'settings',
      title: 'Settings',
      noTitle: true,
      schema: [{
        id: 'name',
        title: 'Name',
        helperText: 'Enter the name of the folder',
        default: '',
        validate: {
          type: 'string',
          methods: [
            ['required', 'The name is required'],
          ],
        }
      }],
    },{
      id: 'sorting',
      title: 'Sorting',
      schema: [{
        id: 'annotation.sorting',
        title: 'Sorting',
        helperText: 'How are children items sorted inside this folder?',
        component: 'sorting',
        default: {},
      }],
    },{
      id: 'actions',
      title: 'Actions',
      schema: [{
        id: 'annotation.makeHomepage',
        title: 'Make Homepage',
        helperText: 'Make this item the homepage of the website',
        component: 'makeHomepage',
      }],
    }]
  },
  'drive.document': {
    processFormValues: valueInjector({mimeType: 'document'}),
    tabFilter: (tab, values) => {
      const exists = values && values.id
      if(tab.id == 'actions') return exists
      return true
    },
    tabs: [{
      id: 'settings',
      title: 'Settings',
      noTitle: true,
      schema: [{
        id: 'name',
        title: 'Name',
        helperText: 'Enter the name of the document',
        default: '',
        validate: {
          type: 'string',
          methods: [
            ['required', 'The name is required'],
          ],
        }
      }],
    },{
      id: 'actions',
      title: 'Actions',
      schema: [{
        id: 'annotation.makeHomepage',
        title: 'Make Homepage',
        helperText: 'Make this item the homepage of the website',
        component: 'makeHomepage',
      }],
    }]
  },
  'link': {
    tabs: [{
      id: 'details',
      title: 'Link Details',
      schema: [{
        id: 'name',
        title: 'Name',
        helperText: 'Enter the name of the link',
        default: '',
        validate: {
          type: 'string',
          methods: [
            ['required', 'The name is required'],
          ],
        }
      }, {
        id: 'url',
        title: 'URL',
        helperText: 'Enter the url of the link',
        default: '',
        validate: {
          type: 'string',
          methods: [
            ['required', 'The url is required'],
            ['matches', '^(code:|https?:\/\/)', 'Must be a valid url - e.g. http://google.com'],
          ],
        }
      }],
    }],
  },
}

export default forms