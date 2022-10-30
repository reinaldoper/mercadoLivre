import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import mockedQueryResult from '../__mocks__/query';
import mockFetch from '../__mocks__/mockFetch';
import userEvent from '@testing-library/user-event';

describe(`7 - Redirecione para uma tela com a exibição detalhada ao clicar na exibição resumida de um produto`, () => {
  beforeEach(()=> jest.spyOn(global, 'fetch').mockImplementation(mockFetch));
  it('Clicar no card de um produto leva à página com seus detalhes', async () => {

    render(<App />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    userEvent.click(screen.getAllByTestId('category')[0]);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    userEvent.click(screen.getAllByTestId('product-detail-link')[0]);
    await waitFor(
      () => expect(screen.getByTestId('product-detail-name')).toHaveTextContent(
        mockedQueryResult.results[0].title,
      ),
    );
    await waitFor(
      () => expect(screen.getByTestId('product-detail-image')).toBeInTheDocument()
    );
    
    expect(screen.getByTestId('product-detail-price')).toHaveTextContent(
        mockedQueryResult.results[0].price,
    );
  });

  it('Na página de detalhes de um produto, o elemento que redireciona para o carrinho de compras é exibido', async () => {
    render(<App />);

    await waitFor(() => expect(screen.getByTestId('shopping-cart-button')).toBeInTheDocument());

    userEvent.click(screen.getByTestId('shopping-cart-button'));

    await waitFor(
      () => expect(screen.getByTestId('shopping-cart-empty-message')).toBeInTheDocument()
    );
  });
});
