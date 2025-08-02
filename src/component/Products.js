import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Instagram from './Instagram';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import './Products.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';





const Product = () => {
  const sliderRef = useRef(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
const [totalPages, setTotalPages] = useState(1);
const [showModal, setShowModal] = useState(false);
const [modalImage, setModalImage] = useState('');
const [showFilterDrawer, setShowFilterDrawer] = useState(false);
const location = useLocation(); 
const navigate = useNavigate();
const sliderRefDesktop = useRef(null);
const sliderRefMobile = useRef(null);
const [availableSizes, setAvailableSizes] = useState([]);
const [availableColors, setAvailableColors] = useState([]);

 useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}, []);
useEffect(() => {
  const fetchFilterMeta = async () => {
    try {
      const res = await axios.get(`${API}/api/filters`);
      setAvailableSizes(res.data.sizes || []);
      setAvailableColors(res.data.colors || []);
    } catch (err) {
      console.error("Failed to fetch filter metadata", err);
    }
  };

  fetchFilterMeta();
}, []);

useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';
  const sizes = queryParams.get('sizes')?.split(',') || [];
  const colors = queryParams.get('colors')?.split(',') || [];
  const min = parseInt(queryParams.get('minPrice') || '0');
  const max = parseInt(queryParams.get('maxPrice') || '10000');
  const pg = parseInt(queryParams.get('page') || '1');
  const search = queryParams.get('q') || '';
   const label = queryParams.get('label') || '';


  setSelectedCategory(category);
  setSelectedSizes(sizes);
  setSelectedColors(colors);
  setMinPrice(min);
  setMaxPrice(max);
  setPage(pg);
  setSearchTerm(search);
   setSelectedLabel(label);  // Add this line
}, [location.search]);


  
  const API = process.env.REACT_APP_APIURL;

const fetchFilteredProducts = async () => {
  try {
if (searchTerm) {
  const query = [`q=${encodeURIComponent(searchTerm)}`];

  if (minPrice > 0 || maxPrice < 10000) {
    query.push(`minPrice=${minPrice}&maxPrice=${maxPrice}`);
  }
  if (selectedSizes.length > 0) {
    query.push(`sizes=${selectedSizes.join(',')}`);
  }
  if (selectedColors.length > 0) {
    query.push(`colors=${selectedColors.join(',')}`);
  }

  const res = await axios.get(`${API}/api/search?${query.join('&')}`);
  setProducts(res.data);
  setTotalPages(1); // no pagination on search (optional)
}
 else {
      // 🧠 Build query for regular filter
      const query = [];

      if (selectedCategory) query.push(`category=${selectedCategory}`);
      if (selectedSizes.length > 0) query.push(`sizes=${selectedSizes.join(',')}`);
      if (selectedColors.length > 0) query.push(`colors=${selectedColors.join(',')}`);
      if (selectedLabel) query.push(`label=${selectedLabel}`);
      if (minPrice > 0 || maxPrice < 10000) {
        query.push(`minPrice=${minPrice}&maxPrice=${maxPrice}`);
      }

      query.push(`page=${page}`);
      query.push(`limit=9`);

      const queryString = `?${query.join('&')}`;
      const fullUrl = `${API}/api/products${queryString}`;

      const res = await axios.get(fullUrl);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    }
  } catch (err) {
    console.error('Failed to fetch products', err);
  }
};



  useEffect(() => {
    if (sliderRef.current && !sliderRef.current.noUiSlider) {
      noUiSlider.create(sliderRef.current, {
        start: [minPrice, maxPrice],
        connect: true,
        range: {
          min: 0,
          max: 10000,
        },
        format: {
          to: (value) => Math.round(value),
          from: (value) => Number(value),
        },
      });

      sliderRef.current.noUiSlider.on('update', (values) => {
        setMinPrice(values[0]);
        setMaxPrice(values[1]);
      });
    }
  }, []);

  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, selectedSizes, selectedColors, selectedLabel, minPrice, maxPrice, page,  searchTerm]);
  // Sync filter/pagination state to the URL
useEffect(() => {
  const query = new URLSearchParams();

  if (searchTerm) query.set('q', searchTerm);
  if (selectedCategory) query.set('category', selectedCategory);
  if (selectedSizes.length > 0) query.set('sizes', selectedSizes.join(','));
  if (selectedColors.length > 0) query.set('colors', selectedColors.join(','));
  if (selectedLabel) query.set('label', selectedLabel);
  if (minPrice > 0 || maxPrice < 10000) {
    query.set('minPrice', minPrice);
    query.set('maxPrice', maxPrice);
  }

  query.set('page', page);

  navigate({ search: query.toString() }, { replace: true });
}, [
  selectedCategory,
  selectedSizes,
  selectedColors,
  selectedLabel,
  minPrice,
  maxPrice,
  page,
  searchTerm,
]);





  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };
