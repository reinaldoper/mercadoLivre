import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import mockedQueryResult from '../__mocks__/query';
import mockFetch from '../__mocks__/mockFetch';
import userEvent from '@testing-library/user-event';

describe(`9 - Adicione um produto ao carrinho a partir de sua tela de exibição detalhada`, () => {
  beforeEach(()=> jest.spyOn(global, 'fetch').mockImplementation(mockFetch));
  it('Adiciona um produto ao carrinho a partir da sua tela de detalhes', async () => {

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
    userEvent.click(screen.getByTestId('product-detail-add-to-cart'));
    userEvent.click(screen.getByTestId('shopping-cart-button'));
    await waitFor(() => expect(screen.getAllByTestId('shopping-cart-product-name')));
    expect(screen.getAllByTestId('shopping-cart-product-name')[0]).toHaveTextContent(
      mockedQueryResult.results[0].title,
    );
    expect(
      screen.getAllByTestId('shopping-cart-product-quantity')[0],
    ).toHaveTextContent('1');
  });
});
