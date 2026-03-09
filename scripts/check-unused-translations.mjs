import fs from 'node:fs'
import path from 'node:path'

const SRC_DIR = 'src'
const LOCALES_DIR = path.join(SRC_DIR, 'locales')
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx'])
const DEFAULT_LOCALES = ['en.json', 'es.json']

const walkFiles = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkFiles(filePath, out)
      continue
    }
    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) out.push(filePath)
  }
  return out
}

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'))

const keyUsageRegexes = [
  /\bt\(\s*['"]([^'"`]+)['"]/g,
  /\bt`([^`]+)`/g,
  /\bi18nKey\s*=\s*['"]([^'"]+)['"]/g
]

const findUsedKeys = (files) => {
  const used = new Map()

  const addUse = (key, file) => {
    if (!used.has(key)) used.set(key, new Set())
    used.get(key).add(file)
  }

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    for (const regex of keyUsageRegexes) {
      for (const match of content.matchAll(regex)) addUse(match[1], file)
    }
  }

  return used
}

const localeNames = DEFAULT_LOCALES.filter((name) =>
  fs.existsSync(path.join(LOCALES_DIR, name))
)

if (!localeNames.length) {
  console.error(`No locale files found in ${LOCALES_DIR}`)
  process.exit(1)
}

const sourceFiles = walkFiles(SRC_DIR).filter(
  (filePath) => !filePath.startsWith(`${LOCALES_DIR}${path.sep}`)
)
const usedKeys = findUsedKeys(sourceFiles)
const locales = new Map(
  localeNames.map((localeName) => [
    localeName,
    readJson(path.join(LOCALES_DIR, localeName))
  ])
)
const baseLocaleName = localeNames[0]
const baseKeys = Object.keys(locales.get(baseLocaleName))

let hasUnused = false
let hasSyncIssues = false

for (const localeName of localeNames) {
  const locale = locales.get(localeName)
  const keys = Object.keys(locale)
  const missingKeys = baseKeys.filter((key) => !Object.hasOwn(locale, key))
  const extraKeys = keys.filter((key) => !baseKeys.includes(key))
  const unusedKeys = keys.filter((key) => !usedKeys.has(key))

  if (unusedKeys.length) hasUnused = true
  if (missingKeys.length || extraKeys.length) hasSyncIssues = true

  console.log(`\n[${localeName}]`)
  console.log(`total: ${keys.length}`)
  console.log(`missing-vs-${baseLocaleName}: ${missingKeys.length}`)
  console.log(`extra-vs-${baseLocaleName}: ${extraKeys.length}`)
  console.log(`unused: ${unusedKeys.length}`)

  if (missingKeys.length) for (const key of missingKeys) console.log(`! missing: ${key}`)
  if (extraKeys.length) for (const key of extraKeys) console.log(`+ extra: ${key}`)
  if (!unusedKeys.length) console.log('keys-unused: none')
  else for (const key of unusedKeys) console.log(`- ${key}`)
}

if (!hasUnused && !hasSyncIssues) {
  console.log('\nAll locales are synchronized and all keys are in use.')
}

process.exit(hasUnused || hasSyncIssues ? 2 : 0)
