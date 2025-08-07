import { CollectionConfig } from 'payload'

const TestamentBookChapterVerses: CollectionConfig = {
  slug: 'testament-book-chapter-verses',
  admin: {
    useAsTitle: 'reference',
  },
  fields: [
    {
      name: 'chapter',
      type: 'relationship',
      relationTo: 'testament-book-chapters',
      required: true,
    },
    {
      name: 'number',
      type: 'number',
      required: true,
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'reference',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'version',
      type: 'text',
      defaultValue: 'ESV',
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (data && data.chapter && data.number) {
          // Generate the reference text dynamically
          const payload = req.payload
          const chapterDoc = await payload.findByID({
            collection: 'testament-book-chapters',
            id: data.chapter,
          })

          const bookDoc = await payload.findByID({
            collection: 'testament-books',
            id: chapterDoc.book.id,
          })

          data.reference = `${bookDoc.name} ${chapterDoc.number}:${data.number}`
        }

        return data
      },
    ],
  },
}

export default TestamentBookChapterVerses
