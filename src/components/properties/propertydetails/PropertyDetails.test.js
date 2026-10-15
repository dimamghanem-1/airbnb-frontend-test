import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// The details page must read its data from the mock layer for this test, so
// enable mock mode before any app module evaluates the flag at import time.
process.env.REACT_APP_USE_MOCK = 'true';

// Required (not imported) on purpose: MockService/ApiService capture
// REACT_APP_USE_MOCK when the module is first evaluated.
const PropertyDetails = require('./PropertyDetails').default;

const renderDetailsPage = (id) =>
    render(
        <MemoryRouter initialEntries={['/properties/' + id]}>
            <Routes>
                <Route path="/properties/:id" element={<PropertyDetails />} />
            </Routes>
        </MemoryRouter>
    );

describe('PropertyDetails page (mock mode)', () => {
    test('shows the property title, also after the images request resolves', async () => {
        renderDetailsPage('mock-p1');

        // The title renders once details, host and reviews have loaded.
        await screen.findByText('Room in boutique hotel hosted by Aurora', {}, { timeout: 10000 });

        // getPropertyImages sleeps for 3s before resolving; a bad images
        // response shape crashed the whole page at that point, taking the
        // title down with it.
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 4000));
        });

        expect(screen.getByText('Room in boutique hotel hosted by Aurora')).toBeInTheDocument();
    }, 20000);
});
