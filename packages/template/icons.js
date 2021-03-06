/*

  to add icons to here - first visit:
  
  https://material.io/resources/icons/?style=baseline

  the icon name is converted to camelCase

  e.g. power_settings_new -> PowerSettingsNew
  
*/

import React from 'react'

import WebsiteIcon from '@material-ui/icons/Language'
import HomeIcon from '@material-ui/icons/Home'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import ClearIcon from '@material-ui/icons/Clear'
import SettingsIcon from '@material-ui/icons/Settings'
import PublishIcon from '@material-ui/icons/Publish'
import HistoryIcon from '@material-ui/icons/History'
import RefreshIcon from '@material-ui/icons/Refresh'
import ContentIcon from '@material-ui/icons/Inbox'
import OpenIcon from '@material-ui/icons/OpenInBrowser'
import SortIcon from '@material-ui/icons/Sort'
import LoginIcon from '@material-ui/icons/ExitToApp'
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'
import FolderIcon from '@material-ui/icons/Folder'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import DocumentIcon from '@material-ui/icons/InsertDriveFile'
import LinkIcon from '@material-ui/icons/Link'
import VideoIcon from '@material-ui/icons/VideoLibrary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ArrowForward from '@material-ui/icons/ArrowForward'
import HideIcon from '@material-ui/icons/VisibilityOff'
import LookIcon from '@material-ui/icons/Visibility'
import UploadIcon from '@material-ui/icons/VerticalAlignTop'
import UpIcon from '@material-ui/icons/ExpandLess'
import DownIcon from '@material-ui/icons/ExpandMore'
import LeftIcon from '@material-ui/icons/ChevronLeft'
import RightIcon from '@material-ui/icons/ChevronRight'
import RowIcon from '@material-ui/icons/ViewStream'
import CellIcon  from '@material-ui/icons/ViewColumn'
import TitleIcon from '@material-ui/icons/Title'
import TextIcon from '@material-ui/icons/Subject'
import ImageIcon from '@material-ui/icons/InsertPhoto'
import WarningIcon from '@material-ui/icons/Warning'
import ErrorIcon from '@material-ui/icons/Error'
import SuccessIcon from '@material-ui/icons/CheckCircle'
import WaitingIcon from '@material-ui/icons/HourglassEmpty'
import BoldIcon from '@material-ui/icons/FormatBold'
import ItalicIcon from '@material-ui/icons/FormatItalic'
import UnderlineIcon from '@material-ui/icons/FormatUnderlined'
import BulletedListIcon from '@material-ui/icons/FormatListBulleted'
import NumberedListIcon from '@material-ui/icons/FormatListNumbered'
import QuoteIcon from '@material-ui/icons/FormatQuote'
import LogsIcon from '@material-ui/icons/Reorder'
import UndoIcon from '@material-ui/icons/Undo'
import MoveIcon from '@material-ui/icons/OpenWith'
import MoveVertIcon from '@material-ui/icons/SwapVert'
import PaymentIcon from '@material-ui/icons/AttachMoney'
import ContactIcon from '@material-ui/icons/ContactMail'
import AddPanelTop from '@material-ui/icons/VerticalAlignTop'
import AddPanelBottom from '@material-ui/icons/VerticalAlignBottom'
import Plus1Icon from '@material-ui/icons/ExposurePlus1'
import Plus2Icon from '@material-ui/icons/ExposurePlus2'
import AlignLeftIcon from '@material-ui/icons/FormatAlignLeft'
import AlignCenterIcon from '@material-ui/icons/FormatAlignCenter'
import AlignRightIcon from '@material-ui/icons/FormatAlignRight'
import PeopleIcon from '@material-ui/icons/People'
import CodeIcon from '@material-ui/icons/Code'
import PluginIcon from '@material-ui/icons/Extension'
import DomainIcon from '@material-ui/icons/Language'
import CloseIcon from '@material-ui/icons/Close'
import HelpIcon from '@material-ui/icons/LiveHelp'
import SaveIcon from '@material-ui/icons/Save'
import Dashboard from '@material-ui/icons/Dashboard'
import InfoIcon from '@material-ui/icons/Info'
//import BackNextIcon from '@material-ui/icons/SyncAlt'
import SearchIcon from '@material-ui/icons/Search'
import BuildIcon from '@material-ui/icons/Build'
import ClipboardIcon from '@material-ui/icons/FileCopy'
import AccountCircle from '@material-ui/icons/AccountCircle'
import SyncIcon from '@material-ui/icons/Sync'
import SendIcon from '@material-ui/icons/Send'
import MenuIcon from '@material-ui/icons/Menu'
import LockIcon from '@material-ui/icons/Lock'
import WidgetIcon from '@material-ui/icons/Widgets'
import GuideIcon from '@material-ui/icons/Subject'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore'
import TemplateIcon from '@material-ui/icons/ViewQuilt'
import PaymentsIcon from '@material-ui/icons/CreditCard'
import VisibleIcon from '@material-ui/icons/Visibility'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import PdfIcon from '@material-ui/icons/PictureAsPdf'
import AnalyticsIcon from '@material-ui/icons/Equalizer'
import Attachment from '@material-ui/icons/Attachment'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import HTMLIcon from '@material-ui/icons/MenuOpen'
import UnsplashLogo from './components/icons/UnsplashLogo'
import GoogleDriveLogo from './components/icons/GoogleDriveLogo'
import GoogleDocsLogo from './components/icons/GoogleDocsLogo'
import NocodeLogo from './components/icons/NocodeLogo'
import FacebookIcon from '@material-ui/icons/Facebook'
import TwitterIcon from '@material-ui/icons/Twitter'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import YouTubeIcon from '@material-ui/icons/YouTube'
import InstagramIcon from '@material-ui/icons/Instagram'
import PinterestIcon from '@material-ui/icons/Pinterest'
import BackNextIcon from '@material-ui/icons/CompareArrows'
import DocumentContentIcon from '@material-ui/icons/Description'
import DocumentHeaderIcon from '@material-ui/icons/HorizontalSplit'
import LinearScaleIcon from '@material-ui/icons/LinearScale'
import PowerInputIcon from '@material-ui/icons/PowerInput'

