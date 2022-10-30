import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import Header from './Header';
import styles from './Home.module.css';

class ShoppingCart extends Component {
  state = {
    productsAdded: [],
    productCart: [],
  };

  componentWillUnmount() {
    const { productsAdded } = this.state;
    localStorage.setItem('item', JSON.stringify(productsAdded));
  }

  componentDidMount = () => {
    this.getLocalStorage();
    this.getProducts();
  };

  getLocalStorage = () => {
    const locale = JSON.parse(localStorage.getItem('item'));
    if (locale === null) return null;
    this.setState({ productCart: [...locale] });
  };

  getProducts = () => {
    const array = [];
    const product = JSON.parse(localStorage.getItem('item'));
    if (product === null) return null;
    product.forEach((item) => {
      array.push(item);
      this.setState({
        productsAdded: [...array],
      });
    });
  };

  addClick = (ids, availableQuantity) => {
    const { productsAdded } = this.state;
    const result = productsAdded.map((item) => {
      if (item.id === ids && item.valor < availableQuantity) {
        item.valor += 1;
      }
      return item;
    });
    this.setState({
      productsAdded: result,
    });
  }

  removeClick = (ids) => {
    const { productsAdded } = this.state;
    const result = productsAdded.map((item) => {
      if (item.id === ids && item.valor > 1) {
        item.valor -= 1;
      }
      return item;
    });
    this.setState({
      productsAdded: result,
    });
  }

  removeItemClick = (ids) => {
    const { productsAdded } = this.state;
    const result = productsAdded.filter((item) => item.id !== ids);
    localStorage.setItem('item', JSON.stringify(result));
    this.setState({ productsAdded: result });
  }

  createProducts = (state) => {
    const createCategories = state.map((product, index) => (
      <div key={ index } data-testid="product" className={ styles.products }>
        <p data-testid="shopping-cart-product-name">{product.title}</p>
        <img src={ product.thumbnail } alt={ product.img } />
        <p>
          Preço:
          {product.price}
        </p>
        <p data-testid="shopping-cart-product-quantity">
          Quantidade:
          {product.valor}
        </p>
        <p>
          Estoque:
          {product.availableQuantity}
        </p>
        <Button
          data-testid="product-increase-quantity"
          type="button"
          color="primary"
          onClick={ () => this.addClick(product.id, product.availableQuantity) }
        >
          +
        </Button>
        <Button
          data-testid="product-decrease-quantity"
          type="button"
          onClick={ () => this.removeClick(product.id) }
        >
          -
        </Button>
        <Button
          data-testid="remove-product"
          type="button"
          color="warning"
          onClick={ () => this.removeItemClick(product.id) }
        >
          Remove
        </Button>
      </div>
    ));
    return createCategories;
  };

  render() {
    const { productsAdded, productCart } = this.state;
    const cartItems = this.createProducts(productsAdded);
    return (
      <div>
        <Header carr={ productCart } />
        { productsAdded.length > 0 ? <div className={ styles.search }>{ cartItems }</div>
          : <p data-testid="shopping-cart-empty-message">Seu carrinho está vazio</p> }
        <Button
          type="button"
          color="success"
        >
          <Link
            to={ { pathname: '/checkout', state: { product: productsAdded } } }
            data-testid="checkout-products"
            style={ { textDecoration: 'none', color: 'black' } }
          >
            Comprar
          </Link>
        </Button>
      </div>
    );
  }
}
export default ShoppingCart;
