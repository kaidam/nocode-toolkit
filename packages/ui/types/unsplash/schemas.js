import React from 'react'
import utils from './utils'

const image = {
  driver: 'unsplash',
  type: 'image',
  title: 'Unsplash Image',
  help: 'Choose an image from Unsplash',
  icon: 'unsplash',
  parentFilter: ['image'],
}

const finder = {
  driver: 'unsplash',
  title: 'Unsplash Content',
  icon: 'unsplash',
  metadata: {},
  parentFilter: [],
  // this means if we add this content
  // we open the finder dialog not the content dialog
  openDialog: 'finder',
  
  // put these params into the finder dialog
  // to control whether we can add folders or just documents
  finder: {
    // the search is active for google drive
    canSearch: () => true,
    hasPagination: () => true,
    renderStyle: () => 'grid',
    getFinderTitle: () => {
      return (
        <div>
          images by <a
            style={{
              color: '#000000',
            }}
            target="_blank"
            href="https://unsplash.com/?utm_source=nocode&utm_medium=referral"
          >Unsplash</a>
        </div>
      )
    },
    getItemTitle: (item) => `by: ${item.user.name}`,
    getItemSubtitle: (item) => item.user.location || ' ',
    getItemAdditionalData: (item) => {
      return {
        unsplash: {
          image: {
            id: item.id,
          },
          user: {
            fullname: item.user.name,
            username: item.user.username,
          }
        }
      }
    },
    // tells you if you can add things to the given parent
    // in this case we can add to any parent apart from
    // the root shared with me folder
    canAddToFinder: (tab) => false,
    // tells you if the given item can be added from the current finder window
    canAddFromFinder: (addFilter, item) => true,
    // does this driver support adding everything inside a folder
    // i.e. ghost mode content
    canAddGhostFolder: () => false,  
    // can this item be opened using a remote driver url?
    canOpenRemotely: (item) => false,
    // get the open remote button title
    openRemotelyButtonTitle: (item) => 'Unsplash',
    // open the item with a remote url
    openRemotely: (item) => {
      console.log('n/a')
    },
    getItemIcon: (item) => null,
    getItemThumbnail: (item) => utils.getItemThumbnail(item),
    isFolder: (item) => false,
    // extra params to add to the finder route
    getQueryParams: () => {
      return {
        listFilter: 'image',
        addFilter: 'image',
      }
    },
  }
}

const schemas = {
  image,
  finder,
}

export default schemas