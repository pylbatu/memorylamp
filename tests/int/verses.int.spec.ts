// tests/integration/verses.int.spec.ts
import { getPayload, Payload } from 'payload';
import config from '@/payload.config';

import { describe, it, beforeAll, expect } from 'vitest';

let payload: Payload;

describe('Testament Book Chapter Verses', () => {
  let bookId: string;
  let chapterId: string;
  let testamentId: string;

  beforeAll(async () => {
    const payloadConfig = await config;
    payload = await getPayload({ config: payloadConfig });

    // Optional: Clean up any previous test data
    await payload.delete({
      collection: 'testaments',
      where: {
        name: {
          equals: 'New',
        },
      },
    });
    await payload.delete({
      collection: 'testament-books',
      where: {
        name: {
          equals: 'John',
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
        name: 'New',
      },
    });
    testamentId = testament.id;

    // Create book
    const book = await payload.create({
      collection: 'testament-books',
      data: {
        order: 1,
        name: 'John',
        testament: testamentId,
      },
    });
    bookId = book.id;

    // Create chapter
    const chapter = await payload.create({
      collection: 'testament-book-chapters',
      data: {
        book: bookId,
        number: 3,
      },
    });
    chapterId = chapter.id;
  });


  it('creates and fetches a verse', async () => {
    const verseData = {
      chapter: chapterId,
      number: 16,
      version: 'ESV',
      text: 'For God so loved the world...',
    };

    // Create a verse
    const created = await payload.create({
      collection: 'testament-book-chapter-verses',
      data: verseData,
    });

    expect(created).toBeDefined();
    expect(created.number).toBe(16);
    expect(created.text).toBe(verseData.text);

    // Fetch the verse
    const result = await payload.find({
      collection: 'testament-book-chapter-verses',
      where: {
        number: {
          equals: 16,
        },
      },
    });

    // expect(result.docs.length).toBeGreaterThan(0);
    expect(result.docs[0].text).toBe(verseData.text);
    expect(result.docs[0].number).toBe(16);
  });
});

