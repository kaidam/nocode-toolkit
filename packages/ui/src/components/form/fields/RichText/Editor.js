import React, { useState, useCallback, useRef } from 'react'

import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'

import { Editor } from 'slate-react'
import Html from 'slate-html-serializer'
import { isKeyHotkey } from 'is-hotkey'

import icons from '../../../../icons'

import rules from './rules'
import renderers from './renderers'

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

const useStyles = makeStyles(theme => createStyles({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  toolbar: {
    flexGrow: 0,
  },
  buttonGroup: {
    marginRight: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    border: '1px solid #ccc',
    overflowY: 'auto',
  },
}))

const html = new Html({ rules })
const DEFAULT_NODE = 'paragraph'

const RichTextEditor = ({
  value,
  onChange,
}) => {

  const classes = useStyles()
  const [ cachedValue, setCachedValue ] = useState(html.deserialize(value || '<p></p>'))

  const hasMark = useCallback(type => {
    return cachedValue.activeMarks.some(mark => mark.type === type)
  }, [cachedValue])

  const hasBlock = useCallback(type => {
    return cachedValue.blocks.some(node => node.type === type)
  }, [cachedValue])

  const editorRef = useRef()

  const onClickMark = useCallback((event, type) => {
    event.preventDefault()
    editorRef.current.toggleMark(type)
  }, [editorRef.current])

  const onClickBlock = useCallback((event, type) => {
    event.preventDefault()

    const editor = editorRef.current
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = hasBlock(type)
      const isList = hasBlock('list-item')

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
      }
    }
  }, [editorRef.current])

  const onKeyDown = useCallback((event, editor, next) => {
    let mark
  
    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return next()
    }
  
    event.preventDefault()
    editor.toggleMark(mark)
  }, [])

  const renderToolbarButton = useCallback((handler, icon, isActive) => {
    const Icon = icons[icon]
    if(!Icon) throw new Error(`no icon found for rich editor button: ${icon}`)
    return (
      <Button
        color={ isActive ? 'secondary' : '' }
        onMouseDown={ handler }
      >
        <Icon />
      </Button>
    )
  }, [])

  const renderMarkButton = useCallback((type, icon) => {
    const isActive = hasMark(type)
    const handler = event => onClickMark(event, type)
    return renderToolbarButton(handler, icon, isActive)
  }, [hasMark, onClickMark])

  const renderBlockButton = useCallback((type, icon) => {
    let isActive = hasBlock(type)
    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { document, blocks } = cachedValue

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key)
        isActive = hasBlock('list-item') && parent && parent.type === type
      }
    }
    const handler = event => onClickBlock(event, type)
    return renderToolbarButton(handler, icon, isActive)
  }, [hasBlock, cachedValue, onClickBlock])

  const onChangeHandler = useCallback(({ value }) => {
    setCachedValue(value)
    onChange(html.serialize(value))
  }, [onChange])

  return (
    <div className={ classes.container }>
      <div className={ classes.toolbar }>
        <ButtonGroup
          className={ classes.buttonGroup }
          variant="contained"
          size="small"
        >
          {renderMarkButton('bold', 'bold')}
          {renderMarkButton('italic', 'italic')}
          {renderMarkButton('underlined', 'underlined')}
        </ButtonGroup>
        <ButtonGroup
          className={ classes.buttonGroup }
          variant="contained"
          size="small"
        >
          {renderBlockButton('title', 'title')}
          {renderBlockButton('numbered-list', 'numberedlist')}
          {renderBlockButton('bulleted-list', 'bulletedlist')}
          {renderBlockButton('block-quote', 'quote')}
        </ButtonGroup>
      </div>
      <div className={ classes.content }>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some text..."
          ref={ editorRef }
          value={ cachedValue }
          onChange={ onChangeHandler }
          onKeyDown={ onKeyDown }
          renderBlock={ renderers.renderBlock }
          renderMark={ renderers.renderMark }
        />
      </div>
    </div>
  )
}

export default RichTextEditor
