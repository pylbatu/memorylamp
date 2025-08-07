import { CollectionConfig } from 'payload'

const TestamentBookChapters: CollectionConfig = {
  slug: 'testament-book-chapters',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'book',
      type: 'relationship',
      relationTo: 'testament-books',
      required: true,
    },
    {
      name: 'number',
      type: 'number',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && data.book && data.number) {
          data.title = `Chapter ${data.number}`
        }
        return data
      },
    ],
  },
}

export default TestamentBookChapters
