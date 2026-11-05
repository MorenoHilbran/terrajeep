'use client'

import { useState, useEffect, useRef } from 'react'
import type { GalleryItem, PackageItem, SiteSettings } from '@/lib/data'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'packages' | 'settings'>('gallery')
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('Admin')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Data states
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [settings, setSettings] = useState<SiteSettings>({
    googleReviewUrl: 'https://share.google/csqO5RheRkpH7AVh4',
    adminUsername: 'admin',
    adminPassword: '',
    siteTitle: 'Terra Adventure Bali',
    whatsappNumber: '6281216074831',
  })

  // Gallery form states
  const [galleryUploadLoading, setGalleryUploadLoading] = useState(false)
  const [galleryUrlInput, setGalleryUrlInput] = useState('')
  const [galleryTitleInput, setGalleryTitleInput] = useState('')
  const [showAddUrlModal, setShowAddUrlModal] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Package modal states
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null)
  const [isNewPackage, setIsNewPackage] = useState(false)
  const [packageModalOpen, setPackageModalOpen] = useState(false)
  const [packageUploadLoading, setPackageUploadLoading] = useState(false)
  const packageFileInputRef = useRef<HTMLInputElement>(null)

  // Settings states
  const [newPasswordInput, setNewPasswordInput] = useState('')
  const [settingsSaving, setSettingsSaving] = useState(false)

  // Theme state: 'dark' (default) or 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('terra_admin_theme')
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme)
      }
    } catch {}
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem('terra_admin_theme', next)
    } catch {}
    showToast(next === 'light' ? 'Mode Terang (Light Mode) aktif' : 'Mode Gelap (Dark Mode) aktif')
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Check auth and load initial data
  useEffect(() => {
    async function init() {
      try {
        const authRes = await fetch('/api/auth/me')
        const authData = await authRes.json()

        if (!authData.authenticated) {
          window.location.href = '/login'
          return
        }

        if (authData.username) {
          setUsername(authData.username)
        }

        const [galRes, pkgRes, setRes] = await Promise.all([
          fetch('/api/gallery'),
          fetch('/api/packages'),
          fetch('/api/settings'),
        ])

        const galData = await galRes.json()
        const pkgData = await pkgRes.json()
        const setData = await setRes.json()

        if (galData.success) setGallery(galData.data)
        if (pkgData.success) setPackages(pkgData.data)
        if (setData.success) setSettings(setData.data)
      } catch (err) {
        console.error('Init error:', err)
        showToast('Gagal memuat data admin', 'error')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch {
      window.location.href = '/login'
    }
  }

  // Maximum photo upload size: 5MB
  const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024

  // --- GALLERY HANDLERS ---
  const handleUploadGalleryFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    // 1. Client-side File Size Validation (Max 5MB)
    const fileArray = Array.from(files)
    const oversizedFiles = fileArray.filter(f => f.size > MAX_PHOTO_SIZE_BYTES)
    if (oversizedFiles.length > 0) {
      const first = oversizedFiles[0]
      const sizeMb = (first.size / (1024 * 1024)).toFixed(1)
      showToast(`Foto "${first.name}" (${sizeMb} MB) melebihi batas maks 5 MB. Harap pilih foto di bawah 5 MB.`, 'error')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setGalleryUploadLoading(true)

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const uploadData = await uploadRes.json()

      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.message || 'Gagal upload file')
      }

      const newItems: GalleryItem[] = uploadData.urls.map((url: string, index: number) => ({
        id: `gal-${Date.now()}-${index}`,
        src: url,
        title: `Terra Adventure ${gallery.length + index + 1}`,
      }))

      const updatedGallery = [...newItems, ...gallery]

      const saveRes = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedGallery }),
      })

      if (saveRes.ok) {
        setGallery(updatedGallery)
        const savedText = uploadData.savedPercent && uploadData.savedPercent > 0
          ? ` (Auto-WebP hemat ${uploadData.savedPercent}%)`
          : ' (Format WebP)'
        showToast(`Berhasil menambahkan ${newItems.length} foto!${savedText}`)
      } else {
        showToast('Gagal menyimpan pembaruan galeri', 'error')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload gagal'
      showToast(message, 'error')
    } finally {
      setGalleryUploadLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleAddGalleryByUrl = async () => {
    if (!galleryUrlInput.trim()) {
      showToast('Masukkan URL gambar terlebih dahulu', 'error')
      return
    }

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          src: galleryUrlInput.trim(),
          title: galleryTitleInput.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setGallery(data.data)
        setGalleryUrlInput('')
        setGalleryTitleInput('')
        setShowAddUrlModal(false)
        showToast('Foto baru berhasil ditambahkan!')
      } else {
        showToast(data.message || 'Gagal menambahkan foto', 'error')
      }
    } catch {
      showToast('Terjadi kesalahan saat menambahkan foto', 'error')
    }
  }

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('Yakin ingin menghapus foto ini dari galeri?')) return

    try {
      const res = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setGallery(data.data)
        showToast('Foto berhasil dihapus dari galeri')
      } else {
        showToast('Gagal menghapus foto', 'error')
      }
    } catch {
      showToast('Terjadi kendala saat menghapus foto', 'error')
    }
  }

  const moveGalleryItem = async (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= gallery.length) return

    const updated = [...gallery]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp

    setGallery(updated)

    try {
      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updated }),
      })
    } catch {
      showToast('Gagal menyimpan urutan galeri', 'error')
    }
  }

  // --- PACKAGE HANDLERS ---
  const handleOpenNewPackage = () => {
    setIsNewPackage(true)
    setEditingPackage({
      id: '',
      num: String(packages.length + 1).padStart(2, '0'),
      name: '',
      prices: {
        IDR: { value: 'IDR 500K', unit: '/ jeep' },
        USD: { value: '$35', unit: '/ jeep' },
      },
      images: [],
      highlights: [
        { left: 'Highlight 1', right: 'Highlight 2' },
        { left: 'Highlight 3', right: 'Highlight 4' },
      ],
      whatsappText: '',
    })
    setPackageModalOpen(true)
  }

  const handleOpenEditPackage = (pkg: PackageItem) => {
    setIsNewPackage(false)
    setEditingPackage(JSON.parse(JSON.stringify(pkg)))
    setPackageModalOpen(true)
  }

  const handleUploadPackageImages = async (files: FileList | null) => {
    if (!files || !editingPackage) return

    // 1. Client-side File Size Validation (Max 5MB)
    const fileArray = Array.from(files)
    const oversizedFiles = fileArray.filter(f => f.size > MAX_PHOTO_SIZE_BYTES)
    if (oversizedFiles.length > 0) {
      const first = oversizedFiles[0]
      const sizeMb = (first.size / (1024 * 1024)).toFixed(1)
      showToast(`Foto "${first.name}" (${sizeMb} MB) melebihi batas maks 5 MB.`, 'error')
      if (packageFileInputRef.current) packageFileInputRef.current.value = ''
      return
    }

    setPackageUploadLoading(true)

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setEditingPackage({
          ...editingPackage,
          images: [...editingPackage.images, ...data.urls],
        })
        const savedText = data.savedPercent && data.savedPercent > 0
          ? ` (Auto-WebP hemat ${data.savedPercent}%)`
          : ' (Format WebP)'
        showToast(`${data.urls.length} foto berhasil dikompres & ditambahkan!${savedText}`)
      } else {
        showToast(data.message || 'Gagal upload foto paket', 'error')
      }
    } catch {
      showToast('Gagal mengunggah foto paket', 'error')
    } finally {
      setPackageUploadLoading(false)
      if (packageFileInputRef.current) packageFileInputRef.current.value = ''
    }
  }

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPackage) return

    if (!editingPackage.name.trim()) {
      showToast('Nama paket wajib diisi', 'error')
      return
    }

    if (editingPackage.images.length === 0) {
      showToast('Harap tambahkan minimal 1 foto untuk paket', 'error')
      return
    }

    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPackage),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setPackages(data.data)
        setPackageModalOpen(false)
        setEditingPackage(null)
        showToast(isNewPackage ? 'Paket baru berhasil ditambahkan!' : 'Paket berhasil diperbarui!')
      } else {
        showToast(data.message || 'Gagal menyimpan paket', 'error')
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan paket', 'error')
    }
  }

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Yakin ingin menghapus paket petualangan ini?')) return

    try {
      const res = await fetch(`/api/packages?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setPackages(data.data)
        showToast('Paket berhasil dihapus')
      } else {
        showToast('Gagal menghapus paket', 'error')
      }
    } catch {
      showToast('Terjadi kesalahan saat menghapus paket', 'error')
    }
  }

  const movePackage = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= packages.length) return

    const updated = [...packages]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp

    updated.forEach((pkg, idx) => {
      pkg.num = String(idx + 1).padStart(2, '0')
    })

    setPackages(updated)

    try {
      await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packages: updated }),
      })
    } catch {
      showToast('Gagal menyimpan urutan paket', 'error')
    }
  }

  // --- SETTINGS HANDLERS ---
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSettingsSaving(true)

    try {
      const payload: Record<string, string> = {
        googleReviewUrl: settings.googleReviewUrl,
        whatsappNumber: settings.whatsappNumber,
        siteTitle: settings.siteTitle,
      }

      if (newPasswordInput.trim()) {
        payload.newPassword = newPasswordInput.trim()
      }

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSettings(data.data)
        setNewPasswordInput('')
        showToast('Pengaturan dan Link Review Google berhasil disimpan!')
      } else {
        showToast(data.message || 'Gagal menyimpan pengaturan', 'error')
      }
    } catch {
      showToast('Terjadi kendala saat menyimpan pengaturan', 'error')
    } finally {
      setSettingsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-100 rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-medium tracking-wider uppercase">Memuat Workspace...</p>
        </div>
      </div>
    )
  }

  const getMenuInfo = () => {
    switch (activeTab) {
      case 'gallery':
        return {
          title: 'Galeri Foto',
          desc: 'Kelola foto dokumentasi petualangan yang ditampilkan pada website publik.',
          badge: `${gallery.length} Foto Aktif`,
        }
      case 'packages':
        return {
          title: 'Paket Tur',
          desc: 'Kelola paket tour Jeep & Trekking, struktur harga IDR / USD, dan fitur.',
          badge: `${packages.length} Paket Aktif`,
        }
      case 'settings':
        return {
          title: 'Review & Pengaturan',
          desc: 'Konfigurasi link ulasan Google Maps, nomor WhatsApp booking, dan keamanan.',
          badge: 'Sistem',
        }
    }
  }

  const menuInfo = getMenuInfo()

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'admin-theme-light' : 'admin-theme-dark'} bg-zinc-950 text-zinc-100 flex font-sans antialiased selection:bg-zinc-800 selection:text-white transition-colors duration-150`}>
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-xs font-semibold transition-all ${
            toast.type === 'success' 
              ? 'bg-zinc-900 border-zinc-700 text-zinc-100 shadow-zinc-950/80' 
              : 'bg-red-950/90 border-red-800 text-red-200'
          }`}
        >
          {toast.type === 'success' ? (
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-red-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* ===================== SHADCN SIDEBAR ===================== */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800/80 z-50 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header (Matched height with Top Navbar h-20 for seamless alignment) */}
          <div className="h-20 px-6 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-sm shadow-sm">
                T
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-zinc-100">Terra Admin</span>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border border-zinc-700 bg-zinc-800/60 text-zinc-400">
                    CMS
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 tracking-wide">Jeep &amp; Trekking Bali</p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Nav List */}
          <div className="flex-1 px-3.5 py-5 space-y-6 overflow-y-auto">
            <div className="space-y-1">
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                Menu Utama
              </p>

              {/* Gallery */}
              <button
                onClick={() => {
                  setActiveTab('gallery')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Galeri Foto</span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700/60 text-zinc-300">
                  {gallery.length}
                </span>
              </button>

              {/* Packages */}
              <button
                onClick={() => {
                  setActiveTab('packages')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'packages'
                    ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <span>Paket Tur</span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700/60 text-zinc-300">
                  {packages.length}
                </span>
              </button>

              {/* Settings */}
              <button
                onClick={() => {
                  setActiveTab('settings')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Review &amp; Pengaturan</span>
                </div>
              </button>
            </div>

            <div className="space-y-1">
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                Tautan Cepat
              </p>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span>Preview Website</span>
                </div>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>

          {/* User Footer & Theme Toggle */}
          <div className="p-4 border-t border-zinc-800/80 bg-zinc-950 space-y-2.5">
            {/* Theme Toggle Pill */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-800/80 transition-colors cursor-pointer group"
              title="Ganti Mode Tampilan (Dark / Light)"
            >
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
                <span className="text-zinc-300 group-hover:text-zinc-100">Tema Admin</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-zinc-700/60 bg-zinc-800 text-zinc-300">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>

            {/* User Profile Bar */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-200 truncate">{username}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-zinc-400">Online</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Keluar dari Admin"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ===================== MAIN WORKSPACE ===================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* ===================== SPACIOUS, CONSISTENT TOP NAVBAR ===================== */}
        <header className="flex-shrink-0 border-b border-zinc-800/80 sticky top-0 bg-zinc-950/95 backdrop-blur-md z-30 px-4 sm:px-8 py-3 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
          {/* Top/Left Row: Hamburger, Title, Badge & Subtitle */}
          <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0 w-full sm:w-auto">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Buka navigasi sidebar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-xl font-bold tracking-tight text-zinc-100 truncate">
                    {menuInfo.title}
                  </h1>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border border-zinc-700 bg-zinc-800/80 text-zinc-300 flex-shrink-0">
                    {menuInfo.badge}
                  </span>
                </div>
                <p className="hidden sm:block text-xs text-zinc-400 mt-0.5 max-w-[220px] md:max-w-md lg:max-w-xl truncate">
                  {menuInfo.desc}
                </p>
              </div>
            </div>

            {/* Mobile Theme Toggle Button */}
            <div className="sm:hidden flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                className="h-9 w-9 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                aria-label="Toggle dark/light theme"
              >
                {theme === 'dark' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Bottom/Right: Action Buttons & Desktop Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Desktop Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden sm:flex h-10 w-10 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white items-center justify-center transition-colors shadow-sm cursor-pointer flex-shrink-0"
              title={theme === 'dark' ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
              aria-label="Toggle dark/light theme"
            >
              {theme === 'dark' ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            {/* Gallery Actions */}
            {activeTab === 'gallery' && (
              <>
                <button
                  onClick={() => setShowAddUrlModal(true)}
                  className="flex-1 sm:flex-none h-9 sm:h-10 px-3 sm:px-4 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm whitespace-nowrap"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                    <line x1="10" y1="13" x2="8" y2="13" />
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span className="hidden sm:inline">Input Link URL</span>
                  <span className="sm:hidden">Input URL</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={galleryUploadLoading}
                  className="flex-1 sm:flex-none h-9 sm:h-10 px-3.5 sm:px-5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {galleryUploadLoading ? (
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  )}
                  <span>{galleryUploadLoading ? 'Mengompres...' : 'Upload Foto'}</span>
                </button>
              </>
            )}

            {/* Packages Actions */}
            {activeTab === 'packages' && (
              <button
                onClick={handleOpenNewPackage}
                className="w-full sm:w-auto h-9 sm:h-10 px-4 sm:px-5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Tambah Paket Baru</span>
              </button>
            )}

            {/* Settings Actions */}
            {activeTab === 'settings' && (
              <>
                <a
                  href={settings.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none h-9 sm:h-10 px-3 sm:px-4 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm whitespace-nowrap"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span className="hidden sm:inline">Uji Link Google Review</span>
                  <span className="sm:hidden">Uji Review</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={settingsSaving}
                  className="flex-1 sm:flex-none h-9 sm:h-10 px-3.5 sm:px-5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {settingsSaving ? (
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  <span>{settingsSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Quick Metrics Bar (Shadcn Metric Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold">Foto Galeri</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-100 font-mono">
                {gallery.length}
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">Live di website utama</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold">Paket Tur</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <div className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-100 font-mono">
                {packages.length}
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">Paket petualangan aktif</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold">Google Review</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="mt-3 text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Terhubung
              </div>
              <p className="mt-1 text-[11px] text-zinc-500 truncate">Jess Mount Batur</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold">WhatsApp Booking</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="mt-3 text-sm font-bold text-zinc-100 font-mono truncate">
                +{settings.whatsappNumber}
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">Tujuan booking tamu</p>
            </div>
          </div>

          {/* ===================== TAB 1: GALLERY ===================== */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleUploadGalleryFiles(e.target.files)}
                className="hidden"
              />

              {/* Upload Dropzone Box (Shadcn style with WebP compression & Max Size notices) */}
              <div
                onClick={() => !galleryUploadLoading && fileInputRef.current?.click()}
                className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
                  galleryUploadLoading
                    ? 'border-zinc-700 bg-zinc-900/60 cursor-wait'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50 cursor-pointer group'
                }`}
              >
                {galleryUploadLoading ? (
                  <div className="py-4 flex flex-col items-center justify-center gap-3">
                    <div className="w-9 h-9 border-2 border-zinc-700 border-t-zinc-100 rounded-full animate-spin" />
                    <p className="text-sm font-bold text-zinc-100">
                      Sedang Mengompresi &amp; Mengunggah Foto...
                    </p>
                    <p className="text-xs text-zinc-400">
                      Otomatis mengonversi ke format WebP super cepat
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-3 text-zinc-400 group-hover:text-zinc-200 group-hover:scale-105 transition-all">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>

                    <p className="text-sm font-bold text-zinc-200">
                      Klik di sini untuk upload foto dari galeri komputer
                    </p>

                    <p className="text-xs text-zinc-400 mt-1 max-w-lg mx-auto">
                      Semua foto otomatis dikompresi ke format <span className="text-emerald-400 font-semibold">WebP</span> agar performa website super cepat dan ringan.
                    </p>

                    {/* Prominent Size Limit & Optimization Badges */}
                    <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Maks. 5 MB / foto
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Auto-Kompres WebP
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 font-mono">
                        JPG, PNG, WEBP
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {gallery.map((item, index) => (
                  <div
                    key={item.id}
                    className="group rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden hover:border-zinc-700 transition-all flex flex-col relative shadow-sm"
                  >
                    {/* Index badge */}
                    <div className="absolute top-2.5 left-2.5 z-10 bg-zinc-950/85 backdrop-blur border border-zinc-800 text-zinc-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shadow">
                      #{index + 1}
                    </div>

                    {/* Thumbnail */}
                    <div
                      onClick={() => setPreviewImage(item.src)}
                      className="aspect-[3/4] w-full bg-zinc-950 overflow-hidden relative cursor-pointer"
                    >
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-xs font-semibold text-zinc-100 bg-zinc-900/90 border border-zinc-700 px-3 py-1 rounded-md shadow">
                          Preview
                        </span>
                      </div>
                    </div>

                    {/* Info & Actions */}
                    <div className="p-3 flex flex-col gap-2 bg-zinc-950/50 border-t border-zinc-800/80">
                      <p className="text-xs font-semibold text-zinc-300 truncate" title={item.title}>
                        {item.title}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                        {/* Move left / right */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveGalleryItem(index, 'left')}
                            disabled={index === 0}
                            title="Geser sebelumnya"
                            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-20 cursor-pointer disabled:cursor-default"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="15 18 9 12 15 6" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveGalleryItem(index, 'right')}
                            disabled={index === gallery.length - 1}
                            title="Geser berikutnya"
                            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-20 cursor-pointer disabled:cursor-default"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          title="Hapus foto"
                          className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {gallery.length === 0 && (
                <div className="text-center py-16 rounded-2xl border border-zinc-800 bg-zinc-900/30">
                  <p className="text-sm text-zinc-400 font-medium">Belum ada foto galeri.</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 h-10 px-5 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-bold cursor-pointer"
                  >
                    Upload Foto Sekarang
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 2: PACKAGES ===================== */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id || index}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
                    {/* Thumbnail */}
                    <div className="w-28 h-22 rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0 relative border border-zinc-800">
                      <img
                        src={pkg.images[0] || '/images/jeep-1.jpeg'}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-zinc-900/90 border border-zinc-700 text-zinc-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                        {pkg.num}
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-[10px] text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                        {pkg.images.length} foto
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-zinc-500">{pkg.num}</span>
                        <h3 className="text-base font-bold tracking-tight text-zinc-100">
                          {pkg.name}
                        </h3>
                      </div>

                      {/* Price Chips */}
                      <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-300">
                          <span className="text-zinc-500 font-mono text-[11px]">IDR</span>
                          <span className="font-bold text-zinc-100 font-mono text-sm">{pkg.prices.IDR.value}</span>
                          <span className="text-zinc-500 text-[11px]">{pkg.prices.IDR.unit}</span>
                        </span>

                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-300">
                          <span className="text-zinc-500 font-mono text-[11px]">USD</span>
                          <span className="font-bold text-zinc-100 font-mono text-sm">{pkg.prices.USD.value}</span>
                          <span className="text-zinc-500 text-[11px]">{pkg.prices.USD.unit}</span>
                        </span>
                      </div>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400 pt-1">
                        {pkg.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="text-zinc-600 font-bold">•</span>
                            <span>{h.left}</span>
                            <span className="text-zinc-600">/</span>
                            <span>{h.right}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-zinc-800">
                    {/* Reorder */}
                    <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-900/60 p-1">
                      <button
                        onClick={() => movePackage(index, 'up')}
                        disabled={index === 0}
                        title="Geser ke atas"
                        className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 disabled:opacity-20 cursor-pointer disabled:cursor-default"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </button>
                      <button
                        onClick={() => movePackage(index, 'down')}
                        disabled={index === packages.length - 1}
                        title="Geser ke bawah"
                        className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 disabled:opacity-20 cursor-pointer disabled:cursor-default"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </div>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEditPackage(pkg)}
                      className="h-10 px-4 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 hover:text-white transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span>Edit Paket</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="h-10 w-10 rounded-lg border border-red-900/30 bg-red-950/20 hover:bg-red-950/60 text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                      title="Hapus paket"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {packages.length === 0 && (
                <div className="text-center py-16 rounded-2xl border border-zinc-800 bg-zinc-900/30">
                  <p className="text-sm text-zinc-400 font-medium">Belum ada paket tur.</p>
                  <button
                    onClick={handleOpenNewPackage}
                    className="mt-3 h-10 px-5 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-bold cursor-pointer"
                  >
                    Buat Paket Pertama
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 3: SETTINGS ===================== */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-6">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Google Review Card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4 shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-zinc-100">Link Review Google Maps</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      URL yang dituju saat pengunjung mengklik bubble rating (&quot;Beri Rating di Google Maps&quot;).
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="url"
                      value={settings.googleReviewUrl}
                      onChange={(e) => setSettings({ ...settings, googleReviewUrl: e.target.value })}
                      placeholder="https://share.google/..."
                      required
                      className="flex-1 h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 font-mono"
                    />
                    <a
                      href={settings.googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 px-4 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 flex-shrink-0"
                    >
                      <span>Uji Link</span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* WhatsApp Card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4 shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-zinc-100">Nomor WhatsApp Booking</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Nomor penerima pesanan tour dalam format internasional (contoh: 6281216074831).
                    </p>
                  </div>

                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    required
                    className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 font-mono"
                  />
                </div>

                {/* Security Card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4 shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-zinc-100">Ganti Password Admin</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Kosongkan jika tidak ingin mengubah password saat ini.
                    </p>
                  </div>

                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Masukkan password baru (minimal 6 karakter)"
                    className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="h-10 px-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {settingsSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ===================== SHADCN DIALOG: ADD VIA URL ===================== */}
      {showAddUrlModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-7 shadow-2xl max-w-md w-full space-y-5">
            <div>
              <h3 className="text-base font-bold tracking-tight text-zinc-100">Tambah Foto via URL</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Masukkan link gambar langsung (misal: /images/nama.jpg atau URL online).
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">URL Gambar</label>
                <input
                  type="text"
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  placeholder="https://... atau /images/..."
                  className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Keterangan / Judul</label>
                <input
                  type="text"
                  value={galleryTitleInput}
                  onChange={(e) => setGalleryTitleInput(e.target.value)}
                  placeholder="Contoh: Jeep Sunrise Mount Batur"
                  className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowAddUrlModal(false)}
                className="h-9 px-4 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddGalleryByUrl}
                className="h-9 px-4 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                Tambahkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SHADCN DIALOG: EDIT / ADD PACKAGE ===================== */}
      {packageModalOpen && editingPackage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 max-w-2xl w-full p-6 sm:p-7 shadow-2xl my-8 max-h-[90vh] flex flex-col space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold tracking-tight text-zinc-100">
                  {isNewPackage ? 'Tambah Paket Baru' : `Edit: ${editingPackage.name}`}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Atur rincian harga, foto carousel, dan bullet points.</p>
              </div>
              <button
                onClick={() => setPackageModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="overflow-y-auto flex-1 space-y-4 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Nomor</label>
                  <input
                    type="text"
                    value={editingPackage.num}
                    onChange={(e) => setEditingPackage({ ...editingPackage, num: e.target.value })}
                    placeholder="01"
                    className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3.5 text-xs text-zinc-100 font-mono"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Nama Paket</label>
                  <input
                    type="text"
                    value={editingPackage.name}
                    onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    placeholder="Contoh: MOUNT BATUR JEEP SUNRISE TOUR"
                    required
                    className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3.5 text-xs text-zinc-100"
                  />
                </div>
              </div>

              {/* Prices IDR & USD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-300">Harga IDR</span>
                  <input
                    type="text"
                    value={editingPackage.prices.IDR.value}
                    onChange={(e) =>
                      setEditingPackage({
                        ...editingPackage,
                        prices: {
                          ...editingPackage.prices,
                          IDR: { ...editingPackage.prices.IDR, value: e.target.value },
                        },
                      })
                    }
                    placeholder="IDR 537K"
                    className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-100 font-mono"
                  />
                  <input
                    type="text"
                    value={editingPackage.prices.IDR.unit}
                    onChange={(e) =>
                      setEditingPackage({
                        ...editingPackage,
                        prices: {
                          ...editingPackage.prices,
                          IDR: { ...editingPackage.prices.IDR, unit: e.target.value },
                        },
                      })
                    }
                    placeholder="/ jeep (2 pax)"
                    className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-400"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-300">Harga USD</span>
                  <input
                    type="text"
                    value={editingPackage.prices.USD.value}
                    onChange={(e) =>
                      setEditingPackage({
                        ...editingPackage,
                        prices: {
                          ...editingPackage.prices,
                          USD: { ...editingPackage.prices.USD, value: e.target.value },
                        },
                      })
                    }
                    placeholder="$30"
                    className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-100 font-mono"
                  />
                  <input
                    type="text"
                    value={editingPackage.prices.USD.unit}
                    onChange={(e) =>
                      setEditingPackage({
                        ...editingPackage,
                        prices: {
                          ...editingPackage.prices,
                          USD: { ...editingPackage.prices.USD, unit: e.target.value },
                        },
                      })
                    }
                    placeholder="/ jeep (2 pax)"
                    className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-400"
                  />
                </div>
              </div>

              {/* Package Carousel Images */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-zinc-300">Foto Carousel Paket</label>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-amber-500/25 bg-amber-500/10 text-amber-300">
                      Maks. 5 MB • Auto WebP
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={packageFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleUploadPackageImages(e.target.files)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => packageFileInputRef.current?.click()}
                      disabled={packageUploadLoading}
                      className="text-xs font-bold text-zinc-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50"
                    >
                      {packageUploadLoading ? (
                        <>
                          <div className="w-3 h-3 border border-zinc-200 border-t-transparent rounded-full animate-spin" />
                          <span>Mengompres...</span>
                        </>
                      ) : (
                        <span>+ Upload Foto</span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/30 min-h-[80px] items-center">
                  {editingPackage.images.map((imgSrc, imgIdx) => (
                    <div key={imgIdx} className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-950 group border border-zinc-800">
                      <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = editingPackage.images.filter((_, i) => i !== imgIdx)
                          setEditingPackage({ ...editingPackage, images: newImages })
                        }}
                        className="absolute inset-0 bg-red-950/80 text-white text-[11px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}

                  {editingPackage.images.length === 0 && (
                    <p className="text-xs text-zinc-500 italic">Belum ada foto carousel untuk paket ini</p>
                  )}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-300">Poin Keunggulan (Highlights)</label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPackage({
                        ...editingPackage,
                        highlights: [...editingPackage.highlights, { left: 'Highlight Kiri', right: 'Highlight Kanan' }],
                      })
                    }}
                    className="text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
                  >
                    + Tambah Baris
                  </button>
                </div>

                <div className="space-y-2">
                  {editingPackage.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={h.left}
                        onChange={(e) => {
                          const updatedH = [...editingPackage.highlights]
                          updatedH[hIdx].left = e.target.value
                          setEditingPackage({ ...editingPackage, highlights: updatedH })
                        }}
                        placeholder="Poin Kiri"
                        className="flex-1 h-9 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 text-xs text-zinc-100"
                      />
                      <input
                        type="text"
                        value={h.right}
                        onChange={(e) => {
                          const updatedH = [...editingPackage.highlights]
                          updatedH[hIdx].right = e.target.value
                          setEditingPackage({ ...editingPackage, highlights: updatedH })
                        }}
                        placeholder="Poin Kanan"
                        className="flex-1 h-9 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 text-xs text-zinc-100"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedH = editingPackage.highlights.filter((_, i) => i !== hIdx)
                          setEditingPackage({ ...editingPackage, highlights: updatedH })
                        }}
                        className="p-1.5 text-zinc-500 hover:text-red-400 cursor-pointer"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setPackageModalOpen(false)}
                  className="h-9 px-4 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  Simpan Paket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== SHADCN DIALOG: IMAGE PREVIEW ===================== */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-3xl max-h-[85vh] relative">
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-zinc-800" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-zinc-400 hover:text-zinc-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              Tutup [✕]
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
