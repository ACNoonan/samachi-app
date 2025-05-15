// __tests__/api/org/users.test.ts
import request from 'supertest';
import { GET } from '@/app/api/org/[org_id]/users/route';
import { createMocks } from 'node-mocks-http';

describe('GET /api/org/[org_id]/users', () => {
  it('should return a list of User objects for the specified org_id', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { org_id: 'abc123' },
    });

    await GET(req, res);

    expect(res._getStatusCode()).toBe(200);

    const data = JSON.parse(res._getData());
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('id');
  })
})