useEffect(() => {
  const initSlider = (ref) => {
    if (ref.current && !ref.current.noUiSlider) {
      noUiSlider.create(ref.current, {
        start: [minPrice, maxPrice],
        connect: true,
        range: { min: 0, max: 10000 },
        format: {
          to: value => Math.round(value),
          from: value => Number(value),
        },
      });

      ref.current.noUiSlider.on('update', (values) => {
        setMinPrice(values[0]);
        setMaxPrice(values[1]);
      });
    }
  };

  // always initialize desktop on load
  initSlider(sliderRefDesktop);
}, []);
useEffect(() => {
  if (showFilterDrawer) {
    const timer = setTimeout(() => {
      if (sliderRefMobile.current && !sliderRefMobile.current.noUiSlider) {
        noUiSlider.create(sliderRefMobile.current, {
          start: [minPrice, maxPrice],
          connect: true,
          range: { min: 0, max: 10000 },
          format: {
            to: value => Math.round(value),
            from: value => Number(value),
          },
        });

        sliderRefMobile.current.noUiSlider.on('update', (values) => {
          setMinPrice(values[0]);
          setMaxPrice(values[1]);
        });
      }
    }, 100); // slight delay ensures DOM is ready

    return () => clearTimeout(timer);
  }
}, [showFilterDrawer]);
useEffect(() => {
  if (!showFilterDrawer && sliderRefMobile.current?.noUiSlider) {
    sliderRefMobile.current.noUiSlider.destroy();
  }
}, [showFilterDrawer]);



  return (
    <>
    {showFilterDrawer && (
  <div className="filter-drawer-overlay" onClick={() => setShowFilterDrawer(false)}>
    <div className="filter-drawer" onClick={(e) => e.stopPropagation()}>
      <button className="close-filter" onClick={() => setShowFilterDrawer(false)}>×</button>
      {/* Reuse the same sidebar JSX here */}
   <div className="shop__sidebar-mobile">
                {/* Categories */}
                <div className="sidebar__categories">
                  <div className="section-title"><h4>Categories</h4></div>
                  <div className="categories__accordion">
                    <div className="accordion" id="accordionExample">
                     {["Women", "Men", "Kids", "Accessories", "Handbags"].map((cat) => {
  const catKey = cat.toLowerCase();
  const isActive = selectedCategory === catKey;

  return (
    <div className="card" key={cat}>
      <div className="card-heading">
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
             setSearchTerm('');
            setSelectedCategory(prev =>
              prev === catKey ? '' : catKey // Toggle selection
            );
          }}
          style={{ color: isActive ? '#ca1515' : 'inherit', fontWeight: isActive ? 'bold' : 'bold' }}
        >
          {cat}
        </a>
      </div>
    </div>
  );
})}

                    </div>
                  </div>
                </div>

                {/* Price Filter */}
               <div className="sidebar__filter">
                  <div className="section-title"><h4>Shop by price</h4></div>
                  <div className="filter-range-wrap">
                   <div className="price-range" ref={sliderRefMobile}></div>
                    <div className="range-slider">
                      <div className="price-input">
                  <p>Price: <strong>₹{minPrice} - ₹{maxPrice}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size Filter */}
                <div className="sidebar__sizes">

                  <div className="section-title"><h4>Shop by size</h4></div>
                  <div className="size__list">
{availableSizes.slice(0, 8).map((size) => (
  <label htmlFor={size} key={size}>
    {size}
    <input
      type="checkbox"
      id={size}
      checked={selectedSizes.includes(size)}
      onChange={() => handleSizeChange(size)}
    />
    <span className="checkmark"></span>
  </label>
))}


                  </div>
                </div>

                {/* Color Filter */}
               <div className="sidebar__color">
                  <div className="section-title"><h4>Shop by color</h4></div>
                  <div className="size__list color__list">
               {availableColors.slice(0, 8).map((color) => (
  <label htmlFor={color} key={color}>
    {color}
    <input
      type="checkbox"
      id={color}
      checked={selectedColors.includes(color)}
      onChange={() => handleColorChange(color)}
    />
    <span className="checkmark"></span>
  </label>
))}
                  </div>
                </div>
              </div>
    </div>
  </div>
)}
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <Link to="/"><i className="fa fa-home"></i> Home</Link>
                <span>Shop</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="shop spad">
        <div className="container">
          <button
  className="filter-toggle d-lg-none"
  onClick={() => setShowFilterDrawer(true)}
>
  <i className="fa fa-filter"></i> Filters
