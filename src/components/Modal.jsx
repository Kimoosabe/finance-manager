import React from 'react'

export default function Modal({ open, title, children, onClose }) {
  if(!open) return null
  return (
    <div style={{position:'fixed', inset:0, zIndex:60}} className="flex items-center justify-center">
      <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.5)'}} onClick={onClose}></div>
      <div className="glass p-6" onClick={(e)=>e.stopPropagation()} style={{width:'min(520px,94%)', zIndex:70}}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="btn-pill" onClick={onClose}>Cancelar</button>
        </div>
        {children}
      </div>
    </div>
  )
}
