// Mock implementation of the backend API, used when
// REACT_APP_USE_MOCK=true. It returns data from sample-properties/
// instead of calling the real backend.

import { mockProperties, mockToken, mockUsers } from './mockData';

export const useMock = process.env.REACT_APP_USE_MOCK === 'true';

const ok = (message) => ({ status: 200, message });

// Matches the `page_size`/`page_no` paging shape returned by the backend.
const paginate = (items, page_no, page_size) => {
    const pageNo = Number(page_no) || 1;
    const pageSize = Number(page_size) || items.length;
    const start = (pageNo - 1) * pageSize;
    return { docs: items.slice(start, start + pageSize) };
};

const findProperty = (id) => mockProperties.find((p) => p._id === id);

const searchProperties = (params) => {
    const location = (params.get('location') || '').toLowerCase();
    const houseType = (params.get('house_type') || '').toLowerCase();

    return mockProperties.filter((property) => {
        const matchesLocation =
            location === '' ||
            (property.location || '').toLowerCase().includes(location);
        const matchesHouseType =
            houseType === '' ||
            (property.house_type || '').toLowerCase() === houseType;
        return matchesLocation && matchesHouseType;
    });
};

// GET endpoints
const handleGet = (uri, params) => {
    if (uri === '/properties') {
        if (params.get('_id')) return ok([findProperty(params.get('_id'))].filter(Boolean));
        return ok(searchProperties(params));
    }

    const imagesMatch = uri.match(/^\/properties\/([^/]+)\/images$/);
    if (imagesMatch) {
        const property = findProperty(imagesMatch[1]);
        return ok({ property_id: imagesMatch[1], images: property ? property.images : [] });
    }

    const userMatch = uri.match(/^\/users\/([^/]+)$/);
    if (userMatch) {
        return ok(mockUsers[userMatch[1]] || mockUsers['mock-host']);
    }

    if (uri === '/review') {
        return ok(paginate([], params.get('page_no'), params.get('page_size')));
    }

    if (uri === '/payment') return ok([]);
    if (uri === '/bookmarks') return ok([]);
    if (uri === '/booking') return ok([]);

    return ok([]);
};

// POST endpoints
const handlePost = (uri, body) => {
    if (uri === '/login') return ok(mockToken);
    if (uri === '/signup') return ok('Signed up');
    return ok({});
};

export function getMockResponse(uri, method, body) {
    // Split the request uri into path and query params.
    const questionMarkIndex = uri.indexOf('?');
    const path = questionMarkIndex === -1 ? uri : uri.substring(0, questionMarkIndex);
    const queryString = questionMarkIndex === -1 ? '' : uri.substring(questionMarkIndex + 1);
    const params = new URLSearchParams(queryString);

    console.log('Mock ' + method + ' ' + path + '?' + queryString);

    switch (method) {
        case 'GET':
            return handleGet(path, params);
        case 'POST':
            return handlePost(path, body);
        default:
            return ok({});
    }
}
