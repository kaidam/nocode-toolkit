import Promise from 'bluebird'
import axios from 'axios'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'

import selectors from '../selectors'
import apiUtils from '../../utils/api'
import { finder as initialState } from '../initialState'

import networkWrapper from '../networkWrapper'
import jobActions from './job'
import contentActions from './content'
import uiActions from './ui'
import snackbarActions from './snackbar'

import library from '../../types/library'
import typeUtils from '../../types/utils'

import {
  SEARCH_DELAY,
} from '../../config'

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
    } = action.payload
    const driverSchema = library.get([driver, 'finder'].join('.'))
    const folders = items.filter(item => driverSchema.finder.isFolder(item))
    const nonFolders = items.filter(item => !driverSchema.finder.isFolder(item))
    state.list = folders.concat(nonFolders)
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
}

let currentSearchTimeout = null

const sideEffects = {

  openDialogFinder: ({
    driver,
    location,
    params = {},
  }) => (dispatch, getState) => {
    dispatch(uiActions.openDialog('finder', {
      driver,
      location,
      ...params
    }))
  },

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

    dispatch(actions.setList({
      driver,
      items: [],
    }))
    let items = []
    if(search) {
      items = await loaders.getSearch(getState, {
        driver,
        query: search,
        filter: listFilter,
        page,
      })
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
      items
    }))
  }),

  /*
  
    the user has typed into the search box
    wait a short time so we don't do a search for every keypress
  
  */
  updateSearch: (value) => (dispatch, getState) => {
    dispatch(actions.setSearchValue(value))
    if(currentSearchTimeout) clearTimeout(currentSearchTimeout)
    currentSearchTimeout = setTimeout(() => {
      dispatch(actions.getList())
    }, SEARCH_DELAY)
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
    } = selectors.router.queryParams(getState())
    await dispatch(jobActions.waitForJob({
      throwError: true,
      showWindow: true,
      loader: () => loaders.addContent(getState, {
        driver,
        content_id: id,
        location,
        data,
      }),
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
      const [ _, parent ] = location.split(':')

      // first - create the remote item via the driver
      const newItem = await loaders.createRemoteItem(getState, {
        driver,
        parent,
        data: {
          mimeType: type,
          ...saveData
        },
      })

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