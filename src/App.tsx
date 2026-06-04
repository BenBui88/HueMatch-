import { useState, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export type UserRole = 'client' | 'tech' | 'owner' | null
let globalRole: UserRole = null
let globalUserName = ''
let globalOutfitHex = '#7C5C8A'
let globalSkinHex = ''
let globalSkinName = ''
let globalUndertone = 'neutral'
let globalNailType: 'Gel' | 'Regular' | 'SNS' = 'Gel'

export const getRole = () => globalRole
export const setRole = (r: UserRole) => { globalRole = r }
export const getUserName = () => globalUserName
export const setUserName = (n: string) => { globalUserName = n }
export const getOutfitHex = () => globalOutfitHex
export const setOutfitHex = (h: string) => { globalOutfitHex = h }
export const getSkinHex = () => globalSkinHex
export const getSkinName = () => globalSkinName
export const getUndertone = () => globalUndertone
export const setSkin = (hex: string, name: string, ut: string) => { globalSkinHex = hex; globalSkinName = name; globalUndertone = ut }
export const getNailType = () => globalNailType
export const setNailType = (t: 'Gel' | 'Regular' | 'SNS') => { globalNailType = t }

function LandingPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<UserRole>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [showForm, setShowForm] = useState(false)

  const signIn = () => {
    setRole(selected ?? 'client')
    setUserName(name || email.split('@')[0] || 'User')
    setShowForm(false)
    navigate('/match')
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelected(role)
    setShowForm(true)
  }

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '1.5rem', position: 'relative' }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <img src="/logo.png" alt="HueMatch" style={{ width: 200, height: 200, objectFit: 'contain', margin: '0 auto 0.5rem', display: 'block' }} />
      </div>

      {/* Benefits */}
      <div style={{ background: '#f8f7f9', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', border: '0.5px solid #eee' }}>
        {[
          { icon: '💅', text: 'AI matches shades to your outfit + skin tone' },
          { icon: '⭐', text: 'Earn HuePoints on every booking' },
          { icon: '👥', text: 'Follow your favorite nail techs' },
          { icon: '🗺️', text: 'Discover salons by color near you' },
        ].map(b => (
          <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13, color: '#6b6b80' }}>
            <span>{b.icon}</span>{b.text}
          </div>
        ))}
      </div>

      {/* Role selector */}
      <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#a0a0b0', marginBottom: 12 }}>I am a...</p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {[
          { role: 'client' as UserRole, icon: '👤', title: 'Client', sub: 'Find colors, book techs, earn points' },
          { role: 'tech' as UserRole, icon: '⭐', title: 'Nail tech', sub: 'Manage your portable profile' },
          { role: 'owner' as UserRole, icon: '🏪', title: 'Salon owner', sub: 'Analytics and team management' },
        ].map(r => (
          <button key={String(r.role)} onClick={() => handleRoleSelect(r.role)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: selected === r.role ? '#FDF0F2' : 'white', borderRadius: 12, border: selected === r.role ? '1.5px solid #C4546A' : '0.5px solid #eee', cursor: 'pointer', textAlign: 'left' as const, width: '100%' }}>
            <span style={{ fontSize: 22 }}>{r.icon}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{r.title}</div>
              <div style={{ fontSize: 11, color: '#6b6b80', marginTop: 2 }}>{r.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Popup form — slides up above keyboard */}
      {showForm && (
        <>
          {/* Dark overlay behind popup */}
          <div
