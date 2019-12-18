import React, { useCallback, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { Editor, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import ButtonGroup from '@material-ui/core/ButtonGroup'

import icons from '../../../../icons'

const TitleIcon = icons.title
const Plus1Icon = icons.plus1
const Plus2Icon = icons.plus2

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const useStyles = makeStyles(theme => {
  return {
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
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
    secondaryIcon: {
      width: '16px',
      height: '16px',
      color: theme.palette.text.hint,
    },
  }
})

const RichTextEditor = ({
  value,
  onChange,
}) => {

  const classes = useStyles()

  const [ editorValue, setEditorValue ] = useState(value || DEFAULT_VALUE)

  const onChangeHandler = useCallback((value) => {
    setEditorValue(value)
    onChange(value)
  }, [onChange])


  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(
    () => withRichText(withHistory(withReact(createEditor()))),
    []
  )

  return (
    <Slate editor={editor} value={editorValue} onChange={onChangeHandler}>
      <div className={ classes.container }>
        <div className={ classes.toolbar }>
          <ButtonGroup
            className={ classes.buttonGroup }
            variant="contained"
            size="small"
          >
            <MarkButton tooltip="Bold" format="bold" icon="bold" />
            <MarkButton tooltip="Italic" format="italic" icon="italic" />
            <MarkButton tooltip="Underline" format="underline" icon="underlined" />
          </ButtonGroup>
          <ButtonGroup
            className={ classes.buttonGroup }
            variant="contained"
            size="small"
          >
            <BlockButton tooltip="Small Heading" format="heading-two">
              <TitleIcon />
              <Plus1Icon className={ classes.secondaryIcon } />
            </BlockButton>
            <BlockButton tooltip="Large Heading" format="heading-one">
              <TitleIcon />
              <Plus2Icon className={ classes.secondaryIcon } />
            </BlockButton>
            <BlockButton tooltip="Quote" format="block-quote" icon="quote" />
            <BlockButton tooltip="Numbered List" format="numbered-list" icon="numberedlist" />
            <BlockButton tooltip="Unordered List" format="bulleted-list" icon="bulletedlist" />
          </ButtonGroup>
        </div>
        <div className={ classes.content }>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Enter some rich text…"
            spellCheck
            autoFocus
            onKeyDown={event => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault()
                  const mark = HOTKEYS[hotkey]
                  editor.exec({
                    type: 'toggle_mark',
                    format: mark,
                  })
                }
              }
            }}
          />
        </div>
      </div>
    </Slate>
  )
}

const withRichText = editor => {
  const { exec } = editor

  editor.exec = command => {
    switch (command.type) {
      case 'align_block': {
        const { align } = command
        Editor.setNodes(editor, {
          align,
        })
      }

      case 'toggle_block': {
        const { format } = command
        const isActive = isBlockActive(editor, format)
        const isList = LIST_TYPES.includes(format)

        Editor.unwrapNodes(editor, {
          match: n => LIST_TYPES.includes(n.type),
          split: true,
        })

        Editor.setNodes(editor, {
          type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        })

        if (!isActive && isList) {
          const block = { type: format, children: [] }
          Editor.wrapNodes(editor, block)
        }
      }

      case 'toggle_mark': {
        const { format } = command
        const isActive = isMarkActive(editor, format)

        if (isActive) {
          editor.exec({ type: 'remove_mark', key: format })
        } else {
          editor.exec({ type: 'add_mark', key: format, value: true })
        }
      }

      default: {
        exec(command)
      }
    }
  }

  return editor
}

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  })

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {

  const style = {
    textAlign: element.align || 'left',
  }

  switch (element.type) {
    case 'block-quote':
      return <blockquote style={ style } {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul style={ style } {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 style={ style } {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 style={ style } {...attributes}>{children}</h2>
    case 'list-item':
      return <li style={ style } {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol style={ style } {...attributes}>{children}</ol>
    default:
      return <p style={ style } {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const EditorButton = ({
  tooltip,
  handler,
  isActive,
  icon,
  children,
}) => {
  if(!children && icon) {
    const Icon = icons[icon]
    if(!Icon) throw new Error(`no icon found for rich editor button: ${icon}`)
    children = (
      <Icon />
    )
  }
  return (
    <Tooltip title={ tooltip }>
      <Button
        color={isActive ? 'secondary' : 'default'}
        onClick={event => {
          event.preventDefault()
          handler()
        }}
      >
        { children }
      </Button>
    </Tooltip>
  )
}

const BlockButton = ({
  format,
  ...props
}) => {
  const editor = useSlate()
  const isActive = isBlockActive(editor, format)
  const handler = () => editor.exec({ type: 'toggle_block', format })

  return (
    <EditorButton
      isActive={ isActive }
      handler={ handler }
      {...props}
    />
  )
}

const MarkButton = ({
  format,
  ...props
}) => {

  const editor = useSlate()
  const isActive = isMarkActive(editor, format)
  const handler = () => editor.exec({ type: 'toggle_mark', format })

  return (
    <EditorButton
      isActive={ isActive }
      handler={ handler }
      {...props}
    />
  )
}


const AlignButton = ({
  align,
  ...props
}) => {
  const editor = useSlate()
  const isActive = false//isBlockActive(editor, format)
  const handler = () => editor.exec({ type: 'align_block', align })

  return (
    <EditorButton
      isActive={ isActive }
      handler={ handler }
      {...props}
    />
  )
}

const DEFAULT_VALUE = [
  {
    type: 'paragraph',
    children: [
      { text: '' },
    ],
  },
]

// const DEFAULT_VALUE = [
//   {
//     type: 'paragraph',
//     children: [
//       { text: 'This is editable ' },
//       { text: 'rich', bold: true },
//       { text: ' text, ' },
//       { text: 'much', italic: true },
//       { text: ' better than a ' },
//       { text: '<textarea>', code: true },
//       { text: '!' },
//     ],
//   },
//   {
//     type: 'paragraph',
//     children: [
//       {
//         text:
//           "Since it's rich text, you can do things like turn a selection of text ",
//       },
//       { text: 'bold', bold: true },
//       {
//         text:
//           ', or add a semantically rendered block quote in the middle of the page, like this:',
//       },
//     ],
//   },
//   {
//     type: 'block-quote',
//     children: [{ text: 'A wise quote.' }],
//   },
//   {
//     type: 'paragraph',
//     children: [{ text: 'Try it out for yourself!' }],
//   },
// ]

export default RichTextEditor

/*

  <ButtonGroup
    className={ classes.buttonGroup }
    variant="contained"
    size="small"
  >
    <AlignButton tooltip="Align Left" align="left" icon="alignLeft" />
    <AlignButton tooltip="Align Center" align="center" icon="alignCenter" />
    <AlignButton tooltip="Align Right" align="right" icon="alignRight" />
  </ButtonGroup>

*/