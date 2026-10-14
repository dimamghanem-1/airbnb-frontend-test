// Mock data for running the app without the backend.
// Built from the sample properties in sample-properties/.
//
// The sample property files do not include ids, so each one is assigned a
// stable mock _id ("mock-p1" ... "mock-p14") that is also used to link the
// property to its sample images.

import p1 from '../../sample-properties/json/p1.json';
import p2 from '../../sample-properties/json/p2.json';
import p3 from '../../sample-properties/json/p3.json';
import p4 from '../../sample-properties/json/p4.json';
import p5 from '../../sample-properties/json/p5.json';
import p6 from '../../sample-properties/json/p6.json';
import p7 from '../../sample-properties/json/p7.json';
import p8 from '../../sample-properties/json/p8.json';
import p9 from '../../sample-properties/json/p9.json';
import p10 from '../../sample-properties/json/p10.json';
import p11 from '../../sample-properties/json/p11.json';
import p12 from '../../sample-properties/json/p12.json';
import p13 from '../../sample-properties/json/p13.json';
import p14 from '../../sample-properties/json/p14.json';

// Sample image sets. These contain real base64 image data.
import sampleImages1 from '../../sample-properties/json/image1.json';
import sampleImages2 from '../../sample-properties/json/631abfd2ff027fd82e85f6e0.json';

const sampleImages = [...sampleImages1, ...sampleImages2].flatMap(
    (entry) => entry.images
);

// Same fake host for every sample property.
const mockHostId = 'mock-host';

export const mockProperties = [
    p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14,
].map((property, index) => {
    const mockId = 'mock-p' + (index + 1);
    return {
        ...property,
        _id: mockId,
        host_id: mockHostId,
        // Sample properties have no image list; give every property the
        // sample images so the details carousel has something to show.
        images: sampleImages.map((image, imageIndex) => ({
            title: 'image' + (imageIndex + 1),
            image: image.image,
        })),
    };
});

export const mockUsers = {
    [mockHostId]: {
        _id: mockHostId,
        first_name: 'Mock Host',
        description: 'This is a mock host used when running without the backend.',
        languages: ['English'],
        created_at: '2022-01-01',
    },
};

// Stable payload so the fake token can be decoded with jwt-decode.
const mockTokenPayload = {
    user_id: 'mock-user',
    is_host: false,
};

const encodeBase64Url = (value) =>
    btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

// A fake but structurally valid JWT (header.payload.signature), so the
// existing jwt-decode based helpers keep working in mock mode.
export const mockToken =
    encodeBase64Url(JSON.stringify({ alg: 'none', typ: 'JWT' })) +
    '.' +
    encodeBase64Url(JSON.stringify(mockTokenPayload)) +
    '.' +
    encodeBase64Url('mock-signature');
