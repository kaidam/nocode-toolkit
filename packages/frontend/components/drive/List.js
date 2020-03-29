import React from 'react'
import classnames from 'classnames'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import driveUtils from '../../utils/drive'
import icons from '../../icons'

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
  tableCell: {
    padding: '0px',
    paddingTop: '5px',
    paddingBottom: '5px',
  },
  actionsCell: {
    width: '200px',
    textAlign: 'right',
    paddingRight: theme.spacing(2),
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
  rowButton: {
    marginLeft: theme.spacing(1),
  },
}))

const FinderList = ({
  items,
  addFilter = '',
  onOpenFolder,
  onSelectItem,
}) => {
  const classes = useStyles()

  const actionsCellClassname = classnames(classes.tableCell, classes.actionsCell)

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
                items.map((item, i) => {

                  const icon = driveUtils.getItemIcon(item)
                  const thumbnail = driveUtils.getItemThumbnail(item)
                  const type = driveUtils.getBaseMimeType(item.mimeType)

                  const canAdd = !addFilter || addFilter.indexOf(type) >= 0
                  const canOpen = type == 'folder'

                  return (
                    <TableRow
                      key={ i }
                      hover
                      onClick={() => {
                        if(!canOpen) return
                        onOpenFolder(item.id)
                      }}
                    >
                      <TableCell className={ classes.tableCell }>
                        <div className={ classes.fileNameContainer }>
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
                          { item.name }
                        </div>
                      </TableCell>
                      <TableCell className={ actionsCellClassname }>
                        {
                          canOpen && (
                            <Button
                              size="small"
                              variant="contained"
                              className={ classes.rowButton }
                              onClick={ () => onOpenFolder(item.id) }
                            >
                              View
                            </Button>
                          )
                        }
                        {
                          canAdd && (
                            <Button
                              size="small"
                              variant="contained"
                              color="secondary"
                              className={ classes.rowButton }
                              onClick={ () => onSelectItem(item) }
                            >
                              Select
                            </Button>
                          )
                        }
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }  
}

export default FinderList