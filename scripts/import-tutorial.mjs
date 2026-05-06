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

function findMatchingBrace(source, openIndex) {
  let depth = 0
  for (let index = openIndex; index < source.length; index++) {
    const char = source[index]
    if (char === '{') {
      depth++
    } else if (char === '}') {
      depth--
      if (depth === 0) {
        return index
      }
    }
  }
  return -1
}

function extractSetupBody(source) {
  const setupIndex = source.indexOf('setup(')
  if (setupIndex === -1) {
    return ''
  }

  const paramsOpenIndex = source.indexOf('(', setupIndex)
  let paramsDepth = 0
  let paramsCloseIndex = -1
  for (let index = paramsOpenIndex; index < source.length; index++) {
    const char = source[index]
    if (char === '(') {
      paramsDepth++
    } else if (char === ')') {
      paramsDepth--
      if (paramsDepth === 0) {
        paramsCloseIndex = index
        break
      }
    }
  }

  const openIndex = source.indexOf('{', paramsCloseIndex)
  const closeIndex = findMatchingBrace(source, openIndex)
  if (openIndex === -1 || closeIndex === -1) {
    return ''
  }

  const body = source.slice(openIndex + 1, closeIndex)
  const returnIndex = body.lastIndexOf('\n    return {')

  return stripSetupIndent(
    returnIndex === -1 ? body : body.slice(0, returnIndex)
  ).trim()
}

function stripSetupIndent(source) {
  return source
    .split('\n')
    .map((line) => line.replace(/^    /, ''))
    .join('\n')
}

function extractObjectProperty(source, propertyName) {
  const propertyIndex = source.indexOf(`${propertyName}:`)
  if (propertyIndex === -1) {
    return ''
  }

  const openIndex = source.indexOf('{', propertyIndex)
  const closeIndex = findMatchingBrace(source, openIndex)
  if (openIndex === -1 || closeIndex === -1) {
    return ''
  }

  return source.slice(openIndex, closeIndex + 1)
}

function extractArrayProperty(source, propertyName) {
  const propertyIndex = source.indexOf(`${propertyName}:`)
  if (propertyIndex === -1) {
    return ''
  }

  const openIndex = source.indexOf('[', propertyIndex)
  if (openIndex === -1) {
    return ''
  }

  let depth = 0
  for (let index = openIndex; index < source.length; index++) {
    const char = source[index]
    if (char === '[') {
      depth++
    } else if (char === ']') {
      depth--
      if (depth === 0) {
        return source.slice(openIndex, index + 1)
      }
    }
  }

  return ''
}

function extractTopLevelBeforeExport(source) {
  const exportIndex = source.indexOf('export default')
  return exportIndex === -1 ? source : source.slice(0, exportIndex).trim()
}

function toScriptSetup(script) {
  if (!script) {
    return ''
  }

  if (script.includes('// register child component')) {
    return '// import child component'
  }

  const parts = []
  const topLevel = extractTopLevelBeforeExport(script)
  if (topLevel) {
    parts.push(topLevel)
  }

  const props = extractObjectProperty(script, 'props')
  if (props) {
    parts.push(`defineProps(${props})`)
  }

  const emits = extractArrayProperty(script, 'emits')
  if (emits) {
    parts.push(`const emit = defineEmits(${emits})`)
  }

  const setupBody = extractSetupBody(script)
  if (setupBody) {
    parts.push(setupBody)
  }

  return parts.join('\n\n').trim()
}

function toSfc(sourceDir) {
  const template = readIfExists(path.join(sourceDir, 'template.html'))
  const script = toScriptSetup(readIfExists(path.join(sourceDir, 'composition.js')))
  const style = readIfExists(path.join(sourceDir, 'style.css'))

  return [
    script ? `<script setup>\n${script}\n</script>` : '',
    `<template>\n${template}\n</template>`,
    style ? `<style>\n${style}\n</style>` : ''
  ]
    .filter(Boolean)
    .join('\n\n')
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
    title
  })
}

const metadataSource = `export const tutorialSteps = ${JSON.stringify(metadata, null, 2)}\n`
writeFileSync(path.join(targetRoot, 'metadata.js'), metadataSource)
