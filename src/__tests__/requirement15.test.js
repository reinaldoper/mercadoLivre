import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import mockFetch from '../__mocks__/mockFetch';
import userEvent from '@testing-library/user-event';

describe('15 - Mostre quais produtos tem o frete grátis', () => {
  beforeEach(()=> jest.spyOn(global, 'fetch').mockImplementation(mockFetch));
  it('Exibe corretmente a informação de frete grátis dos produtos', async () => {

    render(<App />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    userEvent.click(screen.getAllByTestId('category')[0]);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    expect(screen.getAllByTestId('free-shipping').length).toBe(1);
  });
});
