import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const sourceRoot =
  process.argv[2] || '/private/tmp/vue-docs-ja/src/tutorial/src'
const targetRoot = path.resolve('src/tutorial')

if (!existsSync(sourceRoot)) {
  throw new Error(`Tutorial source not found: ${sourceRoot}`)
}

mkdirSync(targetRoot, { recursive: true })

function readIfExists(file) {
  return existsSync(file) ? readFileSync(file, 'utf8').trimEnd() : ''
}

function cleanDescription(markdown) {
  return markdown
    .replace(/^(#{1,6}\s+.+?)\s+\{#[^}]+\}\s*$/gm, '$1')
    .replace(/^:::\w+.*$/gm, '')
    .replace(/^:::$/gm, '')
}

function toSfc(sourceDir) {
  const template = readIfExists(path.join(sourceDir, 'template.html'))
  const script = readIfExists(path.join(sourceDir, 'composition.js'))
  const style = readIfExists(path.join(sourceDir, 'style.css'))

  return [
    '<template>',
    template,
    '</template>',
    '',
    script ? `<script>\n${script}\n</script>` : '',
    '',
    style ? `<style scoped>\n${style}\n</style>` : ''
  ]
    .filter(Boolean)
    .join('\n')
    .concat('\n')
}

const stepDirs = readdirSync(sourceRoot)
  .filter((name) => /^step-\d+$/.test(name))
  .sort((a, b) => Number(a.slice(5)) - Number(b.slice(5)))

const metadata = []

for (const stepDir of stepDirs) {
  const number = Number(stepDir.slice(5))
  const padded = String(number).padStart(2, '0')
  const sourceStep = path.join(sourceRoot, stepDir)
  const targetStep = path.join(targetRoot, `step-${padded}`)

  mkdirSync(targetStep, { recursive: true })
  writeFileSync(path.join(targetStep, 'App.vue'), toSfc(path.join(sourceStep, 'App')))

  const childDir = path.join(sourceStep, 'ChildComp')
  if (existsSync(childDir)) {
    writeFileSync(path.join(targetStep, 'ChildComp.vue'), toSfc(childDir))
  }

  const description = cleanDescription(
    readIfExists(path.join(sourceStep, 'description.md'))
  )
  const titleMatch = description.match(/^#\s+(.+?)(?:\s+\{#[^}]+\})?\s*$/m)
  const title = titleMatch ? titleMatch[1] : `Step ${number}`

  metadata.push({
    number,
    title,
    description
  })
}

const metadataSource = `export const tutorialSteps = ${JSON.stringify(metadata, null, 2)}\n`
writeFileSync(path.join(targetRoot, 'metadata.js'), metadataSource)
