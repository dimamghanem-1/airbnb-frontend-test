import { getMockResponse, useMock } from './MockService';
import { mockProperties, mockToken } from './mockData';

// These tests exercise the mock data layer used when REACT_APP_USE_MOCK=true.
// getMockResponse is exactly what ApiService calls in mock mode.

describe('mock mode', () => {
    test('mock mode is off by default (env var not set)', () => {
        // In the test environment REACT_APP_USE_MOCK is not set, so the flag
        // must be false and behaviour stays as it is today.
        expect(useMock).toBe(false);
    });

    test('property service returns all sample properties', () => {
        const response = getMockResponse('/properties', 'GET');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.message)).toBe(true);
        expect(response.message.length).toBe(mockProperties.length);
        expect(response.message.length).toBeGreaterThan(0);

        const first = response.message[0];
        expect(first).toHaveProperty('_id');
        expect(first).toHaveProperty('name');
        expect(first).toHaveProperty('location');
        expect(first).toHaveProperty('cost_per_day');
        expect(first).toHaveProperty('img');
    });

    test('GET /properties?_id= returns the matching sample property', () => {
        const all = getMockResponse('/properties', 'GET').message;
        const target = all[0];

        const response = getMockResponse('/properties?_id=' + target._id, 'GET');
        expect(response.status).toBe(200);
        expect(response.message.length).toBe(1);
        expect(response.message[0]._id).toBe(target._id);
    });

    test('search filters sample properties by location and house_type', () => {
        const response = getMockResponse('/properties?location=canada&house_type=villa', 'GET');
        expect(response.status).toBe(200);
        expect(response.message.length).toBeGreaterThan(0);
        response.message.forEach((property) => {
            expect(property.location.toLowerCase()).toContain('canada');
            expect((property.house_type || '').toLowerCase()).toBe('villa');
        });
    });

    test('GET property images returns sample images', () => {
        const all = getMockResponse('/properties', 'GET').message;
        const id = all[0]._id;
        const response = getMockResponse('/properties/' + id + '/images', 'GET');
        expect(response.status).toBe(200);
        expect(response.message.property_id).toBe(id);
        expect(Array.isArray(response.message.images)).toBe(true);
        expect(response.message.images.length).toBeGreaterThan(0);
        expect(response.message.images[0]).toHaveProperty('image');
    });

    test('POST /login accepts any credentials and returns a fake token', () => {
        const response = getMockResponse('/login', 'POST', { userName: 'any@example.com', password: 'anything' });
        expect(response.status).toBe(200);
        expect(response.message).toBe(mockToken);
        // structurally valid JWT: header.payload.signature
        expect(response.message.split('.')).toHaveLength(3);
    });

    test('GET /users/:id returns a mock host', () => {
        const response = getMockResponse('/users/mock-host', 'GET');
        expect(response.status).toBe(200);
        expect(response.message).toHaveProperty('first_name');
    });
});
