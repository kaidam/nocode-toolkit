import React, { useCallback, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'

import FormDialog from '../form/Dialog'

import websiteSelectors from '../../store/selectors/website'
import websiteActions from '../../store/modules/website'

import DeleteConfirm from '../dialog/DeleteConfirm'
import SimpleTable from '../table/SimpleTable'

import icons from '../../icons'

const DeleteIcon = icons.delete

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(4),
  },
  saveButton: {
    marginTop: theme.spacing(1),
  }
}))

const USER_INITIAL_VALUES = {
  username: '',
  password: '',
}

const USER_SCHEMA = [{
  id: 'username',
  title: 'Username',
  helperText: 'Enter the username for this user',
  validate: {
    type: 'string',
    methods: [
      ['required', 'The name is required'],
    ],
  }
}, {
  id: 'password',
  title: 'Password',
  helperText: 'Enter the password for this user',
  inputProps: {
    type: 'password',
  },
  validate: {
    type: 'string',
    methods: [
      ['required', 'The password is required'],
    ],
  }
}]

const RULE_INITIAL_VALUES = {
  rule: '',
}

const RULE_SCHEMA = [{
  id: 'rule',
  title: 'Match email',
  helperText: 'Enter a portion or an entire email address to grant access',
  validate: {
    type: 'string',
    methods: [
      ['required', 'The rule is required'],
    ],
  }
}]

const SettingsSecurity = ({
  
}) => {

  const classes = useStyles()
  const dispatch = useDispatch()

  const website = useSelector(websiteSelectors.websiteData)
  const [ addingUser, setAddingUser ] = useState(false)
  const [ addingRule, setAddingRule ] = useState(false)
  const [ deletingUser, setDeletingUser ] = useState(null)
  const [ deletingRule, setDeletingRule ] = useState(null)

  const {
    password_mode = 'off',
    password_users = [],
    password_rules = [],
  } = (website.meta || {})

  const onUpdateSecurity = useCallback(meta => {
    return dispatch(websiteActions.updateSecurity(website.id, meta))    
  }, [
    website,
  ])

  const onSetMode = useCallback((mode) => {
    onUpdateSecurity({
      password_mode: mode,
    })
  }, [onUpdateSecurity])
  
  const onAddUser = useCallback(async (user) => {
    const result = await onUpdateSecurity({
      password_users: password_users.concat([user])
    })
    if(result) setAddingUser(false)
  }, [
    password_users,
    onUpdateSecurity,
  ])

  const onAddRule = useCallback(async (rule) => {
    const result = await onUpdateSecurity({
      password_rules: password_rules.concat([rule])
    })
    if(result) setAddingRule(false)
  }, [
    password_rules,
    onUpdateSecurity,
  ])

  const onDeleteUser = useCallback(async (username) => {    
    const result = await onUpdateSecurity({
      password_users: password_users.filter(u => u.username != username),
    })
    if(result) setDeletingUser(null)
  }, [
    password_users,
    onUpdateSecurity,
  ])

  const onDeleteRule = useCallback(async (rule) => {
    const result = await onUpdateSecurity({
      password_rules: password_rules.filter(r => r.rule != rule),
    })
    if(result) setDeletingRule(null)
  }, [
    password_rules,
    onUpdateSecurity,
  ])

  const userData = useMemo(() => {
    return password_users.map((user, i) => {
      return {
        id: user.username,
        username: user.username,
      }
    })
  }, [
    password_users,
  ])

  const ruleData = useMemo(() => {
    return password_rules.map((rule, i) => {
      return {
        id: rule.rule,
        rule: rule.rule,
      }
    })
  }, [
    password_rules,
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
    <>
      <Grid container spacing={ 4 }>
        <Grid item xs={ 12 } sm={ 12 } md={ 6 }>
          <Paper className={ classes.paper }>
            <Grid container spacing={ 0 }>
              <Grid item xs={ 12 }>
                <Typography variant="h6" gutterBottom>Subdomain</Typography>
              </Grid>
              <Grid item xs={ 12 }>
                <FormControl component="fieldset">
                  <RadioGroup value={ password_mode } onChange={ (e, value) => onSetMode(value) }>
                    <FormControlLabel value="off" control={<Radio />} label="Off" />
                    <FormControlLabel value="password" control={<Radio />} label="Usernames & Passwords" />
                    <FormControlLabel value="google" control={<Radio />} label="Google Authentication" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={ 12 } sm={ 12 } md={ 6 }>
          {
            password_mode == "password" && (
              <Paper className={ classes.paper }>
                <Grid container spacing={ 0 }>
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
                      onClick={ () => setAddingUser(true) }
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
                          onClick={ () => setDeletingUser(item.username) }
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    />
                  </Grid>
                  
                </Grid>
              </Paper>
            )
          }
          {
            password_mode == "google" && (
              <Paper className={ classes.paper }>
                <Grid container spacing={ 0 }>
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
                      onClick={ () => setAddingRule(true) }
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
                          onClick={ () => setDeletingRule(item.rule) }
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )
          }
        </Grid>
      </Grid>
      {
        addingUser && (
          <FormDialog
            title="Add User"
            size="sm"
            schema={ USER_SCHEMA }
            initialValues={ USER_INITIAL_VALUES }
            withCancel
            onSubmit={ onAddUser }
            onCancel={ () => setAddingUser(false) }
          />
        )
      }
      {
        addingRule && (
          <FormDialog
            title="Add Rule"
            size="sm"
            schema={ RULE_SCHEMA }
            initialValues={ RULE_INITIAL_VALUES }
            withCancel
            onSubmit={ onAddRule }
            onCancel={ () => setAddingRule(false) }
          />
        )
      }
      {
        deletingUser && (
          <DeleteConfirm
            title="Remove User?"
            onConfirm={ () => {
              onDeleteUser(deletingUser)
              setDeletingUser(null)
            }}
            onCancel={ () => setDeletingUser(null) }
          >
            <Typography>
              Are you <strong>absolutely sure</strong> you want to delete the { deletingUser } user?
            </Typography>
          </DeleteConfirm>
        )
      }
      {
        deletingRule && (
          <DeleteConfirm
            title="Remove Rule?"
            onConfirm={ () => {
              onDeleteRule(deletingRule)
              setDeletingRule(null)
            }}
            onCancel={ () => setDeletingRule(null) }
          >
            <Typography>
              Are you <strong>absolutely sure</strong> you want to delete the { deletingRule } rule?
            </Typography>
          </DeleteConfirm>
        )
      }
    </>
  )
}

export default SettingsSecurity
