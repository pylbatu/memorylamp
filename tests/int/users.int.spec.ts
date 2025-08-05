import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Users Collection', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })

    expect(users).toBeDefined()
    expect(Array.isArray(users.docs)).toBe(true)
  })

  it('creates a user', async () => {
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email: `user-${Date.now()}@example.com`,
        password: 'test1234',
      },
    })

    expect(newUser).toBeDefined()
    expect(newUser.email).toContain('@example.com')
  })
})
