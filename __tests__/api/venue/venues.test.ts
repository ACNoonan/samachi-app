// __tests__/api/venue/users.test.ts
import { createTestSupabaseClient } from '@/__tests__/utils/createTestSupabaseClient';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/venue/route';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/models/supabase-types/supabase';
import { Venue } from '@/models/schema/Venue';
import { faker } from '@faker-js/faker';

let supabase: SupabaseClient<Database>;
let apiUrl: URL;

beforeAll(() => {
  supabase = createTestSupabaseClient(false);
  apiUrl = new URL('https://localhost/api/venue/');
});

describe('GET /api/venue/', () => {
  it('should return an array of Venue objects', async () => {
    const nextReq = new NextRequest(apiUrl);

    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

    const res = await GET(nextReq, { params: {} }, supabase);
    const body = await res.json();

    expect(body).toBeInstanceOf<Venue[]>;
    expect(body.length).toBeGreaterThan(0);
  })
});

describe('POST /api/venue/', () => {
  it('should add a Venue record to the db _venues_ table', async () => {
    let v_id: string = faker.string.uuid();
    const venue: Venue = {
      id: v_id,
      name: faker.company.name(),
      address: faker.location.streetAddress({ useFullAddress: true }),
      glownet_venue_id: faker.string.uuid(),
      // primary_contact: faker.person.fullName(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const req = new NextRequest(
      new Request('http://localhost/api/venue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venue),
      })
    );

    const res = await POST(req, { params: { venue: venue } }, supabase);
    const body = await res.json();

    expect([{
      ...body[0],
      created_at: new Date(body[0].created_at).toISOString(),
      updated_at: new Date(body[0].updated_at).toISOString(),
    }]).toEqual([{
      ...venue,
      created_at: new Date(venue.created_at).toISOString(),
      updated_at: new Date(venue.updated_at).toISOString(),
    }]);
  })
})