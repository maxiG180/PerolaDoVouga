
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugMenu() {
  // Use the same date logic as the API
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Lisbon',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());

  console.log(`Checking menu for date: ${today}`);

  const { data: planning, error: planningError } = await supabase
    .from('daily_menu_planning')
    .select('*, daily_menu_items(*, menu_items(*))')
    .eq('date', today)
    .maybeSingle();

  if (planningError) {
    console.error('Error fetching planning:', planningError);
  } else if (!planning) {
    console.log('No planning found for today.');
    
    // Check if there are ANY entries in the table to see if it's working
    const { data: allPlanning } = await supabase
      .from('daily_menu_planning')
      .select('date')
      .limit(5);
    console.log('Existing dates in table:', allPlanning?.map(p => p.date));
  } else {
    console.log('Planning found:', JSON.stringify(planning, null, 2));
  }
}

debugMenu();
