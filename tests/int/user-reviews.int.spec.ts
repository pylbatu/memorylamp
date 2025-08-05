import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('User Reviews Collection', () => {
    let userId: string
    let verseId: string
    let collectionId: string
    let cardId: string

    beforeAll(async () => {
        const payloadConfig = await config
        payload = await getPayload({ config: payloadConfig })


        // 0. Clean up all related collections for a fresh state
        await payload.delete({
            collection: 'users',
            where: {
                email: {
                    equals: 'test@tester.com',
                },
            },
        })
        await payload.delete({
            collection: 'user-reviews',
            where: {
                user: {
                    equals: 'test@tester.com',
                },
            },
        })
        await payload.delete({
            collection: 'user-cards',
            where: {
                user: {
                    equals: 'test@tester.com',
                },
            },
        })
        await payload.delete({
            collection: 'user-collections',
            where: {
                title: {
                    equals: 'Test Collection',
                },
            },
        })
        await payload.delete({
            collection: 'verses',
            where: {
                reference: {
                    equals: 'John 3:16',
                },
            },
        })
        await payload.delete({
            collection: 'users',
            where: {
                email: {
                    equals: 'test@tester.com',
                },
            },
        })

        // 1. Create a user
        const user = await payload.create({
            collection: 'users',
            data: {
                email: 'test@tester.com',
                password: 'testpassword',
            },
        })
        userId = user.id

        // 2. Create a verse
        const verse = await payload.create({
            collection: 'verses',
            data: {
                reference: 'John 3:16',
                text: 'For God so loved the world...',
            },
        })
        verseId = verse.id

        // 3. Create a user-collection
        const collection = await payload.create({
            collection: 'user-collections',
            data: {
                title: 'Test Collection',
                owner: userId,
            },
        })
        collectionId = collection.id

        // 4. Create a user-card
        const card = await payload.create({
            collection: 'user-cards',
            data: {
                user: userId,
                collection: collectionId,
                verse: verseId,
                dueDate: new Date().toISOString(),
            },
        })
        cardId = card.id
    })


    it('fetches user reviews', async () => {
        const reviews = await payload.find({
            collection: 'user-reviews',
        })
        expect(reviews).toBeDefined()
        expect(Array.isArray(reviews.docs)).toBe(true)
    })

    it('creates a user review', async () => {
        const review = await payload.create({
            collection: 'user-reviews',
            data: {
                user: userId,
                card: cardId,
                score: 4,
                reviewedAt: new Date().toISOString(),
            },
        })

        expect(review).toBeDefined()
        expect(review.score).toBe(4)
        // expect(review.user).toMatchObject({ id: userId })
        // expect(review.card).toMatchObject({ id: cardId })
    })
})
