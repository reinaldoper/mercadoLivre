import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import mockedQueryResult from '../__mocks__/query';
import mockFetch from '../__mocks__/mockFetch';
import mockedCategoriesResult from '../__mocks__/categories';
import userEvent from '@testing-library/user-event';

describe(`12 - Finalize a compra vendo um resumo dela, preenchendo os seus dados e escolhendo a forma de pagamento`, () => {

  beforeEach(()=> jest.spyOn(global, 'fetch').mockImplementation(mockFetch));

  it('Avalia se, na página de checkout, existe um resumo do pedido', async () => {
    render(<App />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    userEvent.click(screen.getAllByTestId('category')[0]);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    userEvent.click(screen.getAllByTestId('product-add-to-cart')[0]);
    userEvent.click(screen.getAllByTestId('product-add-to-cart')[1]);
  
    userEvent.click(screen.getByTestId('shopping-cart-button'));
    await waitFor(() => expect(screen.getAllByTestId('shopping-cart-product-name')));

    expect(screen.getAllByTestId('shopping-cart-product-name')[0]).toHaveTextContent(
      mockedQueryResult.results[0].title,
    );
    expect(screen.getAllByTestId('shopping-cart-product-name')[1]).toHaveTextContent(
      mockedQueryResult.results[1].title,
    );

    userEvent.click(screen.getByTestId('checkout-products'));
    await waitFor(() => expect(screen.getByText(mockedQueryResult.results[0].title)));
  
    expect(screen.getByText(mockedQueryResult.results[0].title)).toHaveTextContent(
      mockedQueryResult.results[0].title,
    );
    expect(screen.getByText(mockedQueryResult.results[1].title)).toHaveTextContent(
      mockedQueryResult.results[1].title,
    );
  })
  
  it('Avalia se todos os campos do formulário precisam ser preenchidos', async () => {
    const fullName = 'my full name';
    const email = 'my@email.com';
    const cpf = '12345678900';
    const phone = '99999999999';
    const cep = '99999999';
    const address = 'my address is where I live';
    render(<App />);
    userEvent.type(screen.getByTestId('checkout-fullname'), fullName);
    userEvent.type(screen.getByTestId('checkout-email'), email);
    userEvent.type(screen.getByTestId('checkout-cpf'), cpf);
    userEvent.type(screen.getByTestId('checkout-phone'), phone);
    userEvent.type(screen.getByTestId('checkout-cep'), cep);

    expect(screen.getByTestId('checkout-fullname')).toHaveValue(fullName);
    expect(screen.getByTestId('checkout-email')).toHaveValue(email);
    expect(screen.getByTestId('checkout-cpf')).toHaveValue(cpf);
    expect(screen.getByTestId('checkout-phone')).toHaveValue(phone);
    expect(screen.getByTestId('checkout-cep')).toHaveValue(cep);

    userEvent.click(screen.getByTestId('checkout-btn'));

    await waitFor(() => expect(screen.getByTestId('error-msg')).toBeInTheDocument());
    expect(screen.getByTestId('error-msg')).toHaveTextContent('Campos inválidos');

    userEvent.type(screen.getByTestId('checkout-address'), address);
    expect(screen.getByTestId('checkout-address')).toHaveValue(address);

    userEvent.click(screen.getByTestId('checkout-btn'));
    await waitFor(() => expect(screen.getByTestId('error-msg')).toBeInTheDocument());
    expect(screen.getByTestId('error-msg')).toHaveTextContent('Campos inválidos');

    userEvent.click(screen.getByTestId('master-payment'));

    userEvent.click(screen.getByTestId('checkout-btn'));
    await waitFor(() => expect(screen.queryByTestId('error-msg')).not.toBeInTheDocument());
  });

  it('Avalia se, após a compra ser finalizada, é redirecionado para a página inicial', async () => {
    render(<App />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.getAllByTestId('category').length).toEqual(
      mockedCategoriesResult.length,
    );
  })

  it('Avalia se, ao entrar na página do carrinho, não há nenhum produto', async () => {
    render(<App />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    userEvent.click(screen.getByTestId('shopping-cart-button'));
    await waitFor(() => screen.getByTestId('shopping-cart-empty-message'));
    expect(screen.getByTestId('shopping-cart-empty-message')).toHaveTextContent(
      'Seu carrinho está vazio',
    );
  })
});
