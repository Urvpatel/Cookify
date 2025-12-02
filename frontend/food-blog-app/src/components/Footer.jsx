import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <p>
        <span className="nav-logo-text">Cookify</span> · Share, save, and cook better recipes.
      </p>
      <span className="footer-meta">© {year} All rights reserved.</span>
    </footer>
  )
}
