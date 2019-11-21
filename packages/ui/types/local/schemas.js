const folder = {
  driver: 'local',
  type: 'folder',
  title: 'Folder',
  icon: 'folder',
  metadata: {
    nodeType: 'folder',
    hasChildren: true,
  },
  parentFilter: ['section', 'local.folder'],
  initialValues: {
    name: '',
  },
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
  }]
}

const externalLink = {
  driver: 'local',
  type: 'externalLink',
  title: 'External Link',
  icon: 'link',
  metadata: {
    nodeType: 'externalLink',
    contentType: 'externalLink',
  },
  parentFilter: ['section', 'local.folder'],
  initialValues: {
    name: '',
    url: '',
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
  }]
}

const youtube = {
  driver: 'local',
  type: 'youtube',
  title: 'Youtube Video',
  icon: 'video',
  metadata: {
    nodeType: 'externalLink',
    contentType: 'video',
  },
  parentFilter: ['section', 'local.folder', 'cell'],
  initialValues: {
    name: '',
    url: '',
  },
  schema: [{
    id: 'name',
    title: 'Name',
    helperText: 'Enter the name of the youtube video',
    validate: {
      type: 'string',
      methods: [
        ['required', 'The name is required'],
      ],
    }
  }, {
    id: 'url',
    title: 'URL',
    helperText: 'Enter the url of the youtube video - e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    validate: {
      type: 'string',
      methods: [
        ['required', 'The url is required'],
        ['url', 'Must be a valid youtube url - e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
      ],
    }
  }]
}

const title = {
  driver: 'local',
  type: 'title',
  title: 'Title',
  icon: 'title',
  metadata: {},
  parentFilter: ['cell'],
  initialValues: {
    title: '',
  },
  schema: [{
    id: 'title',
    title: 'title',
    helperText: 'Enter the text for the title',
  }]
}

const richtext = {
  driver: 'local',
  type: 'richtext',
  title: 'Text',
  icon: 'text',
  metadata: {},
  parentFilter: ['cell'],
  initialValues: {
    text: '',
  },
  schema: [{
    id: 'text',
    noTitle: true,
    component: 'richtext',
  }]
}

const image = {
  driver: 'local',
  type: 'image',
  title: 'Image',
  icon: 'image',
  metadata: {},
  parentFilter: ['cell'],
  initialValues: {
    image: null,
  },
  schema: [{
    id: 'image',
    title: 'Image',
    helperText: 'Upload an image',
    component: 'image',
  }]
}

const settings = {
  driver: 'local',
  type: 'settings',
  title: 'Settings',
  icon: 'settings',
  metadata: {
    nodeType: 'system',
  },
  // settings cannot be added they are a global singleton
  parentFilter: [],
  initialValues: {
    title: 'Website Title',
    copyright_message: '&copy; &year; My Company Name',
    description: '',
    keywords: '',
    color: {color: "#3f51b5"},
  },
  schema: [{
    id: 'color',
    title: 'Color',
    helperText: 'Choose your color',
    component: 'color',
  }, {
    id: 'title',
    title: 'Title',
    helperText: 'Enter the title for your website',
  }, {
    id: 'copyright_message',
    title: 'Copyright Message',
    helperText: 'Enter the copyright message to appear in the footer',
  }, {
    id: 'description',
    title: 'Description',
    component: 'textarea',
    rows: 3,
    helperText: 'Enter the description for your website',
  }, {
    id: 'keywords',
    title: 'Keywords',
    component: 'textarea',
    rows: 3,
    helperText: 'Enter some keywords for search engines to find your website',
  }]
}

const logo = {
  driver: 'local',
  type: 'logo',
  title: 'Logo',
  icon: 'settings',
  metadata: {
    nodeType: 'system',
  },
  // settings cannot be added they are a global singleton
  parentFilter: [],
  initialValues: {
    title: '',
    image: null,
  },
  schema: [{
    id: 'title',
    title: 'Logo Text',
    helperText: 'Enter some text to appear in the top bar',
  }, {
    id: 'image',
    title: 'Image',
    helperText: 'Upload an image for your logo',
    component: 'image',
  }]
}

const section = {
  driver: 'local',
  type: 'section',
  title: 'Section',
  icon: 'settings',
  metadata: {
    hasChildren: true,
  },
  // settings cannot be added they are a global singleton
  parentFilter: [],
  initialValues: {},
  schema: [],
}

const schemas = {
  folder,
  externalLink,
  title,
  richtext,
  image,
  youtube,
  settings,
  logo,
  section,
}

export default schemas