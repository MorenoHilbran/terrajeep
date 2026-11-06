import fs from 'fs'
import path from 'path'

export interface GalleryItem {
  id: string
  src: string
  title: string
}

export interface PackageHighlight {
  left: string
  right: string
}

export interface PackageItem {
  id: string
  num: string
  name: string
  prices: {
    IDR: { value: string; unit: string }
    USD: { value: string; unit: string }
  }
  images: string[]
  highlights: PackageHighlight[]
  whatsappText?: string
}

export interface SiteSettings {
  googleReviewUrl: string
  adminUsername: string
  adminPassword: string
  siteTitle: string
  whatsappNumber: string
}

function getDataDir(): string {
  const custom = process.env.DATA_DIR
  if (custom && fs.existsSync(custom)) return custom

  const candidates = [
    '/home/sdnt7854/terrajeepadventures/data',
    '/home/sdnt7854/terrajeep/data',
    path.join(process.cwd(), 'data'),
  ]

  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }

  const defaultDir = path.join(process.cwd(), 'data')
  ensureDirExists(defaultDir)
  return defaultDir
}

function getFilePath(filename: string): string {
  const dir = getDataDir()
  ensureDirExists(dir)
  return path.join(dir, filename)
}

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true })
    } catch (_) {}
  }
}

export async function getGallery(): Promise<GalleryItem[]> {
  try {
    const file = getFilePath('gallery.json')
    if (!fs.existsSync(file)) {
      return []
    }
    const content = fs.readFileSync(file, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Error reading gallery:', error)
    return []
  }
}

export async function saveGallery(items: GalleryItem[]): Promise<boolean> {
  try {
    const file = getFilePath('gallery.json')
    fs.writeFileSync(file, JSON.stringify(items, null, 2), 'utf-8')
    
    // Also save to secondary candidate if exists
    const prodFile = '/home/sdnt7854/terrajeepadventures/data/gallery.json'
    if (fs.existsSync('/home/sdnt7854/terrajeepadventures/data') && file !== prodFile) {
      try { fs.writeFileSync(prodFile, JSON.stringify(items, null, 2), 'utf-8') } catch (_) {}
    }
    return true
  } catch (error) {
    console.error('Error saving gallery:', error)
    return false
  }
}

export async function getPackages(): Promise<PackageItem[]> {
  try {
    const file = getFilePath('packages.json')
    if (!fs.existsSync(file)) {
      return []
    }
    const content = fs.readFileSync(file, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Error reading packages:', error)
    return []
  }
}

export async function savePackages(items: PackageItem[]): Promise<boolean> {
  try {
    const file = getFilePath('packages.json')
    fs.writeFileSync(file, JSON.stringify(items, null, 2), 'utf-8')
    
    const prodFile = '/home/sdnt7854/terrajeepadventures/data/packages.json'
    if (fs.existsSync('/home/sdnt7854/terrajeepadventures/data') && file !== prodFile) {
      try { fs.writeFileSync(prodFile, JSON.stringify(items, null, 2), 'utf-8') } catch (_) {}
    }
    return true
  } catch (error) {
    console.error('Error saving packages:', error)
    return false
  }
}

const DEFAULT_SETTINGS: SiteSettings = {
  googleReviewUrl: 'https://share.google/csqO5RheRkpH7AVh4',
  adminUsername: 'admin',
  adminPassword: 'password123',
  siteTitle: 'Terra Adventure Bali',
  whatsappNumber: '6281216074831',
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const file = getFilePath('settings.json')
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8')
      return DEFAULT_SETTINGS
    }
    const content = fs.readFileSync(file, 'utf-8')
    const parsed = JSON.parse(content)
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch (error) {
    console.error('Error reading settings:', error)
    return DEFAULT_SETTINGS
  }
}

export async function saveSettings(settings: Partial<SiteSettings>): Promise<boolean> {
  try {
    const file = getFilePath('settings.json')
    const current = await getSettings()
    const updated = { ...current, ...settings }
    fs.writeFileSync(file, JSON.stringify(updated, null, 2), 'utf-8')
    
    const prodFile = '/home/sdnt7854/terrajeepadventures/data/settings.json'
    if (fs.existsSync('/home/sdnt7854/terrajeepadventures/data') && file !== prodFile) {
      try { fs.writeFileSync(prodFile, JSON.stringify(updated, null, 2), 'utf-8') } catch (_) {}
    }
    return true
  } catch (error) {
    console.error('Error saving settings:', error)
    return false
  }
}

