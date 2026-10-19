import { filterPropertiesByPrice, isValidPriceRange } from './priceFilter';

const properties = [
    { _id: 'cheap', cost_per_day: 100 },
    { _id: 'mid', cost_per_day: 250 },
    { _id: 'pricey', cost_per_day: 400 },
];

const ids = (list) => list.map(p => p._id);

describe('filterPropertiesByPrice', () => {

    test('no limits returns the full list', () => {
        expect(filterPropertiesByPrice(properties, '', '')).toEqual(properties);
        expect(filterPropertiesByPrice(properties, null, undefined)).toEqual(properties);
    });

    test('min only keeps properties at or above the min', () => {
        expect(ids(filterPropertiesByPrice(properties, '250', ''))).toEqual(['mid', 'pricey']);
    });

    test('max only keeps properties at or below the max', () => {
        expect(ids(filterPropertiesByPrice(properties, '', '250'))).toEqual(['cheap', 'mid']);
    });

    test('min and max keep only the range, bounds inclusive', () => {
        expect(ids(filterPropertiesByPrice(properties, '100', '250'))).toEqual(['cheap', 'mid']);
        expect(ids(filterPropertiesByPrice(properties, '101', '249'))).toEqual([]);
    });

    test('min greater than max returns the list unfiltered', () => {
        expect(filterPropertiesByPrice(properties, '300', '100')).toEqual(properties);
    });

    test('non-numeric bounds mean no limit', () => {
        expect(filterPropertiesByPrice(properties, 'abc', '')).toEqual(properties);
        expect(filterPropertiesByPrice(properties, '', '10x')).toEqual(properties);
    });
});

describe('isValidPriceRange', () => {

    test('empty bounds are valid', () => {
        expect(isValidPriceRange('', '')).toBe(true);
        expect(isValidPriceRange('100', '')).toBe(true);
        expect(isValidPriceRange('', '200')).toBe(true);
    });

    test('min <= max is valid', () => {
        expect(isValidPriceRange('100', '200')).toBe(true);
        expect(isValidPriceRange('200', '200')).toBe(true);
    });

    test('min > max is invalid', () => {
        expect(isValidPriceRange('300', '100')).toBe(false);
    });
});
