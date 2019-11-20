import React from 'react'
const BLOCK_TAGS = {
  blockquote: 'block-quote',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  li: 'list-item',
  h2: 'title',
  p: 'paragraph',
  code: 'code',
}

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underlined',
}

const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'block',
          type: type,
          data: {
            className: el.getAttribute('class'),
          },
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object == 'block') {
        switch (obj.type) {
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>
          case 'block-quote':
            return <blockquote>{children}</blockquote>
          case 'bulleted-list':
            return <ul>{children}</ul>
          case 'numbered-list':
            return <ol>{children}</ol>
          case 'list-item':
            return <li>{children}</li>
          case 'title':
            return <h2>{children}</h2>
          case 'code':
            return <pre><code>{children}</code></pre>
        }
      }
    },
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'mark',
          type: type,
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object == 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong>{children}</strong>
          case 'italic':
            return <em>{children}</em>
          case 'underlined':
            return <u>{children}</u>
        }
      }
    },
  },
]

export default rules
