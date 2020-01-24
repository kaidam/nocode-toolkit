import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import MenuButton from '../../buttons/MenuButton'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import icons from '../../../icons'
import library from '../../../types/library'

const AddIcon = icons.add
const FolderIcon = icons.folder
const ImageIcon = icons.image
const FolderOpenIcon = icons.folderopen
const DocumentIcon = icons.document

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  list: {
    flexGrow: 1,
    height: '100%',
    overflowY: 'auto',
  },
  infoPanel: {
    width: '50%',
    maxWidth: '50%',
    flexGrow: 0,
    overflowY: 'auto',
    borderLeft: '1px solid #999',
  },
  actionsField: {
    width: '250px',
    maxWidth: '250px',
    textAlign: 'right',
  },
  fileNameContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    paddingLeft: '10px',
  },
  fileIconContainer: {
    marginRight: theme.spacing(2),
    minWidth: '32px',
  },
  fileThumbnailContainer: {
    marginRight: theme.spacing(2),
    minWidth: '32px',
  },
  icon: {
    width: '32px',
  },
  thumbnail: {
    width: '32px',
    border: '1px solid #999',
  },
  fileButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionButtonContainer: {
    minWidth: '80px',
  },
  grey: {
    color: theme.palette.text.hint,
  },
  tableCell: {
    padding: '0px',
    paddingTop: '5px',
    paddingBottom: '5px',
  },
  infoPanelTitle: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoPanelButtons: {
    textAlign: 'center',
  },
  infoPanelButton: {
    marginBottom: '20px',
  },
  infoPanelTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoPanelDivider: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  infoPanelText: {
    color: '#666',
    marginBottom: '10px',
  },
  divider: {
    marginBottom: '20px',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRowText: {
    textAlign: 'left',
    flexGrow: 1,
    width: '60%',
  },
  buttonRowButton: {
    textAlign: 'right',
    flexGrow: 1,
    width: '40%',
    paddingRight: '20px',
  },
}))