</button>
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-3 d-none d-lg-block">

              <div className="shop__sidebar-desktop">
                {/* Categories */}
                <div className="sidebar__categories">
                  <div className="section-title"><h4>Categories</h4></div>
                  <div className="categories__accordion">
                    <div className="accordion" id="accordionExample">
                     {["Women", "Men", "Kids", "Accessories", "Handbags"].map((cat) => {
  const catKey = cat.toLowerCase();
  const isActive = selectedCategory === catKey;

  return (
    <div className="card" key={cat}>
      <div className="card-heading">
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
             setSearchTerm('');
            setSelectedCategory(prev =>
              prev === catKey ? '' : catKey // Toggle selection
            );
          }}
          style={{ color: isActive ? '#ca1515' : 'inherit', fontWeight: isActive ? 'bold' : 'bold' }}
        >
          {cat}
        </a>
      </div>
    </div>
  );
})}

                    </div>
                  </div>
                </div>

                {/* Price Filter */}
                <div className="sidebar__filter">
                  <div className="section-title"><h4>Shop by price</h4></div>
                  <div className="filter-range-wrap">
                   <div className="price-range" ref={sliderRefDesktop}></div>
                    <div className="range-slider">
                      <div className="price-input">
                  <p>Price: <strong>₹{minPrice} - ₹{maxPrice}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size Filter */}
                <div className="sidebar__sizes">
                  <div className="section-title"><h4>Shop by size</h4></div>
                  <div className="size__list">
{availableSizes.slice(0, 8).map((size) => (
  <label htmlFor={size} key={size}>
    {size}
    <input
      type="checkbox"
      id={size}
      checked={selectedSizes.includes(size)}
      onChange={() => handleSizeChange(size)}
    />
    <span className="checkmark"></span>
  </label>
))}


                  </div>
                </div>

                {/* Color Filter */}
                <div className="sidebar__color">
                  <div className="section-title"><h4>Shop by color</h4></div>
                  <div className="size__list color__list">
               {availableColors.slice(0, 8).map((color) => (
  <label htmlFor={color} key={color}>
    {color}
    <input
      type="checkbox"
      id={color}
      checked={selectedColors.includes(color)}
      onChange={() => handleColorChange(color)}
    />
    <span className="checkmark"></span>
  </label>
))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9 col-md-9">
             <div className="row">
                {products.map((product, index) => (
                <div className="col-lg-4 col-md-6" key={index}>

                    <div className={`product__item ${product.label === "Sale" ? "sale" : ""}`}>
                      <Link to={`/proddetail/${product._id}`}>
                        <div
                          className="product__item__pic set-bg"
                          style={{ backgroundImage: `url(/uploads/${product.mainImage})` }}
                        >
                          {(product.quantity <= 1 || product.label === 'Out Of Stock') && (
                            <div className="label stockout stockblue">Out Of Stock</div>
                          )}
                          {(product.quantity > 1 && product.label && product.label !== 'Out Of Stock') && (
                            <div className={`label ${product.label === 'Sale' ? 'sale' : 'new'}`}>
                              {product.label}
                            </div>
                          )}
                          <ul className="product__hover">
                            <li>
                          <a href="#!" onClick={(e) => {
  e.preventDefault();
  setModalImage(`/uploads/${product.mainImage}`);
  setShowModal(true);
}}>
  <span className="arrow_expand"></span>
</a>

                            </li>
                            {product.quantity > 1 && product.label !== 'Out Of Stock' && (
                              <li><a href="#"><span className="icon_bag_alt"></span></a></li>
                            )}
                          </ul>
                        </div>
                      </Link>
                      <div className="product__item__text">
                       <h6>
  <Link to={`/proddetail/${product._id}`}>
    {product.title.length > 35 ? `${product.title.substring(0, 35)}...` : product.title}
  </Link>
</h6>

                        <div className="rating">
                          {[...Array(5)].map((_, i) => (
                            <i className="fa fa-star" key={i}></i>
                          ))}
                        </div>
                      <div className="product__price">
  ₹{product.discountedPrice.toFixed(1)}
  {product.originalPrice > product.discountedPrice && (
    <span>₹{product.originalPrice.toFixed(1)}</span>
  )}
</div>
                      </div>
                    </div>
                  </div>
                ))}
{(totalPages > 1 || page > 1) && (
  <div className="col-lg-12 text-center">
   <div className="pagination__option">

      {/* Previous button */}
      {page > 1 && (
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
            setPage((prev) => Math.max(prev - 1, 1));
          }}
        >
          <i className="fa fa-angle-left"></i>
        </a>
      )}

      {/* Page numbers */}
      {[...Array(totalPages)].map((_, i) => (
        <a
          href="#!"
          key={i}
          onClick={(e) => {
            e.preventDefault();
            setPage(i + 1);
          }}
          className={page === i + 1 ? 'active' : ''}
        >
          {i + 1}
        </a>
      ))}

      {/* Next button */}
      {page < totalPages && (
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
            setPage((prev) => Math.min(prev + 1, totalPages));
          }}
        >
          <i className="fa fa-angle-right"></i>
        </a>
      )}
    </div>
  </div>
)}


              </div>
            </div>
          </div>
        </div>
      </section>
      <Instagram />
        {showModal && (
  <div className="image-modal-overlay" onClick={() => setShowModal(false)}>
    <div className="image-modal-content"onClick={(e) => e.stopPropagation()}>
      <img src={modalImage} alt="Zoomed" />
      <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
    </div>
  </div>
)}
    </>
  );
};

export default Product;
