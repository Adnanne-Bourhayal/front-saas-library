import './style.css'
import { patterns, sourceFor, type Pattern } from './catalog'

function el<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T
}

const frame = el<HTMLIFrameElement>('preview')
const list = el('list')
const search = el<HTMLInputElement>('search')
const mobileMenu = document.querySelector<HTMLButtonElement>('.mobile-switch')!
let selected =
  patterns.find((p) => p.id === location.hash.slice(1)) || patterns[0]
let activeView: 'preview' | 'code' = 'preview'
let renderId = 0
let source = ''
let compact = false

const lines: Record<string, string> = {
  members:
    '<circle cx="8" cy="8" r="2.5"/><path d="M3 18v-1a5 5 0 0 1 10 0v1m0-12a3 3 0 0 1 0 6m3 1a4 4 0 0 1 3 4v1"/>',
  billing:
    '<rect x="2" y="5" width="17" height="12" rx="2"/><path d="M2 9h17m-13 5h4"/>',
  project:
    '<path d="M2 7V5a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>',
  check:
    '<rect x="3" y="3" width="15" height="15" rx="2"/><path d="m6 10 3 3 6-6"/>',
  meter:
    '<path d="M3 16a8 8 0 1 1 15 0M10.5 12.5l4-5"/><circle cx="10.5" cy="12.5" r="1"/>',
  settings:
    '<path d="M3 6h8m4 0h4M3 14h3m4 0h9"/><circle cx="13" cy="6" r="2"/><circle cx="8" cy="14" r="2"/>',
}

function buildList() {
  list.replaceChildren()
  const term = search.value.trim().toLowerCase()
  const results = patterns.filter((p) =>
    (p.name + ' ' + p.category + ' ' + p.description)
      .toLowerCase()
      .includes(term),
  )
  for (const category of new Set(results.map((p) => p.category))) {
    const group = document.createElement('section')
    const title = document.createElement('h3')
    title.textContent = category
    group.append(title)
    for (const p of results.filter((item) => item.category === category)) {
      const link = document.createElement('a')
      link.href = '#' + p.id
      link.className = 'item'
      if (p.id === selected.id) link.setAttribute('aria-current', 'page')
      const icon = document.createElement('span')
      icon.setAttribute('aria-hidden', 'true')
      icon.innerHTML =
        '<svg viewBox="0 0 21 21" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        lines[p.icon] +
        '</svg>'
      link.append(icon, document.createTextNode(p.name))
      link.onclick = () => {
        setMenu(false)
        if (location.hash === '#' + p.id) el('pattern-title').focus()
      }
      group.append(link)
    }
    list.append(group)
  }
  el('no-results').hidden = results.length !== 0
}
function setMenu(open: boolean) {
  mobileMenu.setAttribute('aria-expanded', String(open))
  el('browse').classList.toggle('opened', open)
}
mobileMenu.onclick = () =>
  setMenu(mobileMenu.getAttribute('aria-expanded') !== 'true')
search.oninput = buildList
el('clear-search').onclick = () => {
  search.value = ''
  buildList()
  search.focus()
}

function renderFrame() {
  const version = ++renderId
  frame.title = selected.name + ' interactive preview'
  frame.style.height = '290px'
  // An opaque-origin sandbox runs only this reviewed fixture. The resize message
  // is accepted only from the current frame and render, including after Reset.
  const resize =
    '<script>new ResizeObserver(()=>parent.postMessage({fslVersion:' +
    version +
    ',height:document.body.offsetHeight},"*")).observe(document.body)</script>'
  frame.srcdoc =
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; script-src \'unsafe-inline\'; form-action \'none\'; base-uri \'none\'"><style>html, body{margin:0}body{padding:3px 2px 5px;box-sizing:border-box;background:transparent}</style></head><body>' +
    source +
    resize +
    '</body></html>'
}
window.addEventListener('message', (event) => {
  const v = event.data
  if (
    event.source !== frame.contentWindow ||
    v?.fslVersion !== renderId ||
    !Number.isFinite(v?.height)
  )
    return
  frame.style.height = Math.min(Math.max(110, Math.ceil(v.height)), 1500) + 'px'
})
function setView(view: 'preview' | 'code') {
  activeView = view
  const preview = activeView === 'preview'
  el('preview-button').setAttribute('aria-pressed', String(preview))
  el('code-button').setAttribute('aria-pressed', String(!preview))
  el('stage').hidden = !preview
  el('editor').hidden = preview
  el('preview-foot').hidden = !preview
  el('notice').textContent = ''
}
function setWidth(mobile: boolean) {
  compact = mobile
  el('stage').classList.toggle('narrow', compact)
  el('mobile').setAttribute('aria-pressed', String(compact))
  el('desktop').setAttribute('aria-pressed', String(!compact))
}
function show(pattern: Pattern) {
  selected = pattern
  document.title = pattern.name + ' · Front/SaaS'
  el('category').textContent = pattern.category
  el('pattern-title').textContent = pattern.name
  el('description').textContent = pattern.description
  el('instructions').textContent = pattern.instructions
  el('integration').textContent = pattern.integration
  source = sourceFor(pattern.id)
  el('source').textContent = source
  setView('preview')
  renderFrame()
  buildList()
}
el('preview-button').onclick = () => setView('preview')
el('code-button').onclick = () => setView('code')
el('desktop').onclick = () => setWidth(false)
el('mobile').onclick = () => setWidth(true)
el('reset').onclick = () => {
  renderFrame()
  el('notice').textContent = 'Preview reset.'
}
el('copy').onclick = async () => {
  try {
    await navigator.clipboard.writeText(source)
    el('notice').textContent = 'HTML, CSS and JavaScript copied.'
  } catch {
    setView('code')
    const selection = window.getSelection(),
      range = document.createRange()
    range.selectNodeContents(el('source'))
    selection?.removeAllRanges()
    selection?.addRange(range)
    el('notice').textContent =
      'Source selected. Use your copy shortcut to copy it.'
  }
}
window.addEventListener('hashchange', () => {
  const p = patterns.find((item) => item.id === location.hash.slice(1))
  if (p) {
    show(p)
    el('pattern-title').focus({ preventScroll: true })
  }
})
show(selected)
