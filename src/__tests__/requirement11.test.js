import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import mockedQueryResult from '../__mocks__/query';
import mockFetch from '../__mocks__/mockFetch';
import mockLocalStorage from '../__mocks__/localStorage';
import mockDetails from '../__mocks__/details';
import userEvent from '@testing-library/user-event';

describe(`11 - Avalie e comente acerca de um produto em sua tela de exibição detalhada`, () => {

  beforeEach(()=> jest.spyOn(global, 'fetch').mockImplementation(mockFetch));

  it('Avalia se é possível realizar uma avaliação na tela de detalhes de um produto', async () => {
    const evaluationEmail = `teste@trybe.com`;
    const evaluationContent = `Esta é uma avaliação sobre o primeiro produto realizada na tela de detalhe.`;
   
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

    userEvent.type(
      screen.getByTestId('product-detail-email'),
      evaluationEmail
    );

    expect(screen.getByTestId('product-detail-email')).toHaveValue(evaluationEmail);
   
    userEvent.type(
      screen.getByTestId('product-detail-evaluation'),
      evaluationContent
    );

    expect(screen.getByTestId('product-detail-evaluation')).toHaveValue(evaluationContent);

    for (let index = 1; index <= 5; index += 1) {
      expect(screen.getByTestId(`${index}-rating`)).toBeVisible();
    };
    userEvent.click(screen.getByTestId('3-rating'));

    expect(screen.getByTestId('submit-review-btn')).toBeVisible();
    userEvent.click(screen.getByTestId('submit-review-btn'));
    
    expect(screen.getByTestId('product-detail-email')).toHaveValue('');
    expect(screen.getByTestId('product-detail-evaluation')).toHaveValue('');

    await waitFor(
      () => {
        expect(screen.getByText(evaluationEmail)).toBeVisible();
        expect(screen.getByText(evaluationContent)).toBeVisible();
      }
    );

  });

  it('Avalia se o formulário é validado corretamente', async () => {
    const evaluationEmailError = 'trybe'
    const fullEmail = 'trybe@trybe.com'
    render(<App />);

    userEvent.type(
      screen.getByTestId('product-detail-email'),
      evaluationEmailError
    );

    expect(screen.getByTestId('product-detail-email')).toHaveValue(evaluationEmailError);

    expect(screen.getByTestId('submit-review-btn')).toBeVisible();
    userEvent.click(screen.getByTestId('submit-review-btn'));

    await waitFor(() => expect(screen.getByTestId('error-msg')).toHaveTextContent('Campos inválidos'));

    userEvent.type(
      screen.getByTestId('product-detail-email'),
      fullEmail
    );

    userEvent.click(screen.getByTestId('submit-review-btn'));

    await waitFor(() => expect(screen.getByTestId('error-msg')).toHaveTextContent('Campos inválidos'));

    userEvent.click(screen.getByTestId('3-rating'));
    userEvent.click(screen.getByTestId('submit-review-btn'));
    await waitFor(() => expect(screen.queryByTestId('error-msg')).not.toBeInTheDocument());
  })

  it('Avalia se a avaliação continua após recarregar a pagina', async () => {
    localStorage.clear();
    localStorage.setItem(mockDetails.id, JSON.stringify(mockLocalStorage));

    render(<App />);
    
    await waitFor(() => expect(screen.getAllByTestId('review-card-email').length).toEqual(2));
    expect(screen.getAllByTestId('review-card-rating').length).toEqual(2);
    expect(screen.getAllByTestId('review-card-evaluation').length).toEqual(2);
  });

  it('Avalia se a avaliação feita para um produto não aparece na tela de detalhes de outro produto', async () => {
    window.history.pushState(null, document.title, '/');

    const evaluationEmail = `teste@trybe.com`;
    const evaluationContent = "Esta é uma avaliação sobre o primeiro produto realizada na tela de detalhe.";

    render(<App />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    
    userEvent.click(screen.getAllByTestId('category')[0]);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    
    userEvent.click(screen.getAllByTestId('product-detail-link')[1]);

    expect(screen.queryByText(evaluationEmail)).toBeNull();
    expect(screen.queryByText(evaluationContent)).toBeNull();
  });
});
