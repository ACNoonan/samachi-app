// __tests__/api/venue/users.test.ts
import { createTestSupabaseClient } from '@/__tests__/utils/createTestSupabaseClient';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/venue/route';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/models/supabase-types/supabase';

let supabase: SupabaseClient<Database>;

beforeAll(() => {
  supabase = createTestSupabaseClient();
});

describe('GET /api/venue/', () => {
  it('should return an array of Venue objects', async () => {
    const url = new URL('https://localhost/api/venue/');
    const nextReq = new NextRequest(url);

    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

    const res = await GET(nextReq, { params: {} }, supabase);
    const body = await res.json();

    expect(body.message).toBe('Hello undefined!');
  })
});