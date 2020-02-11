import Promise from 'bluebird'
import axios from 'axios'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'
import routerActions from '@nocode-toolkit/website/store/moduleRouter'

import selectors from '../selectors'
import apiUtils from '../../utils/api'
import { finder as initialState } from '../initialState'

import networkWrapper from '../networkWrapper'
import jobActions from './job'
import contentActions from './content'
import uiActions from './ui'
import snackbarActions from './snackbar'
import driveUtils from '../../types/drive/utils'
import library from '../../types/library'
import typeUtils from '../../types/utils'
import globals from '../../globals'

const prefix = 'finder'

const wrapper = (name, handler) => networkWrapper({
  prefix,
  name,
  snackbarError: true,
  handler,
})

const reducers = {
  setList: (state, action) => {
    const {
      driver,
      items,
      search,
    } = action.payload
    items.sort((a, b) => {
      if(!a.name || !b.name) return 0
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    })
    const driverSchema = library.get([driver, 'finder'].join('.'))
    const folders = items.filter(item => driverSchema.finder.isFolder(item))
    const nonFolders = items.filter(item => !driverSchema.finder.isFolder(item))
    state.list = folders.concat(nonFolders)
    state.resultsSearch = search
  },
  setAncestors: (state, action) => {
    state.ancestors = action.payload
  },
  setSearchValue: (state, action) => {
    state.search = action.payload
  },
}

const loaders = {

  addContent: apiUtils.post('/content'),

  getList: (getState, {
    driver,
    parent = 'root',
    filter,
    page,
  } = {}) => axios.get(apiUtils.websiteUrl(getState, `/remote/${driver}/list/${parent}`), {
    params: {
      filter,
      page,
    }
  })
    .then(apiUtils.process),

  getAncestors: (getState, {
    driver,
    parent,
  } = {}) => axios.get(apiUtils.websiteUrl(getState, `/remote/${driver}/ancestors/${parent}`))
    .then(apiUtils.process),

  getSearch: (getState, {
    driver,
    query,
    filter,
    page,
  } = {}) => axios.get(apiUtils.websiteUrl(getState, `/remote/${driver}/search`), {
    params: {
      query,
      filter,
      page,
    }
  })
    .then(apiUtils.process),

  createRemoteItem: (getState, {
    driver,
    parent,
    data,
  }) => axios.post(apiUtils.websiteUrl(getState, `/remote/${driver}/create/${parent}`), data)
    .then(apiUtils.process),

  updateRemoteItem: (getState, {
    driver,
    id,
    data,
  }) => axios.put(apiUtils.websiteUrl(getState, `/remote/${driver}/update/${id}`), data)
    .then(apiUtils.process),

  ensureSectionFolder: (getState, {
    driver,
    section,
  }) => axios.post(apiUtils.websiteUrl(getState, `/remote/${driver}/section/${section}/folder`))
    .then(apiUtils.process),

  linkContentToSection: (getState, {
    driver,
    section,
    content_id,
  }) => axios.post(apiUtils.websiteUrl(getState, `/remote/${driver}/section/${section}/content/${content_id}`))
    .then(apiUtils.process),

  linkContentToSingleton: (getState, {
    driver,
    singleton,
    content_id,
  }) => axios.post(apiUtils.websiteUrl(getState, `/remote/${driver}/singleton/${singleton}/content/${content_id}`))
    .then(apiUtils.process),

  remove: (getState, {
    id,
  }) => axios.delete(apiUtils.websiteUrl(getState, `/content/${id}`))
    .then(apiUtils.process),
}

