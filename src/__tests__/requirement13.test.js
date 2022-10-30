import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import mockFetch from '../__mocks__/mockFetch';
import userEvent from '@testing-library/user-event';

describe(`13 - Mostre junto ao ícone do carrinho a quantidade de produtos dentro dele, em todas as telas em que ele aparece`, () => {

  afterEach(() => {
    global.fetch.mockClear();
  });

  beforeEach(()=> jest.spyOn(global, 'fetch').mockImplementation(mockFetch));
  it('Avalia se a quantidade de produtos no carrinho da tela de listagem é renderizada corretamente', async () => {

    render(<App />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    userEvent.click(screen.getAllByTestId('category')[0]);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    userEvent.click(screen.getAllByTestId('product-add-to-cart')[0]);
    userEvent.click(screen.getAllByTestId('product-add-to-cart')[1]);
    expect(screen.getByTestId('shopping-cart-size')).toHaveTextContent('2');
  });

  it('Avalia se a quantidade de produtos no carrinho da tela de detalhes é renderizada corretamente', async () => {

    render(<App />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    userEvent.click(screen.getAllByTestId('category')[0]);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    userEvent.click(screen.getAllByTestId('product-add-to-cart')[0]);
    userEvent.click(screen.getAllByTestId('product-add-to-cart')[1]);
    userEvent.click(screen.getAllByTestId('product-detail-link')[0]);
    expect(screen.getByTestId('shopping-cart-size')).toHaveTextContent('4');
  });
});
