import test from 'ava'
import { graphql } from 'graphql'
import extension from '../../../src/extensions/mediawiki'
import baseSchema, { applyExtension } from '../../../src/schema'
import baseContext from '../../helpers/context'

const schema = applyExtension(extension, baseSchema)
const context = extension.extendContext(baseContext)

function testData (t, query, handler) {
  return graphql(schema, query, null, context).then(result => {
    if (result.errors !== undefined) {
      console.log(result.errors)
    }
    t.is(result.errors, undefined)
    return handler(t, result.data)
  })
}

const fragment = `
  url
  descriptionURL
  user
  size
  width
  height
  canonicalTitle
  objectName
  descriptionHTML
  originalDateTimeHTML
  categories
  artistHTML
  creditHTML
  licenseShortName
  licenseURL
  metadata {
    name
    value
    source
  }
`

test('artists have a mediaWikiImages field', testData, `
  {
    lookup {
      artist(mbid: "5b11f4ce-a62d-471e-81fc-a69a8278c7da") {
        mediaWikiImages {
          ${fragment}
        }
      }
    }
  }
`, (t, data) => {
  t.snapshot(data)
})

test('instruments have a mediaWikiImages field', testData, `
  {
    search {
      instruments(query: "guitar", first: 20) {
        nodes {
          mediaWikiImages {
            ${fragment}
          }
        }
      }
    }
  }
`, (t, data) => {
  t.snapshot(data)
})

test('labels have a mediaWikiImages field', testData, `
  {
    search {
      labels(query: "Sony", first: 50) {
        nodes {
          mediaWikiImages {
            ${fragment}
          }
        }
      }
    }
  }
`, (t, data) => {
  t.snapshot(data)
})

test('places have a mediaWikiImages field', testData, `
  {
    lookup {
      place(mbid: "b5297256-8482-4cba-968a-25db61563faf") {
        mediaWikiImages {
          ${fragment}
        }
      }
    }
  }
`, (t, data) => {
  t.snapshot(data)
})
