// ContentPage.jsx
import React from 'react'

export default function ContentPage ({
  title,
  content,
  footer,
  id,
  className = ''
}) {
  return (
    <main id={id} className={`content-page ${className}`}>
      <div className='content-top'>
        <div className='content-container'>
          <header className='content-header'>
            <h1 className='content-title'>{title}</h1>
          </header>

          <section className='content-body'>
            <div className='content-lead'>
              {content && content[0] && (
                <p className='lead-text'>{content[0]}</p>
              )}
            </div>

            <div className='content-paragraphs'>
              {content &&
                content.slice(1).map((p, i) => (
                  <p key={i} className='content-paragraph'>
                    {p}
                  </p>
                ))}
            </div>
          </section>
        </div>
        {/* {footer && (
          <footer className='content-footer'>
            <small>{footer}</small>
          </footer>
        )} */}
      </div>
    </main>
  )
}
