import { pgTable, uuid, text, timestamp ,index} from "drizzle-orm/pg-core";



export const Company = pgTable('company', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
},(t)=>[
    index('company_name_idx').on(t.name)
])



