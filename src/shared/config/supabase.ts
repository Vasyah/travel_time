import {createClient} from '@supabase/supabase-js'

export default createClient(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
