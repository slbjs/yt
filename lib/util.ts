export function decryptSnapSave(data: string): string {
  const match = data.match(/<script>eval\(unescape\('(.*?)'\)\)<\/script>/)
  if (!match) throw new Error('Failed to decrypt response')
  return decodeURIComponent(match[1])
}