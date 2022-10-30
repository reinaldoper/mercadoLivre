import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';
import Header from './Header';
import styles from './ProductDetails.module.css';
import logo from '../visa.png';
import master from '../master.png';
import elo from '../elo.png';
import ticket from '../ticket.png';

export default class Checkout extends Component {
  state = {
    name: '',
    inputEmail: '',
    inputCpf: '',
    inputFone: '',
    inputCep: '',
    inputEndereco: '',
    inputRadios: '',
    msg: '',
    productCart: [],
  }

  componentDidMount() {
    this.getLocalStorage();
  }

  getLocalStorage = () => {
    const locale = JSON.parse(localStorage.getItem('item'));
    if (locale === null) return null;
    this.setState({ productCart: [...locale] });
  };

  handleChange = ({ target }) => { // desestruturação do target de event, ex: event.target
    const { value, name, id } = target;
    if (name === 'name') return this.setState({ name: value });
    if (name === 'email') return this.setState({ inputEmail: value });
    if (name === 'cpf') return this.setState({ inputCpf: value });
    if (name === 'cep') return this.setState({ inputCep: value });
    if (name === 'fone') return this.setState({ inputFone: value });
    if (name === 'endereco') return this.setState({ inputEndereco: value });
    if (name === 'label') return this.setState({ inputRadios: id });
  };

  save = () => {
    const {
      name,
      inputEmail,
      inputCpf,
      inputFone,
      inputCep,
      inputEndereco,
      inputRadios,
    } = this.state;
    const a = name.length === 0 || inputEmail.length === 0
      || inputCpf.length === 0 || inputFone.length === 0
      || inputCep.length === 0 || inputEndereco.length === 0 || inputRadios.length === 0;
    if (a) return this.setState({ msg: 'Campos inválidos' });
    if (!a) {
      this.setState({ msg: '' });
      localStorage.removeItem('item');
      const { history } = this.props;
      history.push('/');
    }
  }

  render() {
    const { history } = this.props;
    const { location } = history;
    const { state } = location;
    const { product } = state;
    const { msg, productCart } = this.state;
    const result = product.map((item, index) => (
      <div key={ index }>
        <p>{item.title}</p>
      </div>
    ));
    return (
      <div>
        <p>
          <Header carr={ productCart } />
          {result}
        </p>
        <form className={ styles.coment }>
          Nome:
          <Input
            type="text"
            data-testid="checkout-fullname"
            className={ styles.buton }
            name="name"
            onChange={ this.handleChange }
          />
          Email:
          <Input
            type="email"
            data-testid="checkout-email"
            className={ styles.buton }
            name="email"
            onChange={ this.handleChange }
          />
          Cpf:
          <Input
            type="text"
            data-testid="checkout-cpf"
            className={ styles.buton }
            name="cpf"
            onChange={ this.handleChange }
          />
          Fone:
          <Input
            type="text"
            data-testid="checkout-phone"
            className={ styles.buton }
            name="fone"
            onChange={ this.handleChange }
          />
          Cep:
          <Input
            type="text"
            data-testid="checkout-cep"
            className={ styles.buton }
            name="cep"
            onChange={ this.handleChange }
          />
          Endereço:
          <Input
            type="text"
            data-testid="checkout-address"
            className={ styles.buton }
            name="endereco"
            onChange={ this.handleChange }
          />
          Formas de pagamento:
          <label htmlFor="label" className={ styles.check }>
            <br />
            <input
              type="radio"
              name="label"
              id="ticket-payment"
              data-testid="ticket-payment"
              onChange={ this.handleChange }
            />
            <img src={ ticket } alt="ticket" className={ styles.img } />
            <br />
            <input
              type="radio"
              name="label"
              id="visa-payment"
              data-testid="visa-payment"
              onChange={ this.handleChange }
            />
            <img src={ logo } alt="visa" className={ styles.img } />
            <br />
            <input
              type="radio"
              name="label"
              id="master-payment"
              data-testid="master-payment"
              onChange={ this.handleChange }
            />
            <img src={ master } alt="master" className={ styles.img } />
            <br />
            <input
              type="radio"
              name="label"
              id="elo-payment"
              data-testid="elo-payment"
              onChange={ this.handleChange }
            />
            <img src={ elo } alt="elo" className={ styles.img } />
            <br />
          </label>
          <Button
            type="button"
            data-testid="checkout-btn"
            className={ styles.buton }
            onClick={ this.save }
          >
            Salvar
          </Button>
        </form>
        {msg.length > 0 ? <p data-testid="error-msg">Campos inválidos</p> : null}
      </div>
    );
  }
}

Checkout.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
};
