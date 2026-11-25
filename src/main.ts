import './style.css'
import { categories, patterns, sourceFor, type Pattern } from './catalog'

function el<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T
}

const dialog = el<HTMLDialogElement>('viewer')
const search = el<HTMLInputElement>('search')
const results = el('results')
let frame = el<HTMLIFrameElement>('preview')
const thumbnails = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const scale = Math.min(
      entry.contentRect.width / 530,
      entry.contentRect.height / 370,
    )
    ;(entry.target as HTMLElement).style.setProperty(
      '--thumb-scale',
      String(scale),
    )
  }
})

const policy =
  "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'none'; base-uri 'none'"
function documentFor(source: string, thumbnail: boolean, version = 0) {
  const thumbnailStyles =
    'body{height:370px;padding:14px;display:grid;align-items:center;}'
  const resize =
    '<script>new ResizeObserver(()=>parent.postMessage({render:' +
    version +
    ',height:document.body.offsetHeight},"*")).observe(document.body);document.addEventListener("keydown",e=>{if(e.key==="Escape")parent.postMessage({render:' +
    version +
    ',close:true},"*")})</script>'
  return (
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="' +
    policy +
    '"><style>html,body{margin:0}body{box-sizing:border-box;background:transparent;}' +
    (thumbnail ? thumbnailStyles : '') +
    '</style></head><body>' +
    source +
    (thumbnail ? '' : resize) +
    '</body></html>'
  )
}

const slug = (category: string) =>
  'collection-' + category.toLowerCase().replaceAll(' ', '-')
const categoryNav = document.querySelector<HTMLElement>('.categories')!
for (const category of categories) {
  const link = document.createElement('a')
  link.href = '#' + slug(category)
  link.textContent = category
  link.addEventListener('click', () => {
    if (search.value) {
      search.value = ''
      renderGallery()
    }
  })
  categoryNav.append(link)
}

function makeCard(pattern: Pattern) {
  const card = document.createElement('article')
  card.className = 'card'
  const art = document.createElement('div')
  art.className = 'art mat-' + pattern.mat
  art.inert = true
  art.setAttribute('aria-hidden', 'true')
  const thumbnail = document.createElement('iframe')
  thumbnail.className = 'thumb'
  thumbnail.title = pattern.name + ' thumbnail'
  thumbnail.tabIndex = -1
  thumbnail.setAttribute('sandbox', 'allow-scripts')
  thumbnail.loading = 'lazy'
  thumbnail.srcdoc = documentFor(sourceFor(pattern.id), true)
  art.append(thumbnail)
  thumbnails.observe(art)
  const link = document.createElement('a')
  link.className = 'card-link'
  link.href = '#' + pattern.id
  link.setAttribute('aria-haspopup', 'dialog')
  const title = document.createElement('h3')
  title.textContent = pattern.name
  const arrow = document.createElement('span')
  arrow.className = 'arrow'
  arrow.textContent = '↗'
  arrow.setAttribute('aria-hidden', 'true')
  link.append(title, arrow)
  card.append(art, link)
  return card
}

function renderGallery() {
  thumbnails.disconnect()
  results.replaceChildren()
  const term = search.value.trim().toLowerCase()
  const matches = patterns.filter((p) =>
    [p.name, p.category, p.instructions].join(' ').toLowerCase().includes(term),
  )
  for (const category of categories) {
    const group = matches.filter((p) => p.category === category)
    if (!group.length) continue
    const section = document.createElement('section')
    const heading = document.createElement('h2')
    heading.id = slug(category)
    heading.textContent = category
    section.setAttribute('aria-labelledby', heading.id)
    section.className = 'collection'
    const grid = document.createElement('div')
    grid.className = 'grid'
    grid.append(...group.map(makeCard))
    section.append(heading, grid)
    results.append(section)
  }
  el('no-results').hidden = matches.length !== 0
}
search.addEventListener('input', renderGallery)
el('clear-search').onclick = () => {
  search.value = ''
  renderGallery()
  search.focus()
}

