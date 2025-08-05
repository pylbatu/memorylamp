// tests/integration/user-collections.int.spec.ts
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('UserCollections Collection', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('creates and fetches a user collection', async () => {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: `testuser-${Date.now()}@example.com`,
        password: 'password123',
      },
    })

    const collectionData = {
      title: 'My Favorite Verses',
      description: 'A collection of meaningful verses',
      owner: user.id,
    }

    // Create user collection
    const created = await payload.create({
      collection: 'user-collections',
      data: collectionData,
    })

    expect(created).toBeDefined()
    expect(created.title).toBe(collectionData.title)
    expect(created.owner).toMatchObject({ id: user.id })


    // Fetch user collection
    const result = await payload.find({
      collection: 'user-collections',
      where: {
        title: {
          equals: collectionData.title,
        },
      },
    })

    expect(result.docs.length).toBeGreaterThan(0)
    expect(result.docs[0].title).toBe(collectionData.title)
  })
})
