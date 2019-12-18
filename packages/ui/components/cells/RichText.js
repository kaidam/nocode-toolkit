import React from 'react'

const Element = ({ children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote>{children}</blockquote>
    case 'bulleted-list':
      return <ul>{children}</ul>
    case 'heading-one':
      return <h1>{children}</h1>
    case 'heading-two':
      return <h2>{children}</h2>
    case 'list-item':
      return <li>{children}</li>
    case 'numbered-list':
      return <ol>{children}</ol>
    default:
      return <p>{children}</p>
  }
}

const Leaf = ({ children, leaf }) => {
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

  return <span>{children}</span>
}

const RichText = ({
  content: {
    data = [],
  },
}) => {
  return (
    <div>
      {
        data.map((block, i) => {
          return (
            <Element
              key={ i }
              element={ block }
            >
              {
                block.children.map((leaf, j) => {
                  return (
                    <Leaf
                      key={ j }
                      leaf={ leaf }
                    >
                      { leaf.text }
                    </Leaf>
                  )
                })
              }
            </Element>
          )
        })
      }
    </div>
  )
}

export default RichText