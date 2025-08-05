import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect } from 'vitest'
import { updateSRSFields } from '@/srs/srs-algorithm'

let payload: Payload

describe('SRS Algorithm Integration', () => {
    let userId: string
    let verseId: string
    let collectionId: string
    let cardId: string

    beforeAll(async () => {
        payload = await getPayload({ config: await config })

        // Create unique user
        const timestamp = Date.now()
        const user = await payload.create({
            collection: 'users',
            data: {
                email: `srs-test-${timestamp}@example.com`,
                password: 'testpassword',
            },
        })
        userId = user.id

        // Create verse
        const verse = await payload.create({
            collection: 'verses',
            data: {
                reference: 'Proverbs 3:5',
                text: 'Trust in the Lord with all your heart...',
            },
        })
        verseId = verse.id

        // Create collection
        const collection = await payload.create({
            collection: 'user-collections',
            data: {
                title: 'SRS Collection',
                owner: userId,
            },
        })
        collectionId = collection.id

        // Create user-card
        const card = await payload.create({
            collection: 'user-cards',
            data: {
                user: userId,
                collection: collectionId,
                verse: verseId,
                dueDate: new Date().toISOString(), // due now
                interval: 1,
                easeFactor: 2.5,
                repetitions: 0,
            },
        })
        cardId = card.id
    })

    it('updates user-card SRS fields correctly using updateSRSFields()', async () => {
        const score = 5 // perfect recall

        // Run update logic
        await updateSRSFields(cardId, score)

        const updatedCard = await payload.findByID({
            collection: 'user-cards',
            id: cardId,
        })

        expect(updatedCard).toBeDefined()
        expect(updatedCard.repetitions).toBe(1)
        expect(updatedCard.interval).toBeGreaterThanOrEqual(1)
        expect(updatedCard.easeFactor).toBeGreaterThanOrEqual(1.3)
        expect(new Date(updatedCard.dueDate).getTime()).toBeGreaterThan(Date.now())
        expect(new Date(updatedCard.lastReviewed!)).toBeInstanceOf(Date)
    })


    it('simulates a review and updates SRS fields', async () => {
        // Simulate SRS review by calling custom endpoint or directly modifying
        const reviewScore = 5 // 0–5 scale, assume 5 means perfect recall

        const result = await payload.create({
            collection: 'user-reviews',
            data: {
                user: userId,
                card: cardId,
                score: reviewScore,
                reviewedAt: new Date().toISOString(),
            },
        })

        expect(result).toBeDefined()
        expect(result.score).toBe(reviewScore)

        // Fetch updated card
        const updatedCard = await payload.findByID({
            collection: 'user-cards',
            id: cardId,
        })

        expect(updatedCard).toBeDefined()
        expect(updatedCard.repetitions).toBeGreaterThanOrEqual(1)
        expect(updatedCard.interval).toBeGreaterThan(1)
        expect(new Date(updatedCard.dueDate).getTime()).toBeGreaterThan(Date.now())

        // You may also check easeFactor bounds
        expect(updatedCard.easeFactor).toBeGreaterThanOrEqual(1.3)
    })
})
