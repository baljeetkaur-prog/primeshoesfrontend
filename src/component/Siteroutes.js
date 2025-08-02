import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Product from './Products';
import Productdetail from './Productdetail';
import Cart from './Cart';
import Checkout from './Checkout';
import Orders from './Orders';
import Thankyoupage from './Thankyoupage';
import Rateprod from './Rateprod';
import Contact from './Contact';
import Changepass from './Changepass';
import About from './About';
import FAQ from './FAQ';
import Adminregister from './Adminregister';
import Adminlogin from './Adminlogin';
import Admindashboard from './Admindashboard';
import Adminproddetail from './Adminproddetail';
import Manageproducts from './Manageproducts';
import Adminorders from './Adminorders';
import Adminsales from './Adminsales';
import Adminusers from './Adminusers';
import Adminlowstock from './Adminlowstock';
import Addnewadmin from './Addnewadmin';
import Adminchangepass from './Adminchangepass';
import Adminprivateroutes from './Adminprivateroutes';
import Adminreturns from './Adminreturns';
import Privacypolicy from './Privacypolicy';
import Cancelrefundpolicy from './Cancelrefundpolicy';
import Pricingpolicy from './Pricingpolicy';
import Termsandconditions from './Termsandconditions';

const SiteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<Product/>}/>
     <Route path="/proddetail/:id" element={<Productdetail />} />
     <Route path="/cart" element={<Cart/>}/>
     <Route path="/checkout" element={<Checkout/>}/>
     <Route path="/orders" element={<Orders/>}/>
     <Route path="/thankyou" element={<Thankyoupage/>}/>
     <Route path="/rate/:id" element={<Rateprod/>}/>
     <Route path="/contact" element={<Contact/>}/>
     <Route path='/changepassword' element={<Changepass/>}/>
     <Route path="/about" element={<About/>}/>
     <Route path="/faq" element={<FAQ/>}/>
     <Route path="/privacypolicy" element={<Privacypolicy/>}/>
     <Route path="/cancelrefundpolicy" element={<Cancelrefundpolicy/>}/>
     <Route path="/pricingpolicy" element={<Pricingpolicy/>}/>
     <Route path="/termsconditions" element={<Termsandconditions/>}/>
     <Route path="adminregister" element={<Adminregister/>}/>
     <Route path="/adminlogin" element={<Adminlogin/>}/>
    <Route
  path="/admindashboard"
  element={
    <Adminprivateroutes>
      <Admindashboard />
    </Adminprivateroutes>
  }
/>
     <Route path="/adminproduct/:id" element={<Adminprivateroutes><Adminproddetail /></Adminprivateroutes>} />
     <Route path="/manageproducts" element={<Adminprivateroutes><Manageproducts/></Adminprivateroutes>}/>
     <Route path="/adminorders" element={<Adminprivateroutes><Adminorders/></Adminprivateroutes>}/>
     <Route path="/adminsales" element={<Adminprivateroutes><Adminsales/></Adminprivateroutes>}/>
     <Route path="/adminusers" element={<Adminprivateroutes><Adminusers/></Adminprivateroutes>}/>
     <Route path="/adminlowstock" element={<Adminprivateroutes><Adminlowstock/></Adminprivateroutes>}/>
     <Route path="/addadmin" element={<Adminprivateroutes><Addnewadmin/></Adminprivateroutes>}/>
     <Route path="/adminchangepass" element={<Adminprivateroutes><Adminchangepass/></Adminprivateroutes>}/>
      <Route path="/adminreturnsandcancel" element={<Adminprivateroutes><Adminreturns/></Adminprivateroutes>}/>

    </Routes>
  );
};

export default SiteRoutes;
