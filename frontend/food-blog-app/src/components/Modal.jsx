import React from 'react'

export default function Modal({ children, onClose }) {
  return (
    <>
      <div className="backdrop" onClick={onClose}></div>
      <div className="modal">
        {children}
      </div>
    </>
  )
}
