import BackNextButtons from './BackNextButtons'
import BreadCrumbs from './BreadCrumbs'
import ContactForm from './ContactForm'
import DocumentInfo from './DocumentInfo'
import DocumentTitle from './DocumentTitle'
import DocumentContent from './DocumentContent'
import Ecommerce from './Ecommerce'
import Heading from './Heading'
import HTML from './HTML'
import Image from './Image'
import RichText from './RichText'
import Search from './Search'
import Snippet from './Snippet'
import SocialLinks from './SocialLinks'
import Video from './Video'

const widgets = [
  BackNextButtons,
  BreadCrumbs,
  ContactForm,
  DocumentInfo,
  DocumentTitle,
  DocumentContent,
  Ecommerce,
  Heading,
  HTML,
  Image,
  RichText,
  Search,
  Snippet,
  SocialLinks,
  Video,
].reduce((all, widget) => {
  all[widget.id] = widget
  return all
}, {})

export default widgets