const icons = {
  add: AddIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  close: CloseIcon,
  clear: ClearIcon,
  website: WebsiteIcon,
  settings: SettingsIcon,
  publish: PublishIcon,
  history: HistoryIcon,
  refresh: RefreshIcon,
  content: ContentIcon,
  open: OpenIcon,
  login: LoginIcon,
  logout: LogoutIcon,
  folder: FolderIcon,
  folderopen: FolderOpenIcon,
  drag: UnfoldMoreIcon,
  document: DocumentIcon,
  snippet: Attachment,
  item: DocumentIcon,
  drive: GoogleDriveLogo,
  docs: GoogleDocsLogo,
  unsplash: UnsplashLogo,
  nocode: NocodeLogo,
  link: LinkIcon,
  video: VideoIcon,
  expandMore: ExpandMoreIcon,
  expandLess: ExpandLessIcon,
  moreVert: MoreVertIcon,
  forward: ArrowForward,
  hide: HideIcon,
  upload: UploadIcon,
  up: UpIcon,
  down: DownIcon,
  left: LeftIcon,
  right: RightIcon,
  row: RowIcon,
  cell: CellIcon,
  title: TitleIcon,
  text: TextIcon,
  image: ImageIcon,
  bold: BoldIcon,
  italic: ItalicIcon,
  underlined: UnderlineIcon, 
  bulletedlist: BulletedListIcon,
  numberedlist: NumberedListIcon,
  quote: QuoteIcon,
  error: ErrorIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  waiting: WaitingIcon,
  logs: LogsIcon,
  undo: UndoIcon,
  look: LookIcon,
  move: MoveIcon,
  movevert: MoveVertIcon,
  html: HTMLIcon,
  payment: PaymentIcon,
  contact: ContactIcon,
  addPanelTop: AddPanelTop,
  addPanelBottom: AddPanelBottom,
  plus1: Plus1Icon,
  plus2: Plus2Icon,
  alignLeft: AlignLeftIcon,
  alignCenter: AlignCenterIcon,
  alignRight: AlignRightIcon,
  people: PeopleIcon,
  code: CodeIcon,
  domain: DomainIcon,
  help: HelpIcon,
  save: SaveIcon,
  template: TemplateIcon,
  widget: WidgetIcon,
  visible: VisibleIcon,
  layout: Dashboard,
  builder: Dashboard,
  info: InfoIcon,
  backnext: BackNextIcon,
  search: SearchIcon,
  build: BuildIcon,
  clipboard: ClipboardIcon,
  account: AccountCircle,
  payments: PaymentsIcon,
  tendingUp: TrendingUpIcon,
  shopping: ShoppingCartIcon,
  pdf: PdfIcon,
  analytics: AnalyticsIcon,
  sync: SyncIcon,
  send: SendIcon,
  menu: MenuIcon,
  lock: LockIcon,
  sort: SortIcon,
  home: HomeIcon,
  guide: GuideIcon,
  previous: KeyboardArrowLeft,
  next: KeyboardArrowRight,
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  pinterest: PinterestIcon,
  documentContent: DocumentContentIcon,
  documentHeader: DocumentHeaderIcon,
  breadcrumbs: LinearScaleIcon,
  documentTitle: PowerInputIcon,
  documentInfo: InfoIcon,
}

export default icons