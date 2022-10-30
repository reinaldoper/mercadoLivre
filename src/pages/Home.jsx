import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, CardImg, Input } from 'reactstrap';
import { getCategories, getProductsFromCategoryAndQuery } from '../services/api';
import Header from './Header';
import styles from './Home.module.css';

const Error = 'Nenhum produto foi encontrado';
export default class Home extends Component {
  state = {
    requiret: [],
    inputText: '',
    wasFetchedInInput: [],
    productCart: [],
    categories: [],
    msg: '',
  };

  componentDidMount = () => {
    this.getLocalStorage();
    this.showCategories();
  };

  getLocalStorage = () => {
    const locale = JSON.parse(localStorage.getItem('item'));
    if (locale === null) return null;
    this.setState({ productCart: [...locale] });
  };

  showCategories = async () => {
    const result = await getCategories();
    this.setState({
      requiret: result,
    });
  };

  handleChange = ({ target }) => {
    // desestruturação do target de event, ex: event.target
    const { value } = target;
    this.setState({ inputText: value });
  };

  addToCart = ({ price, title, thumbnail, id,
    available_quantity: availableQuantity }) => {
    const { productCart } = this.state;
    const valor = 1;
    const cart = productCart;
    localStorage.setItem(
      'item',
      JSON.stringify([...cart, {
        price, title, thumbnail, id, valor, availableQuantity }]),
    );
    this.setState({
      productCart: [...cart, {
        price, title, thumbnail, id, valor, availableQuantity }],
    });
  };

  frete = (product) => {
    if (product.shipping.free_shipping) {
      return (
        <p data-testid="free-shipping">
          <p>Frete grátis</p>
        </p>
      );
    }
  }

  createProducts = (state) => {
    const createCategories = state.map((product) => (
      <div key={ product.id } data-testid="product" className={ styles.products }>
        <Link
          to={ `/product-details/${product.id}` }
          data-testid="product-detail-link"
        >
          <p className={ styles.title }>{ product.title }</p>
          <CardImg
            src={ product.thumbnail }
            alt={ product.img }
            className={ styles.img }
          />
          <p>
            Preço:
            { product.price }
          </p>
          {this.frete(product)}
        </Link>
        <Button
          data-testid="product-add-to-cart"
          type="button"
          color="primary"
          onClick={ () => this.addToCart(product) }
        >
          Adicionar ao carrinho
        </Button>
      </div>
    ));
    return createCategories;
  };

  handleClick = async (e) => {
    e.preventDefault();
    const { inputText } = this.state;
    const resultFromAPI = await getProductsFromCategoryAndQuery(
      undefined,
      inputText,
    );
    const { results } = resultFromAPI;
    const r = results.length === 0;
    if (r) {
      return this.setState({ msg: Error }, () => {
        const { msg } = this.state;
        if (msg.length > 1) return this.setState({ wasFetchedInInput: [] });
      });
    }
    if (!r) {
      return this.setState({
        wasFetchedInInput: [...results],
        categories: [],
        msg: '',
      });
    }
  };

  categoriOnClick = async (id) => {
    const resultFromAPI = await getProductsFromCategoryAndQuery(id, undefined);
    const { results } = resultFromAPI;
    const r = results.length === 0;
    if (r) {
      return this.setState({ msg: Error }, () => {
        const { msg } = this.state;
        if (msg.length > 1) return this.setState({ categories: [] });
      });
    }
    if (!r) {
      return this.setState({
        categories: [...results],
        wasFetchedInInput: [],
        msg: '',
      });
    }
  };

  render() {
    const { requiret, wasFetchedInInput, categories, msg, productCart } = this.state;
    const search = this.createProducts(wasFetchedInInput);
    const categoriesProducts = this.createProducts(categories);
    const list = requiret.map((item) => (
      <Button
        data-testid="category"
        className={ styles.categButon }
        key={ item.id }
        type="button"
        style={ { backgroundColor: '#D0DDD7', color: 'black' } }
        onClick={ () => this.categoriOnClick(item.id) }
      >
        { item.name }
      </Button>
    ));
    return (
      <div>
        <Header carr={ productCart } />
        <div className={ styles.geral }>
          <div>
            <h4>Categorias:</h4>
            <div className={ styles.categoria }>{list}</div>
          </div>
          <div>
            <form className={ styles.formInput }>
              <Input
                type="text"
                onChange={ this.handleChange }
                placeholder="Digite o nome do produto!"
              />
              <Button
                data-testid="query-button"
                type="submit"
                onClick={ this.handleClick }
              >
                Pesquisar
              </Button>
            </form>
            <div className={ styles.search }>
              {search}
              {categoriesProducts}
              {msg.length > 1 ? <p>Nenhum produto foi encontrado</p> : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
