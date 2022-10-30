import React from 'react';
import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import App from '../App';
import mockFetch from '../__mocks__/mockFetch';
import userEvent from '@testing-library/user-event';
import searchedQuery from '../__mocks__/searchQuery';

describe(`5 - Liste os produtos buscados por termos, com os dados resumidos, associados a esses termos`, () => {  
  it('Exibe a mensagem "Nenhum produto foi encontrado" caso a busca não retorne produtos', async () => {
    render(<App />);

    userEvent.clear(screen.getByTestId('query-input'));

    userEvent.click(screen.getByTestId('query-button'));
    await waitFor(() => expect(screen.getByText('Nenhum produto foi encontrado')).toBeInTheDocument());
  })
  
  it(`Exibe todos os produtos retornados pela API, dado um determinado filtro`, async () => {
    jest.spyOn(global, 'fetch').mockImplementation(mockFetch);
    render(<App />);
 
    userEvent.type(
      screen.getByTestId('query-input'),
      'carro'
    );

    userEvent.click(screen.getByTestId('query-button'));
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.getAllByTestId('product').length).toEqual(
      searchedQuery.results.length,
    );
  });
});
