import { CollectionConfig } from 'payload'

const TestamentBooks: CollectionConfig = {
  slug: 'testament-books',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      required: true,
    },
    {
      name: 'testament',
      type: 'relationship',
      relationTo: 'testaments',
      required: true,
    },
  ],
}

export default TestamentBooks
