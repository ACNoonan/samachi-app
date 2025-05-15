// __tests__/api/venue/users.test.ts
import request from 'supertest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/venue/[venue_id]/users/route';
import { createMocks } from 'node-mocks-http';

describe('GET /api/venue/[venue_id]/users', () => {
  it('should return a list of User objects for the specified venue_id', async () => {
    // the URL here actually doesn't matter, as long as it's a string in a valid URL format
    // this is because we're manually passing `venue_id` via `params: {}`, in the `const req = await...` line below.
    const url = new URL('https://localhost/api/venue/123/users');
    const nextReq = new NextRequest(url);

    const res = await GET(nextReq, { params: { venue_id: '123' } });
    const body = await res.json();

    expect(body.message).toBe('Fetching users for venue 123!');
  })
});

describe('POST /api/venue/[venue_id]/users', () => {
  it('should add a user_id to the specified venue_id', async () => {

  })
})