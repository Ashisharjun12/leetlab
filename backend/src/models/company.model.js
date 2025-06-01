import { pgTable, uuid, text, timestamp ,index, jsonb} from "drizzle-orm/pg-core";



export const Company = pgTable('company', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    companyUrl:jsonb('company_url'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
},(t)=>[
    index('company_name_idx').on(t.name)
])



