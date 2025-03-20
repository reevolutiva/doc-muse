import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase.types'

const supabaseUrl = 'https://ntrprhkuupexwloxdpgl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cnByaGt1dXBleHdsb3hkcGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NTE0NzAsImV4cCI6MjA1NzIyNzQ3MH0.gWz3BY-JxZ32QiDQ2J9zzgfV-_Le_V4tJiLL38GVcvA'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)