let selected: Pattern | undefined
let source = ''
let renderId = 0
let previousFocus: HTMLElement | null = null
let openedFromGallery = false
let compact = false
function renderFrame() {
  if (!selected) return
  // A fresh frame keeps preview resets out of the browser's Back history.
  const next = document.createElement('iframe')
  next.id = 'preview'
  next.title = selected.name + ' interactive preview'
  next.setAttribute('sandbox', 'allow-scripts allow-forms')
  next.classList.toggle('compact', compact)
  next.style.height = '300px'
  next.srcdoc = documentFor(source, false, ++renderId)
  frame.replaceWith(next)
  frame = next
}
window.addEventListener('message', (event) => {
  if (
    !dialog.open ||
    event.source !== frame.contentWindow ||
    event.data?.render !== renderId
  )
    return
  if (event.data.close) {
    closeViewer()
    return
  }
  if (Number.isFinite(event.data.height))
    frame.style.height =
      Math.min(1600, Math.max(95, Math.ceil(event.data.height))) + 'px'
})
function setView(preview: boolean) {
  el('preview-button').setAttribute('aria-pressed', String(preview))
  el('code-button').setAttribute('aria-pressed', String(!preview))
  el('stage').hidden = !preview
  el('editor').hidden = preview
  el('preview-foot').hidden = !preview
  el('notice').textContent = ''
}
function setWidth(mobile: boolean) {
  compact = mobile
  frame.classList.toggle('compact', compact)
  el('mobile').setAttribute('aria-pressed', String(compact))
  el('desktop').setAttribute('aria-pressed', String(!compact))
}
function show(pattern: Pattern) {
  selected = pattern
  document.title = pattern.name + ' · Front/SaaS'
  el('category').textContent = pattern.category
  el('pattern-title').textContent = pattern.name
  el('instructions').textContent = pattern.instructions
  el('integration').textContent = pattern.integration
  el('stage').className = 'mat-' + pattern.mat
  dialog.querySelector('details')!.open = false
  source = sourceFor(pattern.id)
  el('source').textContent = source
  if (!dialog.open) {
    previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    dialog.showModal()
    document.documentElement.classList.add('modal-open')
  }
  setView(true)
  setWidth(false)
  renderFrame()
  dialog.scrollTop = 0
  el('close').focus({ preventScroll: true })
}
function hide() {
  if (!dialog.open) return
  dialog.close()
  selected = undefined
  openedFromGallery = false
  document.documentElement.classList.remove('modal-open')
  document.title = 'Front/SaaS — Pattern library'
  if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
}
function closeViewer() {
  if (openedFromGallery) {
    history.back()
  } else {
    history.replaceState(null, '', location.pathname + location.search)
    hide()
  }
}
function readLocation() {
  const id = location.hash.slice(1)
  const pattern = patterns.find((p) => p.id === id)
  if (pattern) {
    if (selected !== pattern) show(pattern)
  } else hide()
}
results.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>(
    'a.card-link',
  )
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return
  openedFromGallery = true
})
dialog.addEventListener('cancel', (event) => {
  event.preventDefault()
  closeViewer()
})
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return
  const rect = dialog.getBoundingClientRect()
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    closeViewer()
})
el('close').onclick = closeViewer
el('preview-button').onclick = () => setView(true)
el('code-button').onclick = () => setView(false)
el('mobile').onclick = () => setWidth(true)
el('desktop').onclick = () => setWidth(false)
el('reset').onclick = () => {
  renderFrame()
  el('notice').textContent = 'Preview reset.'
}
el('copy').onclick = async () => {
  try {
    await navigator.clipboard.writeText(source)
    el('notice').textContent = 'HTML, CSS and JavaScript copied.'
  } catch {
    setView(false)
    const range = document.createRange()
    range.selectNodeContents(el('source'))
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    el('notice').textContent = 'Source selected. Use your copy shortcut.'
  }
}
window.addEventListener('hashchange', readLocation)
renderGallery()
readLocation()
