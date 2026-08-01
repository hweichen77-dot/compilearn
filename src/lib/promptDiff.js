const tokenize = (s) => String(s || '').split(/(\s+)/).filter((t) => t !== '')

export function diffPrompts(before, after) {
  const a = tokenize(before)
  const b = tokenize(after)

  const lcs = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }

  const parts = []
  const push = (type, value) => {
    const last = parts[parts.length - 1]
    if (last && last.type === type) last.value += value
    else parts.push({ type, value })
  }

  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { push('same', a[i]); i++; j++ }
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) { push('removed', a[i]); i++ }
    else { push('added', b[j]); j++ }
  }
  while (i < a.length) { push('removed', a[i]); i++ }
  while (j < b.length) { push('added', b[j]); j++ }

  const counted = (type) => parts.filter((p) => p.type === type).reduce((sum, p) => sum + p.value.trim().split(/\s+/).filter(Boolean).length, 0)
  return { parts, added: counted('added'), removed: counted('removed'), changed: parts.some((p) => p.type !== 'same') }
}
