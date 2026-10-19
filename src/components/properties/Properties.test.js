import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

process.env.REACT_APP_USE_MOCK = 'true';

const Properties = require('./Properties').default;

const renderProperties = (route) =>
    render(
        <MemoryRouter initialEntries={[route]}>
            <Properties />
        </MemoryRouter>
    );

describe('Properties price filter', () => {

    test('lists all properties when there is no price filter', async () => {
        renderProperties('/');
        // cheapest sample property
        expect(await screen.findByText(/Exceptional property private beach/)).toBeInTheDocument();
        // most expensive sample property
        expect(screen.getByText(/Sierra Shores/)).toBeInTheDocument();
    });

    test('renders price inputs and hides properties above the URL maxPrice', async () => {
        renderProperties('/?maxPrice=300');

        // properties at or below the max stay listed
        expect(await screen.findByText(/Aurora Lodge Houseboat/)).toBeInTheDocument();
        expect(screen.getByText(/Dinjik Zheh/)).toBeInTheDocument();

        // more expensive properties are hidden
        expect(screen.queryByText(/Room in boutique hotel hosted by Aurora/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Stunning Castle Converted Monastery/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Sierra Shores/)).not.toBeInTheDocument();

        // the inputs are present and reflect the URL
        expect(screen.getByPlaceholderText('Max price')).toHaveValue(300);
        expect(screen.getByPlaceholderText('Min price')).toHaveValue(null);
    });

    test('shows a friendly message when nothing matches the price range', async () => {
        renderProperties('/?minPrice=100000');
        expect(await screen.findByText('No properties in this price range')).toBeInTheDocument();
    });

    test('shows an inline message and does not filter when min > max', async () => {
        renderProperties('/');
        await screen.findByText(/Stunning Castle Converted Monastery/);

        fireEvent.change(screen.getByPlaceholderText('Min price'), { target: { value: '500' } });
        fireEvent.change(screen.getByPlaceholderText('Max price'), { target: { value: '100' } });
        fireEvent.click(screen.getByRole('button', { name: 'Search' }));

        expect(screen.getByText('Min price cannot be greater than max price')).toBeInTheDocument();
        // the list is left unfiltered
        expect(screen.getByText(/Stunning Castle Converted Monastery/)).toBeInTheDocument();
        expect(screen.getByText(/Exceptional property private beach/)).toBeInTheDocument();
    });

    test('applies the price filter on top of the search results', async () => {
        renderProperties('/');
        await screen.findByText(/Stunning Castle Converted Monastery/);

        fireEvent.change(screen.getByPlaceholderText('Max price'), { target: { value: '300' } });
        fireEvent.click(screen.getByRole('button', { name: 'Search' }));

        expect(await screen.findByText(/Aurora Lodge Houseboat/)).toBeInTheDocument();
        expect(screen.queryByText(/Stunning Castle Converted Monastery/)).not.toBeInTheDocument();
    });
});
