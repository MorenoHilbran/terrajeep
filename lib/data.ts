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

const DATA_DIR = path.join(process.cwd(), 'data')
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json')
const PACKAGES_FILE = path.join(DATA_DIR, 'packages.json')
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json')

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export async function getGallery(): Promise<GalleryItem[]> {
  try {
    ensureDirExists(DATA_DIR)
    if (!fs.existsSync(GALLERY_FILE)) {
      return []
    }
    const content = fs.readFileSync(GALLERY_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Error reading gallery:', error)
    return []
  }
}

export async function saveGallery(items: GalleryItem[]): Promise<boolean> {
  try {
    ensureDirExists(DATA_DIR)
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(items, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Error saving gallery:', error)
    return false
  }
}

export async function getPackages(): Promise<PackageItem[]> {
  try {
    ensureDirExists(DATA_DIR)
    if (!fs.existsSync(PACKAGES_FILE)) {
      return []
    }
    const content = fs.readFileSync(PACKAGES_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Error reading packages:', error)
    return []
  }
}

export async function savePackages(items: PackageItem[]): Promise<boolean> {
  try {
    ensureDirExists(DATA_DIR)
    fs.writeFileSync(PACKAGES_FILE, JSON.stringify(items, null, 2), 'utf-8')
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
    ensureDirExists(DATA_DIR)
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8')
      return DEFAULT_SETTINGS
    }
    const content = fs.readFileSync(SETTINGS_FILE, 'utf-8')
    const parsed = JSON.parse(content)
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch (error) {
    console.error('Error reading settings:', error)
    return DEFAULT_SETTINGS
  }
}

export async function saveSettings(settings: Partial<SiteSettings>): Promise<boolean> {
  try {
    ensureDirExists(DATA_DIR)
    const current = await getSettings()
    const updated = { ...current, ...settings }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Error saving settings:', error)
    return false
  }
}

