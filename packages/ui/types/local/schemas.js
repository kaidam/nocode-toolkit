// cells we will render in documents
// based on the cellConfig of the schema
import Title from '../../components/cells/Title'
import RichText from '../../components/cells/RichText'
import RawHTML from '../../components/cells/RawHTML'
import Image from '../../components/cells/Image'
import Video from '../../components/cells/Video'
import Snippet from '../../components/cells/Snippet'

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
    data: [{
      type: 'paragraph',
      children: [
        { text: '' },
      ],
    }],
  },
  schema: [{
    id: 'data',
    noTitle: true,
    component: 'richtext',
  }],
  cellConfig:  {
    component: RichText,
    compactEditor: true,
    noScrollEditor: true,
    fullHeightEditor: true,
  },
}

const rawhtml = {
  driver: 'local',
  type: 'rawhtml',
  title: 'HTML',
  icon: 'code',
  metadata: {},
  parentFilter: ['cell'],
  initialValues: {
    html: '',
  },
  schema: [{
    id: 'html',
    noTitle: true,
    component: 'textarea',
    rows: 15,
  }],
  cellConfig:  {
    component: RawHTML,
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

const snippet = {
  driver: 'local',
  type: 'snippet',
  title: 'Snippet',
  icon: 'code',
  metadata: {
    disableCellEdit: true,
  },
  parentFilter: [],
  initialValues: {},
  cellConfig: {
    component: Snippet,
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
}

const cellSettings = {
  driver: 'local',
  type: 'cellSettings',
  title: 'Cell Settings',
  icon: 'settings',
  metadata: {
    nodeType: 'system',
  },
  // settings cannot be added they are a global singleton
  parentFilter: [],
  initialValues: {
    align: 'left',
    padding: 8,
  },
  schema: [{
    id: 'align',
    title: 'Alignment',
    helperText: 'The alignment of content for this cell',
    component: 'radio',
    row: true,
    options: [{
      title: 'Left',
      value: 'left',
    },{
      title: 'Center',
      value: 'center',
    },{
      title: 'Right',
      value: 'right',
    }],
  },{
    id: 'padding',
    title: 'Padding',
    helperText: 'The padding of content for this cell',
    inputProps: {
      type: 'number',
    },
  }],
}

const schemas = {
  folder,
  externalLink,
  title,
  richtext,
  rawhtml,
  image,
  snippet,
  youtube,
  settings,
  logo,
  section,
  cellSettings,
}

export default schemas