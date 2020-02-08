import utils from './utils'

// if we are adding in finder - our controller is "finder"
// because we are only creating remote content not adding it also
// if we are adding anywhere else - our controller is "remoteContent"
// because we want to create the remote content and then add it
const getContentFormParams = ({
  structure,
  location,
}) => {
  return location.indexOf('finder:') == 0 ?
    {
      controller: 'finder'
    } :
    {
      controller: 'remoteContent'
    }
}

const folder = {
  driver: 'drive',
  type: 'folder',
  title: 'Create New Drive Folder',
  icon: 'folder',
  metadata: {
    hasChildren: true,
    fullHeight: false,
  },
  parentFilter: ['section', 'drive.finder', 'drive.folder'],
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
  content: {
    getQueryParams: getContentFormParams,
  }
}

const document = {
  driver: 'drive',
  type: 'document',
  title: 'Create New Google Docs',
  icon: 'docs',
  metadata: {
    externalEditor: true,
  },
  parentFilter: ['section', 'drive.finder', 'drive.folder'],
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
  content: {
    getQueryParams: getContentFormParams,
  }
}

const image = {
  driver: 'drive',
  type: 'image',
  title: 'Google Drive Image',
  help: 'Choose an image from Google drive',
  icon: 'drive',
  parentFilter: ['image'],
}

const finder = {
  driver: 'drive',
  title: 'Add Existing Drive Content',
  icon: 'drive',
  metadata: {},
  parentFilter: ['section', 'local.folder', 'home'],
  // this means if we add this content
  // we open the finder dialog not the content dialog
  openDialog: 'finder',
  // put these params into the finder dialog
  // to control whether we can add folders or just documents
  finder: {
    loadAncestors: (parent) => parent && parent != 'shared' && parent != 'root',
    // the search is active for google drive
    canSearch: () => true,
    hasPagination: () => false,
    renderStyle: () => 'list',
    getFinderTitle: () => null,
    getItemTitle: (item) => item.name,
    getItemSubtitle: (item) => null,
    getItemAdditionalData: (item) => null,
    // tells you if you can add things to the given parent
    // in this case we can add to any parent apart from
    // the root shared with me folder
    canAddToFinder: (tab) => tab != 'shared',
    // tells you if the given item can be added from the current finder window
    canAddFromFinder: (addFilter, item) => {
      if(!addFilter) return false
      const isFolder = utils.isFolder(item)
      const isImage = utils.isImage(item)
      if(isFolder) return addFilter.indexOf('folder') >= 0
      if(isImage) return addFilter.indexOf('image') >= 0
      return addFilter.indexOf('document') >= 0 
    },
    // does this driver support adding everything inside a folder
    // i.e. ghost mode content
    canAddGhostFolder: () => true,  
    // can this item be opened using a remote driver url?
    canOpenRemotely: (item) => true,
    // get the open remote button title
    openRemotelyButtonTitle: (item) => 'Drive',
    // open the item with a remote url
    openRemotely: (item) => {
      const editUrl = utils.getGoogleLink(utils.getEditUrl(item))
      window.open(editUrl)
    },
    getItemIcon: (item) => utils.getItemIcon(item),
    getItemThumbnail: (item) => utils.getItemThumbnail(item),
    isFolder: (item) => utils.isFolder(item),
    isImage: (item) => utils.isImage(item),
    // extra params to add to the finder route
    getQueryParams: ({
      structure,
      location,
    }) => {
      return structure == 'tree' ?
        // in tree mode we can both see and add folders & documents
        {
          listFilter: 'folder,document',
          addFilter: 'folder,document',
        } :
        // in list mode we can see both but only add documents
        {
          listFilter: 'folder,document',
          addFilter: 'document',
        }
    },
    // the root sources shown as tabs at the top
    tabs: [{
      title: 'My Drive',
      // this updates the tab query param so the UI shows the active tab
      // this is different to parent because we might be looking inside
      // a folder that is in the shared tab
      id: 'root',
      // this controls the parent param to the backend to load items from this location
      parent: 'root',
    }, {
      title: 'Shared With Me',
      id: 'shared',
      parent: 'shared',
    }],
  }
}

const schemas = {
  folder,
  document,
  image,
  finder,
}

export default schemas