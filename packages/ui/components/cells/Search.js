import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import selectors from '../../store/selectors'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
}

const Search = ({
  content,
}) => {

  const [value, setValue] = useState('')

  return (
    <div style={ styles.root }>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="dense"
        value={ value }
        onChange={ (e) => setValue(e.target.value) }
      />
    </div>
  )
}

export default Search