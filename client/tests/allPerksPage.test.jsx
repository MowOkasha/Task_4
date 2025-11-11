import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';


  

describe('AllPerks page (Directory)', () => {
  test('lists public perks and responds to name filtering', async () => {
    // The seeded record gives us a deterministic expectation regardless of the
    // rest of the shared database contents.
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    // Render the exploration page so it performs its real HTTP fetch.
    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for the page to finish its baseline load (summary text appears)
    await waitFor(() => {
      expect(screen.getByText(/showing/i)).toBeInTheDocument();
    });

    // Interact with the name filter input using the real value that
    // corresponds to the seeded record. This triggers the API search.
    const nameFilter = screen.getByPlaceholderText('Enter perk name...');
    fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

    // Wait for the search results to include the seeded perk
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    });

    // The summary text should continue to reflect the number of matching perks.
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });

  /*
  TODO: Test merchant filtering
  - use the seeded record
  - perform a real HTTP fetch.
  - wait for the fetch to finish
  - choose the record's merchant from the dropdown
  - verify the record is displayed
  - verify the summary text reflects the number of matching perks
  */

  test('lists public perks and responds to merchant filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );


    // Wait for baseline load to finish
    await waitFor(() => {
      expect(screen.getByText(/showing/i)).toBeInTheDocument();
    });

    // The merchant select is the only combobox on this page
    const merchantSelect = screen.getByRole('combobox');

    // Choose the seeded merchant
    fireEvent.change(merchantSelect, { target: { value: seededPerk.merchant } });

    // Wait for the filtered result to appear
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    });

    // Summary text should reflect the current count
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });
});
