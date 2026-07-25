const MONTHS = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']

export function formatDate(timestamp) {
  const d = new Date(timestamp)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} - ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export function getNow() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export function formatPreview(text, maxLines = 2) {
  if (!text) return ''
  const lines = text.split('\n').slice(0, maxLines)
  return lines.join('\n').substring(0, 120)
}

export function stripHtml(html) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}
