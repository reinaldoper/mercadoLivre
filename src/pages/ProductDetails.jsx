import React, { Component } from 'react';
import { Button, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import Header from './Header';
import styles from './ProductDetails.module.css';

class ProductDetails extends Component {
    state = {
      product: [],
      productCart: [],
      inputEmail: '',
      inputArea: '',
      inputRadios: false,
      localStores: [],
      msg: '',
    }

    componentDidMount() {
      const { match } = this.props;
      const { params } = match;
      const { id } = params;
      this.getLocalStorage();
      return this.getProductDetails(id);
    }

    getLocalStorage = () => {
      const locale = JSON.parse(localStorage.getItem('item'));
      if (locale === null) return null;
      this.setState({ productCart: [...locale] });
    };

    getProductDetails = async (PRODUCT_ID) => {
      const response = await fetch(`https://api.mercadolibre.com/items/${PRODUCT_ID}`);
      const object = await response.json();
      return (
        this.setState({
          product: [object],
        })
      );
    }

  renderiza = (ids) => {
    const result = JSON.parse(localStorage.getItem(ids));
    if (result === null) return null;
    return result.map((item, index) => (
      <div key={ index } className="mostra">
        <p data-testid="review-card-email">
          {item.inputEmail}
        </p>
        <p data-testid="review-card-rating">
          {item.inputRadios}
        </p>
        <p data-testid="review-card-evaluation">
          {item.inputArea}
        </p>
      </div>
    ));
  }

    addToCart = ({ price, title, thumbnail, id,
      available_quantity: availableQuantity }) => {
      const { productCart } = this.state;
      const valor = 1;
      const cart = productCart;
      localStorage.setItem('item', JSON
        .stringify([...cart, {
          price, title, thumbnail, id, valor, availableQuantity }]));
      this.setState({ productCart: [...cart, {
        price, title, thumbnail, id, valor, availableQuantity }] });
    }

  butonClick = (event) => {
    event.preventDefault();
    const { history } = this.props;
    history.push('/shopping-cart');
  }

  excluirValue = () => {
    const { localStores } = this.state;
    if (localStores.length > 0) {
      this.setState({
        inputEmail: '',
        inputArea: '',
        inputRadios: false,
      });
    }
  }

  add = (ids) => {
    const { inputEmail, inputRadios, inputArea, localStores } = this.state;
    const verify = inputRadios === '1' || inputRadios === '2' || inputRadios === '3'
      || inputRadios === '4' || inputRadios === '5';
    if (verify) {
      const cart = localStores;
      localStorage.setItem(ids, JSON
        .stringify([...cart, { inputEmail, inputRadios, inputArea }]));
      return this.setState({
        msg: '',
        localStores: [...JSON.parse(localStorage.getItem(ids))],
      }, () => this.excluirValue());
    }
    if (inputEmail.length === 0 || inputArea.length === 0) {
      return this.setState({
        msg: 'Campos inválidos',
      });
    }
    if (inputEmail.length > 0 || inputArea.length > 0) {
      const cart = localStores;
      localStorage.setItem(ids, JSON
        .stringify([...cart, { inputEmail, inputRadios, inputArea }]));
      return this.setState({
        msg: '',
        localStores: [...JSON.parse(localStorage.getItem(ids))],
      }, () => this.excluirValue());
    }
    this.renderiza(ids);
  }

  handleChange = ({ target }) => { // desestruturação do target de event, ex: event.target
    const { value, name, id } = target;
    if (name === 'email') return this.setState({ inputEmail: value });
    if (name === 'textarea') return this.setState({ inputArea: value });
    if (name === 'radios') {
      return this.setState({
        inputRadios: id,
      });
    }
  };

  render() {
    const { product, inputEmail, inputArea, msg, inputRadios, productCart } = this.state;
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    const num1 = 3;
    const num2 = 4;
    const num3 = 5;
    const ind = [1, 2, num1, num2, num3];
    const array = [];
    ind.forEach((index) => (
      array.push(
        <input
          type="radio"
          name="radios"
          value={ inputRadios }
          id={ `${index}` }
          onChange={ this.handleChange }
          data-testid={ `${index}-rating` }
        />,
      )
    ));
    const productItem = product.map((item) => (
      <div key={ item.id } data-testid="product" className={ styles.products }>
        <p data-testid="product-detail-name">{item.title}</p>
        <img
          data-testid="product-detail-image"
          src={ item.thumbnail }
          alt={ item.img }
        />
        <p data-testid="product-detail-price">
          Preço:
          { item.price }
        </p>
        <div className={ styles.comprar }>
          <Button
            type="submit"
            data-testid="shopping-cart-button"
            onClick={ this.butonClick }
          >
            Carrinho
          </Button>
        </div>
        <div>
          <Button
            type="submit"
            data-testid="product-detail-add-to-cart"
            onClick={ () => this.addToCart(item) }
          >
            Add Carr
          </Button>
        </div>
      </div>));
    return (
      <div>
        <Header carr={ productCart } />
        {productItem}
        <form className={ styles.coment }>
          Email:
          <Input
            type="email"
            name="email"
            className={ styles.buton }
            value={ inputEmail }
            required
            data-testid="product-detail-email"
            onChange={ this.handleChange }
          />
          <label htmlFor="radios">
            <div>
              Avaliação:
              {array}
            </div>
          </label>
          Comentário:
          <textarea
            rows="5"
            className={ styles.area }
            cols="10"
            name="textarea"
            required
            value={ inputArea }
            data-testid="product-detail-evaluation"
            onChange={ this.handleChange }
          />
          <Button
            type="button"
            data-testid="submit-review-btn"
            className={ styles.buton }
            onClick={ () => this.add(id) }
          >
            Avaliação
          </Button>
        </form>
        {msg.length > 0 ? <p data-testid="error-msg">Campos inválidos</p> : null}
        {this.renderiza(id)}
      </div>
    );
  }
}
export default ProductDetails;
ProductDetails.propTypes = {
  id: PropTypes.string.isRequired,
  match: PropTypes.string.isRequired,
};
ProductDetails.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
