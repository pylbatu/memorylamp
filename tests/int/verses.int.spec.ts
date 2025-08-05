// tests/integration/verses.int.spec.ts
import { getPayload, Payload } from 'payload';
import config from '@/payload.config';

import { describe, it, beforeAll, expect } from 'vitest';

let payload: Payload;

describe('Verses Collection', () => {
  beforeAll(async () => {
    const payloadConfig = await config;
    payload = await getPayload({ config: payloadConfig });
  });

  it('creates and fetches a verse', async () => {
    const verseData = {
      reference: 'John 3:16',
      text: 'For God so loved the world...',
    };

    // Create a verse
    const created = await payload.create({
      collection: 'verses',
      data: verseData,
    });

    expect(created).toBeDefined();
    expect(created.reference).toBe(verseData.reference);
    expect(created.text).toBe(verseData.text);

    // Fetch the verse
    const result = await payload.find({
      collection: 'verses',
      where: {
        reference: {
          equals: verseData.reference,
        },
      },
    });

    expect(result.docs.length).toBeGreaterThan(0);
    expect(result.docs[0].reference).toBe(verseData.reference);
  });
});
