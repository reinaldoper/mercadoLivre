import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import mockedQueryResult from '../__mocks__/query';
import mockFetch from '../__mocks__/mockFetch';
import userEvent from '@testing-library/user-event';

describe(`14 - Limite a quantidade de produtos adicionados ao carrinho pela quantidade disponível em estoque`, () => {
  beforeEach(()=> jest.spyOn(global, 'fetch').mockImplementation(mockFetch));
  it(`Avalia se não é possível adicionar ao carrinho mais produtos do que o disponível em estoque`, async () => {

    render(<App />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    userEvent.click(screen.getAllByTestId('category')[0]);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    userEvent.click(screen.getAllByTestId('product-add-to-cart')[1]);
    userEvent.click(screen.getByTestId('shopping-cart-button'));
    await waitFor(() => expect(screen.getAllByTestId('shopping-cart-product-name')));
    expect(screen.getAllByTestId('shopping-cart-product-name')[0]).toHaveTextContent(
      mockedQueryResult.results[1].title,
    );
    expect(screen.getAllByTestId('shopping-cart-product-quantity')[0]).toHaveTextContent(
      '1',
    );
    userEvent.click(screen.getAllByTestId('product-increase-quantity')[0]);
    userEvent.click(screen.getAllByTestId('product-increase-quantity')[0]);
    userEvent.click(screen.getAllByTestId('product-increase-quantity')[0]);
    userEvent.click(screen.getAllByTestId('product-increase-quantity')[0]);
    userEvent.click(screen.getAllByTestId('product-increase-quantity')[0]);
    userEvent.click(screen.getAllByTestId('product-increase-quantity')[0]);
    userEvent.click(screen.getAllByTestId('product-increase-quantity')[0]);

    expect(screen.getAllByTestId('shopping-cart-product-quantity')[0]).toHaveTextContent(
      mockedQueryResult.results[1].available_quantity,
    );
  });
});
