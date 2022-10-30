import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import carrinho from '../trolley_91101.png';
import home from '../3441648.png';
import styles from './Header.module.css';

export default class Header extends Component {
  render() {
    const { carr } = this.props;
    console.log(carr);
    return (
      <header className={ styles.primary }>
        <h1>Frontend Online Store</h1>
        <div>
          <Link
            to="/"
          >
            <img src={ home } alt="Home" className={ styles.carrinho } />
          </Link>
          <Link
            to="/shopping-cart"
            data-testid="shopping-cart-button"
            style={ { textDecoration: 'none', color: 'black' } }
          >
            <img src={ carrinho } alt="Carrinho" className={ styles.carrinho } />
            { carr.length }
          </Link>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  carr: PropTypes.string.isRequired,
};
