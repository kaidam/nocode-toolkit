const FIELDS = [{
  id: 'name',
  title: 'Full Name',
  description: 'Please enter your full name',
  validate: value => value ? null : `please enter your name`,
},{
  id: 'email',
  title: 'Email Address',
  description: 'Please enter your email address',
  validate: value => value ? null : `please enter your email address`,
},{
  id: 'message',
  title: 'Your Message',
  component: 'textarea',
  validate: value => value ? null : `please enter a message`,
}]

export default FIELDS