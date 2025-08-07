import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('User Reviews Collection', () => {
    let userId: string
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

        // Optional: Clean up any previous test data
        await payload.delete({
            collection: 'testaments',
            where: {
                name: {
                    like: 'New Testament',
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
                name: 'New Testament',
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

        // 1. Create a user
        const user = await payload.create({
            collection: 'users',
            data: {
                email: 'test@tester.com',
                password: 'testpassword',
            },
        })
        userId = user.id

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
                verse: verse.id,
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
        expect(review.user).toMatchObject({ id: userId })
        expect(review.card).toMatchObject({ id: cardId })
    })
})