const sideEffects = {

  openDialogFinder: ({
    driver,
    location,
    params = {},
  }) => (dispatch, getState) => {
    globals.trackEvent('open_finder_button', {
      location,
      driver,
    }, getState)
    dispatch(uiActions.openDialog('finder', {
      driver,
      location,
      ...params
    }))
  },

  loadAncestors: ({
    driver,
    parent,
  } = {}) => wrapper('getList', async (dispatch, getState) => {
    const ancestors = await loaders.getAncestors(getState, {
      driver,
      parent,
    })
    dispatch(actions.setAncestors(ancestors))
  }),

  // get a list of content from a remote driver under parent
  // the listFilter controls what we want to see (e.g. folder,document)
  getList: ({
    parent,
    driver,
    search,
    listFilter,
    page,
  } = {}) => wrapper('getList', async (dispatch, getState) => {
    const queryParams = selectors.router.queryParams(getState())

    parent = parent || queryParams.parent
    driver = driver || queryParams.driver
    listFilter = listFilter || queryParams.listFilter
    page = page || queryParams.page
    search = search || selectors.finder.search(getState())

    const driverSchema = library.get([driver, 'finder'].join('.'))

    if(driverSchema.finder && driverSchema.finder.loadAncestors && !search && driverSchema.finder.loadAncestors(parent)) {
      dispatch(actions.loadAncestors({
        driver,
        parent,
      }))
    }
    else {
      dispatch(actions.setAncestors([]))
    }

    dispatch(actions.setList({
      driver,
      items: [],
      search: '',
    }))
    let items = []
    if(search) {
      items = await loaders.getSearch(getState, {
        driver,
        query: search,
        filter: listFilter,
        page,
      })
      dispatch(actions.setAncestors([]))
    }
    else {
      items = await loaders.getList(getState, {
        driver,
        parent,
        filter: listFilter,
        page,
      })
    }
    
    dispatch(actions.setList({
      driver,
      items,
      search,
    }))
  }),

  /*
  
    the user has typed into the search box
    wait a short time so we don't do a search for every keypress
  
  */
  updateSearch: (value) => (dispatch, getState) => {
    dispatch(actions.setSearchValue(value))
  },

  resetSearch: () => (dispatch, getState) => {
    dispatch(actions.setSearchValue(''))
    dispatch(actions.getList())
  },

  /*
  
    when the user clicks the "Add" button in finder meaning they
    want to add the selected content to the location in the url
  
  */
  addContent: ({
    id,
    data = {}
  } = {}) => wrapper('addContent', async (dispatch, getState) => {
    const {
      driver,
      location,
      mode,
    } = selectors.router.queryParams(getState())

    const [ locationType, locationId ] = location.split(':')

    // check to see if we already have a synced folder for this section
    if(mode == 'sync' && locationType == 'section') {

      // const sectionTreeSelector = useMemo(selectors.content.sectionTree, [])
      // const sectionTree = useSelector(state => sectionTreeSelector(state, section))
      const sectionSyncFolder = selectors.content.sectionSyncFolder()(getState(), locationId)

      // we already have a synched folder for this section
      // warn that this will be removed for us to sync the new folder
      if(sectionSyncFolder) {
        if(sectionSyncFolder.id == id) {
          dispatch(snackbarActions.setError(`The ${sectionSyncFolder.data.name} folder is already synced to this section`)) 
          return
        }
        else {
          const confirmed = await dispatch(uiActions.waitForConfirmation({
            title: `Replace the ${sectionSyncFolder.data.name} folder sync?`,
            message: `
              <p>The <b>${sectionSyncFolder.data.name}</b> folder is currently synced to this section.</p>
              <p>If you proceed - all content from the <b>${sectionSyncFolder.data.name}</b> folder will first be removed.</p>
              <p>Do you want to proceed?</p>
            `
          }))

          if(!confirmed) return

          await dispatch(jobActions.waitForJob({
            throwError: true,
            loader: () => loaders.remove(getState, {
              id: sectionSyncFolder.id,
            }),
            runBeforeComplete: async () => {
              dispatch(snackbarActions.setSuccess(`un-sync of ${sectionSyncFolder.data.name} in progress...`))
              await Promise.delay(1000)
              dispatch(routerActions.navigateTo('root'))
            }
          }))
        }
      }
    }

    await dispatch(jobActions.waitForJob({
      throwError: true,
      showWindow: true,
      loader: () => loaders.addContent(getState, {
        driver,
        content_id: id,
        location,
        data,
      }),
      runBeforeComplete: async () => {
        dispatch(snackbarActions.setSuccess(`folder is now synced`))
      }
    }))
  }),

  /*
  
    we are creating a new item in the remote - this is not adding content
    but allowing users to create folders/docs from the finder if the driver
    allows it

    we always assume this is a 'create' (i.e. there is no edit from inside finder)
  
  */

  saveFinderContent: ({
    params: {
      driver,
      type,
      location,
    },
    data, 
  }) => wrapper('saveFinderContent', async (dispatch, getState) => {
    const [ _, parent ] = location.split(':')
    await loaders.createRemoteItem(getState, {
      driver,
      parent,
      data: {
        mimeType: type,
        ...data
      },
    })    
    dispatch(snackbarActions.setSuccess(`${type} created`))

    // navigate back to the finder now the remote item has been created
    window.history.back()
  }),

  openSectionFolder: ({
    section,
  }) => wrapper('saveRemoteContent', async (dispatch, getState) => {
    dispatch(uiActions.setLoading(true))
    try {
      const sectionFolder = await loaders.ensureSectionFolder(getState, {
        driver: 'drive',
        section,
      })
      window.open(driveUtils.getGoogleLink(driveUtils.getFolderLink(sectionFolder.id)))
    } catch(e) {
      dispatch(uiActions.setLoading(false))
      throw e
    }
    dispatch(uiActions.setLoading(false))
  }),

  /*
  
    the user is adding some content to a remote item

    this is either in the finder in which case it's not added to the content tree
    or it's from the content tree in which case we trigger a rebuild
  
  */
  saveRemoteContent: ({
    params: {
      driver,
      type,
      id,
      location,
    },
    data,
  }) => wrapper('saveRemoteContent', async (dispatch, getState) => {
    const saveData = Object.assign({}, data)

    // we are creating a new remote item then inserting it
    if(id == 'new') {

      globals.trackEvent('add_finder_content', {
        location,
        driver,
        type,
      }, getState)

      let [ parentType, parent ] = location.split(':')
      let parentId = parent

      // we are adding a remote item to a section
      // so we need a folder to create it in
      // first - ensure the nocode folder for the section
      // this will also link the folder to the section (in ghost mode)
      // so once this is done - all we need to do is add the
      // content to the returned parent and rebuild
      if(parentType == 'section' || parentType == 'singleton') {
        const parentFolder = await loaders.ensureSectionFolder(getState, {
          driver,
          section: parent,
        })
        parentId = parentFolder.id
      }
      
      // create the remote item via the driver
      const newItem = await loaders.createRemoteItem(getState, {
        driver,
        parent: parentId,
        data: {
          mimeType: type,
          ...saveData
        },
      })

      // now we need to link the new item to the section
      if(parentType == 'section') {
        await loaders.linkContentToSection(getState, {
          driver,
          section: parent,
          content_id: newItem.id,
        })
      }
      else if(parentType == 'singleton') {
        await loaders.linkContentToSingleton(getState, {
          driver,
          singleton: parent,
          content_id: newItem.id,
        })
      }

      // trigger a rebuild so the backend has the new item in the tree
      await dispatch(jobActions.rebuild({
        manualComplete: true,
      }))

      // get the annotation data from the options form
      const {
        annotation,
      } = typeUtils.getSaveData({
        driver,
        type,
        item: null,
        data,
      })

      // if it exists - then update the annotation server side
      if(annotation) {
        await dispatch(contentActions.saveAnnotation({
          id: newItem.id,
          annotation,
        }, data))
      }

      dispatch(snackbarActions.setSuccess(`${type} created`))

      await dispatch(uiActions.closeDialogs())
      await dispatch(jobActions.reload())
    }
    else {

      globals.trackEvent('save_finder_content', {
        location,
        driver,
        type,
      }, getState)

      // first we update the remote item so the next time we
      // rebuild the data is there
      await loaders.updateRemoteItem(getState, {
        driver,
        id,
        data: saveData,
      })

      dispatch(snackbarActions.setSuccess(`updating ${type}`))

      // then we update the content via a job
      await dispatch(contentActions.saveContent({
        params: {
          driver,
          type,
          id,
          location,
        },
        data
      }))

    }

    
  }),
}

const reducer = CreateReducer({
  initialState,
  reducers,
  prefix,
})

const actions = CreateActions({
  reducers,
  prefix,
  sideEffects,
})

export { actions, reducer }
export default actions