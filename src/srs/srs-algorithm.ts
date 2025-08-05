import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

export const updateSRSFields = async (cardId: string, score: number) => {

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const card = await payload.findByID({ collection: 'user-cards', id: cardId })

    if (!card) return

    // Defaults (use actual logic based on SRS algorithm like SM-2)
    let easeFactor = card.easeFactor ?? 2.5
    let interval = card.interval ?? 1
    let repetitions = card.repetitions ?? 0

    if (score >= 3) {
        repetitions += 1
        easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - score) * (0.08 + (5 - score) * 0.02))
        interval = repetitions === 1 ? 1 : Math.round(interval * easeFactor)
    } else {
        repetitions = 0
        interval = 1
        easeFactor = Math.max(1.3, easeFactor - 0.2)
    }

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + interval)

    await payload.update({
        collection: 'user-cards',
        id: cardId,
        data: {
            repetitions,
            interval,
            easeFactor,
            dueDate: dueDate.toISOString(),
            lastReviewed: new Date().toISOString(),
        },
    })
}
