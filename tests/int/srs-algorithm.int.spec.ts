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

        // Optional: Clean up any previous test data
        await payload.delete({
            collection: 'testaments',
            where: {
                name: {
                    like: 'Old Testament',
                },
            },
        });
        await payload.delete({
            collection: 'testament-books',
            where: {
                name: {
                    like: 'John',
                },
            },
        });
        await payload.delete({
            collection: 'testament-book-chapters',
            where: {
                number: {
                    equals: 3,
                },
            },
        });
        await payload.delete({
            collection: 'testament-book-chapter-verses',
            where: {
                number: {
                    equals: 16,
                },
            },
        });

        // Create testament
        const testament = await payload.create({
            collection: 'testaments',
            data: {
                name: 'Old Testament',
            },
        });

        // Create book
        const book = await payload.create({
            collection: 'testament-books',
            data: {
                order: 1,
                name: 'John',
                testament: testament.id,
            },
        });

        // Create chapter
        const chapter = await payload.create({
            collection: 'testament-book-chapters',
            data: {
                book: book.id,
                number: 3,
            },
        });

        // Create verse
        const verse = await payload.create({
            collection: 'testament-book-chapter-verses',
            data: {
                chapter: chapter.id,
                number: 16,
                version: 'ESV',
                text: 'For God so loved the world...',
            },
        });

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
                verse: verse.id,
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
