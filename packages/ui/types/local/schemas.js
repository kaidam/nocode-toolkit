// cells we will render in documents
// based on the cellConfig of the schema
import Title from '../../components/cells/Title'
import RichText from '../../components/cells/RichText'
import RawHTML from '../../components/cells/RawHTML'
import Image from '../../components/cells/Image'
import Video from '../../components/cells/Video'
import Snippet from '../../components/cells/Snippet'
import DocumentInfo from '../../components/cells/DocumentInfo'
import BreadCrumbs from '../../components/cells/BreadCrumbs'
import BackNextButtons from '../../components/cells/BackNextButtons'
import Search from '../../components/cells/Search'

const nocodeGroup = {
  driver: 'local',
  type: 'nocodeGroup',
  title: 'Nocode Content',
  icon: 'nocode',
  parentFilter: [],
}

const folder = {
  driver: 'local',
  type: 'folder',
  title: 'Folder',
  icon: 'folder',
  metadata: {
    nodeType: 'folder',
    hasChildren: true,
    group: 'nocodeGroup',
  },
  parentFilter: ['local.folder'],
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
    //group: 'nocodeGroup',
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
    group: 'nocodeGroup',
  },
  parentFilter: ['cell'],
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
    group: 'media',
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
    group: 'text',
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
    group: 'text',
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
    group: 'text',
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
    group: 'media',
    component: Image,
  },
}

const snippet = {
  driver: 'local',
  type: 'snippet',
  title: 'Snippet',
  icon: 'code',
  metadata: {},
  parentFilter: [],
  initialValues: {},
  cellConfig: {
    disableEdit: true,
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

const pageSettings = {
  driver: 'local',
  type: 'pageSettings',
  title: 'Page Settings',
  icon: 'settings',
  metadata: {
    nodeType: 'system',
    detailsTitle: 'Page',
  },
  // settings cannot be added they are a global singleton
  parentFilter: [],
  initialValues: {},
  tabs: [],
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
    excludeDrivers: ['unsplash']
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

const documentTitle = {
  driver: 'local',
  type: 'documentTitle',
  title: 'Title',
  icon: 'title',
  metadata: {},
  parentFilter: ['cell'],
  initialValues: {},
  schema: [],
  addCellFilter: (settings, { location }) => location == 'document',
  cellConfig: {
    group: 'document',
    cell: {
      component: 'title',
      source: 'title',
      editor: 'external',
    },
  },
}

const documentInfo = {
  driver: 'local',
  type: 'documentInfo',
  title: 'Info',
  icon: 'info',
  metadata: {},
  parentFilter: ['cell'],
  initialValues: {},
  schema: [],
  addCellFilter: (settings, { location }) => location == 'document',
  cellConfig: {
    group: 'document',
    component: DocumentInfo,
    cell: {
      component: 'documentInfo',
      source: 'info',
      editor: 'external',
    },
  },
}

const documentContent = {
  driver: 'local',
  type: 'documentContent',
  title: 'Content',
  icon: 'text',
  metadata: {},
  parentFilter: ['cell'],
  initialValues: {},
  schema: [],
  addCellFilter: (settings, { location }) => location == 'document',
  cellConfig: {
    group: 'document',
    cell: {
      component: 'html',
      source: 'external',
      editor: 'external',
      index: 0,
      mainDocumentContent: true,
    },
  },
}

const breadcrumbs = {
  driver: 'local',
  type: 'breadcrumbs',
  title: 'Breadcrumbs',
  icon: 'text',
  metadata: {},
  parentFilter: ['cell'],
  initialValues: {},
  schema: [],
  addCellFilter: (settings, { location }) => location == 'document',
  cellConfig: {
    disableEdit: true,
    group: 'navigation',
    component: BreadCrumbs,
    cell: {
      component: 'breadcrumbs',
      source: 'none',
      editor: 'none',
    },
  },
}

const backnextButtons = {
  driver: 'local',
  type: 'backnextButtons',
  title: 'Back/Next buttons',
  icon: 'backnext',
  parentFilter: ['cell'],
  initialValues: {},
  schema: [],
  addCellFilter: (settings, { location }) => location == 'document',
  cellConfig: {
    disableEdit: true,
    group: 'navigation',
    component: BackNextButtons,
    cell: {
      component: 'backnextButtons',
      source: 'none',
      editor: 'none',
    },
  },
}

const search = {
  driver: 'local',
  type: 'search',
  title: 'Search',
  icon: 'search',
  metadata: {},
  parentFilter: ['cell'],
  initialValues: {},
  schema: [],
  cellConfig: {
    disableEdit: true,
    group: 'navigation',
    component: Search,
    cell: {
      component: 'search',
      source: 'none',
      editor: 'none',
    },
  },
}

const schemas = {
  nocodeGroup,
  externalLink,
  title,
  richtext,
  rawhtml,
  image,
  snippet,
  youtube,
  folder,
  settings,
  logo,
  section,
  cellSettings,
  pageSettings,
  documentTitle,
  documentInfo,
  documentContent,
  breadcrumbs,
  backnextButtons,
  search,
}

export default schemas