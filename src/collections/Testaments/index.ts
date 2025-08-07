import { CollectionConfig } from 'payload'

const Testaments: CollectionConfig = {
  slug: 'testaments',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}

export default Testaments