const FinderList = ({
  driver,
  items,
  addFilter,
  onOpenFolder,
  onAddContent,
}) => {
  const componentIsMounted = useRef(true)
  useEffect(() => {
    return () => {
      componentIsMounted.current = false
    }
  }, []) 

  const [selectedItem, setSelectedItem] = useState(null)

  const classes = useStyles()
  const finderSchema = library.get([driver, 'finder'].join('.'))

  const handleRowClick = useCallback((row) => {
    if(!row.canAdd) {
      onOpenFolder(row.id)
      return
    }
    if(!row.isFolder || selectedItem) {
      setSelectedItem(row)
    }
    else {
      setTimeout(() => {
        if(!componentIsMounted.current) return
        setSelectedItem(row)
      }, 300)
    }
  }, [
    setSelectedItem,
    selectedItem,
    componentIsMounted,
  ])

  const handleRowDoubleClick = useCallback((row) => {
    if(!row.isFolder) return
    if(!row.canAdd) return
    onOpenFolder(row.id)
  }, [
    onOpenFolder,
  ])

  const data = useMemo(() => {
    return items.map((item, index) => {
      const isFolder = finderSchema.finder.isFolder(item)
      const isImage = finderSchema.finder.isImage(item)
      const canAdd = finderSchema.finder.canAddFromFinder(addFilter, item)
      const addGhostMode = finderSchema.finder.canAddGhostFolder(item)
      const itemTitle = finderSchema.finder.getItemTitle(item)
      const itemSubtitle = finderSchema.finder.getItemSubtitle(item)
      
      const icon = finderSchema.finder.getItemIcon(item)
      const thumbnail = finderSchema.finder.getItemThumbnail(item)

      return {
        id: item.id,
        icon,
        isFolder,
        isImage,
        canAdd,
        addGhostMode,
        itemTitle,
        name: (
          <React.Fragment>
            <div className={ classes.fileThumbnailContainer }>
              {
                icon && (
                  <img 
                    className={ classes.icon }
                    src={ icon } 
                  />
                )
              }
            </div>
            <div className={ classes.fileIconContainer }>
              {
                thumbnail && (
                  <img 
                    className={ classes.thumbnail }
                    src={ thumbnail } 
                  />
                )
              }
            </div>
            { itemTitle }
            {
              itemSubtitle ? ` (${itemSubtitle})` : null
            }
          </React.Fragment>
        ),
        item,
      }
    })
  }, [items])

  if(!items || items.length <= 0) {
    return (
      <Typography>No results found...</Typography>
    )
  }
  else {
    return (
      <div className={ classes.root }>
        <div className={ classes.list }>
          <Table>
            <TableBody>
              {
                data.map((row, i) => {
                  return (
                    <TableRow
                      hover
                      selected={ selectedItem && selectedItem.id == row.id }
                      tabIndex={-1}
                      key={ i }
                      onClick={() => handleRowClick(row)}
                      onDoubleClick={() => handleRowDoubleClick(row)}
                    >
                      <TableCell className={ classes.tableCell }>
                        <div className={ classes.fileNameContainer }>
                          { row.name }
                        </div>
                      </TableCell>
                    </TableRow>
                )
                })
              }
            </TableBody>
          </Table>
        </div>
        {
          selectedItem && (
            <div className={ classes.infoPanel }>
              <div className={ classes.infoPanelButtons }>
                <Typography variant="h6" display="block" gutterBottom className={ classes.infoPanelTitle }>
                  {
                    selectedItem.icon && (
                      <React.Fragment>
                        <img 
                          className={ classes.icon }
                          src={ selectedItem.icon } 
                        />
                        &nbsp;
                      </React.Fragment>
                    )
                  }
                  { selectedItem.itemTitle }
                </Typography>
                <Divider className={ classes.divider } />
                {
                  selectedItem.isFolder ? (
                    <React.Fragment>
                      <div className={ classes.buttonRow }>
                        
                        <div className={ classes.buttonRowButton }>
                          <Button
                            size="small"
                            color="secondary"
                            variant="contained"
                            className={ classes.infoPanelButton }
                            onClick={ () => onAddContent({id:selectedItem.id}) }
                          >
                            <FolderIcon />
                            &nbsp;&nbsp;Add Folder
                          </Button>
                        </div>
                        <div className={ classes.buttonRowText }>
                          <Typography className={ classes.infoPanelText } variant="caption" display="block" gutterBottom>
                            Add this folder and keep it synchronized with Google Drive.
                          </Typography>
                        </div>
                      </div>
                      <Divider className={ classes.divider } />
                      {
                        selectedItem.addGhostMode && (
                          <React.Fragment>
                            <div className={ classes.buttonRow }>
                              <div className={ classes.buttonRowButton }>
                                <Button
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                  className={ classes.infoPanelButton }
                                  onClick={ () => onAddContent({id:selectedItem.id, data:{ghost:true}}) }
                                >
                                  <FolderOpenIcon />
                                  &nbsp;&nbsp;Add Contents
                                </Button>
                              </div>
                              <div className={ classes.buttonRowText }>
                                <Typography className={ classes.infoPanelText } variant="caption" display="block" gutterBottom>
                                  Add everything <b>inside</b> this folder and keep it synchronized with Google Drive.
                                </Typography>
                              </div>
                            </div>
                            <Divider className={ classes.divider } />
                          </React.Fragment>
                        )
                      }
                      <div className={ classes.buttonRow }>
                        <div className={ classes.buttonRowButton }>
                          <Button
                            size="small"
                            variant="contained"
                            className={ classes.infoPanelButton }
                            onClick={ () => onOpenFolder(selectedItem.id) }
                          >
                            &nbsp;&nbsp;Open
                          </Button>
                        </div>
                        <div className={ classes.buttonRowText }>
                          <Typography className={ classes.infoPanelText } variant="caption" display="block" gutterBottom>
                            Click this to open this folder
                          </Typography>
                        </div>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className={ classes.buttonRow }>
                        <div className={ classes.buttonRowButton }>
                          <Button
                            size="small"
                            color="secondary"
                            variant="contained"
                            className={ classes.infoPanelButton }
                            onClick={ () => onAddContent({id:selectedItem.id}) }
                          >
                            {
                              selectedItem.isImage ?
                                <ImageIcon /> :
                                <DocumentIcon />
                            }
                            &nbsp;&nbsp;{ selectedItem.isImage ? 'Select Image' : 'Add Document' }
                          </Button>
                        </div>
                        <div className={ classes.buttonRowText }>
                          <Typography className={ classes.infoPanelText } variant="caption" display="block" gutterBottom>
                            { selectedItem.isImage ? 'Select this image' : 'Add this document' }
                          </Typography>
                        </div>
                      </div>
                    </React.Fragment>
                  )
                }
                <Divider className={ classes.divider } />

                <div className={ classes.buttonRow }>
                  <div className={ classes.buttonRowButton }>
                    <Button
                      size="small"
                      variant="contained"
                      className={ classes.infoPanelButton }
                      onClick={ () => setSelectedItem(null) }
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className={ classes.buttonRowText }>
                    <Typography className={ classes.infoPanelText } variant="caption" display="block" gutterBottom>
                      Choose another item.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
      
    )
  }  
}

export default FinderList



/*

  actions: (
          <div className={ classes.fileButtonsContainer }>
            <div className={ classes.actionButtonContainer }>
              {
                showAddButton && (
                  <FinderListAddButton
                    item={ item }
                    isFolder={ isFolder }
                    addGhostMode={ addGhostMode }
                    onAddContent={ onAddContent }
                  />
                )
              }
            </div>
          </div>
        )

*/

/*

  <a 
            className={ classes.filelink }
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if(isFolder) {
                onOpenFolder(item.id)
              }
              else {
                onAddContent({id:item.id, data:itemData})
              }
            }}
          >

*/