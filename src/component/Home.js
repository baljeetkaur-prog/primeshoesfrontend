import React from 'react';
import Categories from './Categories';
import Productsection from './Productsection';
import Banner from './Banner';
import Trends from './Trends';
import Discountsection from './Discountsection';
import Servicesection from './Servicesection';
import Instagram from './Instagram';

const Home = () => {
  return (
    <>
      <Categories />
      <Productsection />
      <Banner />
      <Trends />
      <Discountsection />
      <Servicesection />
      <Instagram />
    </>
  );
};

export default Home;
