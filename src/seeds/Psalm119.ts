import { getPayload } from 'payload'
import config from '@/payload.config'

const psalm119 = [
    "Blessed are those whose way is blameless, who walk in the law of the Lord!",
    "Blessed are those who keep his testimonies, who seek him with their whole heart,",
    "who also do no wrong, but walk in his ways!",
    "You have commanded your precepts to be kept diligently.",
    "Oh that my ways may be steadfast in keeping your statutes!",
    "Then I shall not be put to shame, having my eyes fixed on all your commandments.",
    "I will praise you with an upright heart, when I learn your righteous rules.",
    "I will keep your statutes; do not utterly forsake me!",
    "How can a young man keep his way pure? By guarding it according to your word.",
    "With my whole heart I seek you; let me not wander from your commandments!",
    // ...
    // Add all 176 verses here in order (for brevity, I've shown only 10)
    // You can get full Psalm 119 from a JSON file or copy-paste from ESV API
];

export const seedPsalm119 = async () => {
    console.log('🌱 Seeding Psalm 119...');

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Step 1: Ensure Testament exists
    const testamentName = 'Old';
    const testamentResult = await payload.find({
        collection: 'testaments',
        where: { name: { equals: testamentName } },
    });

    let testament;
    if (!testamentResult.docs.length) {
        const createdTestament = await payload.create({
            collection: 'testaments',
            data: { name: testamentName },
        });
        testament = createdTestament;
    } else {
        testament = testamentResult.docs[0];
    }

    // Step 2: Ensure "Psalms" book exists
    const bookName = 'Psalms';
    const bookResult = await payload.find({
        collection: 'testament-books',
        where: { name: { equals: bookName } },
    });

    let book;
    if (!bookResult.docs.length) {
        const createdBook = await payload.create({
            collection: 'testament-books',
            data: {
                name: bookName,
                order: 19, // Psalms is book #19 in most Bible orders
                testament: testament.id,
            },
        });
        book = createdBook;
    } else {
        book = bookResult.docs[0];
    }

    // Step 3: Create Psalm 119 chapter
    const chapterResult = await payload.find({
        collection: 'testament-book-chapters',
        where: {
            book: { equals: book.id },
            number: { equals: 119 },
        },
    });

    let chapter;
    if (!chapterResult.docs.length) {
        const createdChapter = await payload.create({
            collection: 'testament-book-chapters',
            data: {
                book: book.id,
                number: 119,
            },
        });
        chapter = createdChapter;
    } else {
        chapter = chapterResult.docs[0];
    }


    // Step 4: Seed 176 verses
    for (let i = 0; i < psalm119.length; i++) {
        const verseNumber = i + 1;
        const verseText = psalm119[i];

        // Check if verse already exists
        const existingVerse = await payload.find({
            collection: 'testament-book-chapter-verses',
            where: {
                chapter: { equals: chapter.id },
                number: { equals: verseNumber },
            },
        });

        if (existingVerse.docs.length === 0) {
            await payload.create({
                collection: 'testament-book-chapter-verses',
                data: {
                    chapter: chapter.id,
                    number: verseNumber,
                    text: verseText,
                    version: 'ESV',
                },
            });
            console.log(`✅ Seeded Psalm 119:${verseNumber}`);
        } else {
            console.log(`⚠️ Psalm 119:${verseNumber} already exists, skipping...`);
        }
    }

    console.log('✅ Finished seeding Psalm 119.');
};

if (require.main === module) {
    seedPsalm119()
        .then(() => {
            console.log('🌱 Psalm 119 seeding completed.');
            process.exit(0);
        })
        .catch((err) => {
            console.error('❌ Error seeding Psalm 119:', err);
            process.exit(1);
        });
}
