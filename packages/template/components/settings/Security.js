import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'


import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'

import SimpleTable from '../table/SimpleTable'
import Actions from '../../utils/actions'

import systemSelectors from '../../store/selectors/system'
import contentActions from '../../store/modules/content'
import uiActions from '../../store/modules/ui'
import systemActions from '../../store/modules/system'

import icons from '../../icons'

const DeleteIcon = icons.delete

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    padding: theme.spacing(2),
    flexGrow: 1,
    overflowY: 'auto',
  },
  saveButton: {
    marginTop: theme.spacing(1),
  }
}))

const SettingsSecurity = ({
  
}) => {

  const classes = useStyles()

  const initiallyRendered = useRef(false)
  const [mode, setMode] = useState('off')
  const [users, setUsers] = useState([])
  const [rules, setRules] = useState([])

  const actions = Actions(useDispatch(), {
    waitForForm: contentActions.waitForForm,
    waitForConfirmation: uiActions.waitForConfirmation,
    saveSecuritySettings: systemActions.saveSecuritySettings,
  })

  const addUser = useCallback(async () => {
    const values = await actions.waitForForm({
      forms: ['security.user'],
      formWindowConfig: {
        title: 'Add User',
        size: 'md',
        fullHeight: false,
      }
    })
    if(!values) return
    setUsers(users.concat([values]))
  }, [
    users,
  ])

  const addRule = useCallback(async () => {
    const values = await actions.waitForForm({
      forms: ['security.rule'],
      formWindowConfig: {
        title: 'Add Rule',
        size: 'md',
        fullHeight: false,
      }
    })
    if(!values) return
    setRules(rules.concat([values]))
  }, [
    rules,
  ])

  const website = useSelector(systemSelectors.website)

  useEffect(() => {
    const {
      password_mode,
      password_users,
      password_rules,
    } = (website.meta || {})
    if(password_mode) setMode(password_mode)
    if(password_users) setUsers(password_users)
    if(password_rules) setRules(password_rules)
  }, [])

  useEffect(() => {
    actions.saveSecuritySettings({
      password_mode: mode,
      password_users: users,
      password_rules: rules,
    })
  }, [
    mode,
    users,
    rules,
  ])

  const onUpdateMode = useCallback((e, value) => setMode(value), [])

  const onDeleteUser = useCallback(async (username) => {
    const confirmed = await actions.waitForConfirmation({
      title: `Delete user ${username}...`,
      message: `Are you sure you want to delete the ${username} user?`,
    })
    if(!confirmed) return
    setUsers(users.filter(user => user.username != username))
  }, [
    users,
  ])

  const onDeleteRule = useCallback(async (rule) => {
    const confirmed = await actions.waitForConfirmation({
      title: `Delete rule ${rule}...`,
      message: `Are you sure you want to delete the ${rule} rule?`,
    })
    if(!confirmed) return
    setRules(rules.filter(r => r.rule != rule))
  }, [
    rules,
  ])

  const userData = useMemo(() => {
    return users.map((user, i) => {
      return {
        id: user.username,
        username: user.username,
      }
    })
  }, [
    users,
  ])

  const ruleData = useMemo(() => {
    return rules.map((rule, i) => {
      return {
        id: rule.rule,
        rule: rule.rule,
      }
    })
  }, [
    rules,
  ])

  const userFields = [{
    title: 'Username',
    name: 'username',
  }]

  const ruleFields = [{
    title: 'Rule',
    name: 'rule',
  }]

  return (
    <div className={ classes.container }>
      <div className={ classes.content }>
        <Grid container>
          <Grid item xs={ 12 } md={ 6 }>
            <Grid container>
              <Grid item xs={ 12 }>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Password Protection:</FormLabel>
                  <RadioGroup value={ mode } onChange={ onUpdateMode }>
                    <FormControlLabel value="off" control={<Radio />} label="Off" />
                    <FormControlLabel value="password" control={<Radio />} label="Usernames & Passwords" />
                    <FormControlLabel value="google" control={<Radio />} label="Google Authentication" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
            </Grid>
          </Grid>
          <Grid item xs={ 12 } md={ 6 }>
            {
              mode == "password" && (
                <Grid container>
                  <Grid item xs={ 12 }>
                    <Typography>
                      Add usernames and passwords for users that can login and see the website.
                    </Typography>                    
                  </Grid>
                  <Grid item xs={ 12 }>
                    <Button
                      className={ classes.saveButton }
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={ addUser }
                    >
                      Add user
                    </Button>
                  </Grid>
                  <Grid item xs={ 12 }>
                    <SimpleTable
                      hideHeader
                      data={ userData }
                      fields={ userFields }
                      getActions={ (item) => (
                        <IconButton
                          onClick={ () => onDeleteUser(item.username) }
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    />
                  </Grid>
                  
                </Grid>
              )
            }
            {
              mode == "google" && (
                <Grid container>
                  <Grid item xs={ 12 }>
                    <Typography>
                      Require that a user has logged in with a Google account.
                      If you add a rule for "mydomain.com" - then any google user
                      with an email address @mydomain.com can see the website.
                    </Typography>
                  </Grid>
                  <Grid item xs={ 12 }>
                    <Button
                      className={ classes.saveButton }
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={ addRule }
                    >
                      Add rule
                    </Button>
                  </Grid>
                  <Grid item xs={ 12 }>
                    <SimpleTable
                      hideHeader
                      data={ ruleData }
                      fields={ ruleFields }
                      getActions={ (item) => (
                        <IconButton
                          onClick={ () => onDeleteRule(item.rule) }
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    />
                  </Grid>
                </Grid>
              )
            }
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default SettingsSecurity
