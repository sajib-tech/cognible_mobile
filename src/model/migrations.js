// app/model/migrations.js

import { schemaMigrations, createTable, addColumns } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    {
      // ⚠️ Set this to a number one larger than the current schema version
      toVersion: 3,
      steps: [
        // See "Migrations API" for more details
        // createTable({
        //   name: 'comments',
        //   columns: [
        //     { name: 'post_id', type: 'string', isIndexed: true },
        //     { name: 'body', type: 'string' },
        //   ],
        // }),
        addColumns({
          table: 'posts',
          columns: [
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        }),
      ],
    },
  ],
})
