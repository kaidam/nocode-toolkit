// cells we will render in documents
// based on the cellConfig of the schema
import Title from '../../components/cells/Title'
import RichText from '../../components/cells/RichText'
import Image from '../../components/cells/Image'
import Video from '../../components/cells/Video'

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
  }],
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
  }],
  cellConfig: {
    component: Video,
  },
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
  }],
  cellConfig: {
    component: Title,
    padding: 1,
  },
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
  }],
  cellConfig:  {
    component: RichText,
    padding: 1,
    compactEditor: true,
    noScrollEditor: true,
    fullHeightEditor: true,
  },
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
  }],
  cellConfig: {
    component: Image,
  },
}

const settings = {
  driver: 'local',
  type: 'settings',
  title: 'Settings',
  icon: 'settings',
  metadata: {
    nodeType: 'system',
    detailsTitle: 'Website',
  },
  // settings cannot be added they are a global singleton
  parentFilter: [],
  initialValues: {
    title: 'Website Title',
    test: 'hello',
    copyright_message: '&copy; &year; My Company Name',
    description: '',
    keywords: '',
    color: {color: "#3f51b5"},
  },
  tabs: [{
    id: 'main',
    title: 'Website',
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
  }, {
    id: 'other',
    title: 'Other',
    schema: [{
      id: 'test',
      title: 'Test',
      helperText: 'Enter a value',
    }]
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