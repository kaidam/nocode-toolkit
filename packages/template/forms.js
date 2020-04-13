const valueInjector = (inject = {}) => (values = {}) => Object.assign({}, values, inject)

const forms = {
  'section': {
    initialValues: {
      annotation: {
        sorting: {},
      },
    },
    tabs: [{
      id: 'settings',
      title: 'Settings',
      schema: [{
        id: 'annotation.sorting',
        title: 'Sorting',
        helperText: 'How are children items sorted inside this folder?',
        component: 'sorting',
      }],
    }, {
      id: 'hidden',
      title: 'Hidden Items',
      schema: [{
        title: 'Hidden Items',
        helperText: 'Manage the hidden items in this section',
        component: 'hiddenItems',
      }],
    }],
  },
  // this will be merged into other cell forms
  'cell.settings': {
    initialValues: {
      settings: {
        horizontal_align: 'left',
        vertical_align: 'top',
        padding: 8,
      },
    },
    tabs: [{
      id: 'settings',
      title: 'Settings',
      schema: [
        [{
          id: 'settings.horizontal_align',
          title: 'Horizontal Align',
          helperText: 'The horizontal alignment of content in this cell',
          component: 'select',
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
          inputProps: {
            type: 'number',
          },
        }],
      ]
    }],
  },
  'drive.folder': {
    initialValues: {
      name: '',
      annotation: {
        sorting: {},
      },
    },
    processFormValues: valueInjector({mimeType: 'folder'}),
    tabs: [{
      id: 'main',
      title: 'Details',
      schema: [{
        id: 'name',
        title: 'Name',
        helperText: 'Enter the name of the folder',
        validate: {
          type: 'string',
          methods: [
            ['required', 'The name is required'],
          ],
        }
      }],
    },{
      id: 'settings',
      title: 'Settings',
      schema: [{
        id: 'annotation.sorting',
        title: 'Sorting',
        helperText: 'How are children items sorted inside this folder?',
        component: 'sorting',
      }],
    }]
  },
  'drive.document': {
    initialValues: {
      name: '',
    },
    processFormValues: valueInjector({mimeType: 'document'}),
    schema: [{
      id: 'name',
      title: 'Name',
      helperText: 'Enter the name of the document',
      validate: {
        type: 'string',
        methods: [
          ['required', 'The name is required'],
        ],
      }
    }],
  },
  'link': {
    initialValues: {
      name: '',
      url: '',
      noRoute: true,
    },
    schema: [{
      id: 'name',
      title: 'Name',
      helperText: 'Enter the name of the link',
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
      validate: {
        type: 'string',
        methods: [
          ['required', 'The url is required'],
          ['url', 'Must be a valid url - e.g. http://google.com'],
        ],
      }
    }],
  },
  'security.user': {
    initialValues: {
      username: '',
      password: '',
    },
    schema: [{
      id: 'username',
      title: 'Username',
      helperText: 'Enter the username for this user',
      validate: {
        type: 'string',
        methods: [
          ['required', 'The name is required'],
        ],
      }
    }, {
      id: 'password',
      title: 'Password',
      helperText: 'Enter the password for this user',
      inputProps: {
        type: 'password',
      },
      validate: {
        type: 'string',
        methods: [
          ['required', 'The password is required'],
        ],
      }
    }],
  },
  'security.rule': {
    initialValues: {
      rule: '',
    },
    schema: [{
      id: 'rule',
      title: 'Match email',
      helperText: 'Enter a portion or an entire email address to grant access',
      validate: {
        type: 'string',
        methods: [
          ['required', 'The rule is required'],
        ],
      }
    }],
  },
}

export default forms