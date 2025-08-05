import type { CollectionConfig } from 'payload'

const UserCollections: CollectionConfig = {
  slug: 'user-collections',
  auth: false,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
};

export default UserCollections;
