import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import mockedQueryResult from '../__mocks__/query';
import mockFetch from '../__mocks__/mockFetch';
import userEvent from '@testing-library/user-event';

describe('6 - Selecione uma categoria e mostre somente os produtos daquela categoria', () => {
  beforeEach(()=> jest.spyOn(global, 'fetch').mockImplementation(mockFetch));
  it(`Filtra corretamente os produtos de uma página para exibir somente os daquela
      categoria`, async () => {

    render(<App />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    userEvent.click(screen.getAllByTestId('category')[0]);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    expect(screen.getAllByTestId('product').length).toEqual(
      mockedQueryResult.results.length,
    );
  });
});
