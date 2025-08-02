import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import axios from 'axios';
import Instagram from './Instagram';
import AdminSidebar from './Adminsidebar';
import './Manageproducts.css';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode'; 
import Adminsidebar from './Adminsidebar';
import { decryptToken } from '../utils/securetoken';

const API = process.env.REACT_APP_APIURL;
const iconStyle = { marginRight: '8px', color: '#ca1515' };

const Manageproducts = () => {
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [expandedId, setExpandedId] = useState(null); // Changed from expanded (global) to per product
  const [isEditing, setIsEditing] = useState(false);
const [editingProductId, setEditingProductId] = useState(null);
 const [adminName, setAdminName] = useState("Admin User");

  const [productData, setProductData] = useState({
    title: '',
    brand: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    promoCode: '',
    promoDiscountPercent: '',
    stockStatus: 'In Stock',
    quantity: '',
    colors: '',
    sizes: '',
    label: '',
    specifications: '',
    mainImage: null,
    otherImages: [null, null, null, null],
     previewImage: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

useEffect(() => {
  const encrypted = sessionStorage.getItem('adminToken');
  const token = encrypted ? decryptToken(encrypted) : null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      setAdminName(decoded.adminname || "Admin User");
    } catch (err) {
      console.error("Invalid token");
    }
  }
}, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/admincategories`);
      setCategories(res.data);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  const fetchProductsByCategory = async (cat) => {
      setProducts([]); 
    try {
      const res = await axios.get(`${API}/api/products/category/${cat}`);
      setProducts(res.data);
    } catch {
      console.log('Failed to fetch products in this category');
    }
  };

  const handleProductChange = (e) => {
    setProductData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleAddProduct = async (e) => {
  e.preventDefault();

  if (!productData.mainImage) {
    toast.error("Main image is required");
    return;
  }

  const formData = new FormData();
  formData.append("title", productData.title);
  formData.append("brand", productData.brand);
  formData.append("category", category);
  formData.append("description", productData.description);
  formData.append("originalPrice", Number(productData.originalPrice));
formData.append("discountedPrice", Number(productData.discountedPrice));
  formData.append("promoCode", productData.promoCode);
 formData.append("promoDiscountPercent", Number(productData.promoDiscountPercent));
  formData.append("rating", 0);
  formData.append("numReviews", 0);
  formData.append("stockStatus", productData.stockStatus);
  formData.append("quantity", Number(productData.quantity));
  formData.append("colors", JSON.stringify(productData.colors.split(',').map(c => c.trim())));
  formData.append("sizes", JSON.stringify(productData.sizes.split(',').map(s => s.trim())));
  formData.append("label", productData.label);
  formData.append("specifications", productData.specifications);
  formData.append("mainImage", productData.mainImage);

  productData.otherImages.forEach((img) => {
    if (img) formData.append("otherImages", img);
  });

  try {
    const res = await axios.post(`${API}/api/products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Product added successfully!");

    // Reset form
    setProductData({
      title: '',
      brand: '',
      description: '',
      originalPrice: '',
      discountedPrice: '',
      promoCode: '',
      promoDiscountPercent: '',
      stockStatus: 'In Stock',
      quantity: '',
      colors: '',
      sizes: '',
      label: '',
      specifications: '',
      mainImage: null,
      otherImages: [null, null, null, null],
    });

      await fetchProductsByCategory(category);
  } catch (err) {
    console.error(err);
    toast.error("Failed to add product");
  }
};

const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this product?')) return;
  try {
  await axios.delete(`${API}/api/deleteproduct/${id}`);
    toast.success('Product deleted');
    fetchProductsByCategory(category); // refresh list
  } catch {
    toast.error('Failed to delete product');
  }
};
const startEditing = (prod) => {
  setIsEditing(true);
  setEditingProductId(prod._id);

  setCategory(prod.category); // set current category to product category

  setProductData({
    title: prod.title || '',
    brand: prod.brand || '',
    description: prod.description || '',
    originalPrice: prod.originalPrice || '',
    discountedPrice: prod.discountedPrice || '',
    promoCode: prod.promoCode || '',
    promoDiscountPercent: prod.promoDiscountPercent || '',
    stockStatus: prod.stockStatus || 'In Stock',
    quantity: prod.quantity || '',
    colors: Array.isArray(prod.colors) ? prod.colors.join(', ') : prod.colors || '',
    sizes: Array.isArray(prod.sizes) ? prod.sizes.join(', ') : prod.sizes || '',
    label: prod.label || '',
    specifications: prod.specifications || '',
    mainImage: null, // reset to null, user can upload new image or keep existing
    otherImages: [null, null, null, null], // reset additional images, 
     previewImage: prod.mainImage || '',
  });
};
const handleUpdateSubmit = async (e) => {
  e.preventDefault();

  if (!editingProductId) {
    toast.error("No product selected for update.");
    return;
  }

  const formData = new FormData();
  formData.append("title", productData.title);
  formData.append("brand", productData.brand);
  formData.append("category", category);
  formData.append("description", productData.description);
  formData.append("originalPrice", Number(productData.originalPrice));
  formData.append("discountedPrice", Number(productData.discountedPrice));
  formData.append("promoCode", productData.promoCode);
  formData.append("promoDiscountPercent", Number(productData.promoDiscountPercent));
  formData.append("stockStatus", productData.stockStatus);
  formData.append("quantity", Number(productData.quantity));
  formData.append("colors", JSON.stringify(productData.colors.split(',').map(c => c.trim())));
  formData.append("sizes", JSON.stringify(productData.sizes.split(',').map(s => s.trim())));
  formData.append("label", productData.label);
  formData.append("specifications", productData.specifications);

  if (productData.mainImage) {
    formData.append("mainImage", productData.mainImage);
  }

  productData.otherImages.forEach((img) => {
    if (img) formData.append("otherImages", img);
  });

  try {
    await axios.put(`${API}/api/products/${editingProductId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Product updated successfully!");
    setIsEditing(false);
    setEditingProductId(null);

    // Reset form
    setProductData({
      title: '',
      brand: '',
      description: '',
      originalPrice: '',
      discountedPrice: '',
      promoCode: '',
      promoDiscountPercent: '',
      stockStatus: 'In Stock',
      quantity: '',
      colors: '',
      sizes: '',
      label: '',
      specifications: '',
      mainImage: null,
      otherImages: [null, null, null, null],
    });

    fetchProductsByCategory(category);

  } catch (err) {
    console.error(err);
    toast.error("Failed to update product");
  }
};
 const handleLogout = () => {
      sessionStorage.removeItem('adminToken');
      toast.success("Logged out");
      window.location.href = "/adminlogin";
    };
useEffect(() => {
  fetchCategories();
}, []);

useEffect(() => {
  if (category) {
    fetchProductsByCategory(category);
  }
}, [category]);




  return (
  <div className="admin-layout">
  <Adminsidebar adminName={adminName} handleLogout={handleLogout} />
  <div className="admin-main">

        {/* Form Section */}
        <section className="contact spad" style={{ paddingTop: '0px', marginTop: '0px' }}>
          <div className="container">
            <div className="d-flex justify-content-center">
              <div className="col-lg-8">
                <div className="contact__form bg-light p-4 rounded shadow">
                  <h5 className="text-center mb-4">MANAGE PRODUCTS</h5>

                  <select
                    name="category"
                    value={category}
                    disabled={isEditing}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      backgroundColor: '#fff',
                      color: '#333',
                      marginBottom: '16px',
                      width: '100%'
                      
                    }}
                  >
                    <option value="">Select Product Category</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>

                <form onSubmit={isEditing ? handleUpdateSubmit : handleAddProduct} encType="multipart/form-data">


                    <input type="text" name="title" placeholder="Product Title" value={productData.title} onChange={handleProductChange} required />
                    <input type="text" name="brand" placeholder="Brand" value={productData.brand} onChange={handleProductChange} />
                    <textarea name="description" placeholder="Description" value={productData.description} onChange={handleProductChange} required />

                   <input
  type="text"
  name="originalPrice"
  placeholder="Original Price"
  value={productData.originalPrice}
  onChange={handleProductChange}
  required
/>
                   <input
  type="text"
  name="discountedPrice"
  placeholder="Discounted Price"
  value={productData.discountedPrice}
  onChange={handleProductChange}
  required
/>

                    <input type="text" name="promoCode" placeholder="Promo Code" value={productData.promoCode} onChange={handleProductChange} />
                    <input
  type="text"
  name="promoDiscountPercent"
  placeholder="Promo Discount (%)"
  value={productData.promoDiscountPercent}
  onChange={handleProductChange}
/>
                    <select
                      name="stockStatus"
                      value={productData.stockStatus}
                      onChange={handleProductChange}
                      required
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '16px',
                        fontFamily: 'inherit',
                        backgroundColor: '#fff',
                        color: '#333',
                        marginBottom: '16px',
                        width: '100%'
                      }}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>

                  <input
  type="text"
  name="quantity"
  placeholder="Quantity"
  value={productData.quantity}
  onChange={handleProductChange}
  required
/>
                    <input type="text" name="colors" placeholder="Colors (comma separated)" value={productData.colors} onChange={handleProductChange} />
                    <input type="text" name="sizes" placeholder="Sizes (comma separated)" value={productData.sizes} onChange={handleProductChange} />
                    <input type="text" name="label" placeholder="Label (e.g., New, Sale)" value={productData.label} onChange={handleProductChange} />
                    <input type="text" name="specifications" placeholder="Specifications" value={productData.specifications} onChange={handleProductChange} />

                    <input
  type="file"
  accept="image/*"
  name="mainImage"
  onChange={(e) => setProductData((prev) => ({ ...prev, mainImage: e.target.files[0] }))}
  {...(!isEditing ? { required: true } : {})}
/>
{isEditing && productData.previewImage && (
  <img
    src={`${API}/uploads/${productData.previewImage}`}
    alt="Current"
    className="img-thumbnail mb-2"
    style={{ maxHeight: '150px', objectFit: 'cover' }}
  />
)}



                    {[0, 1, 2, 3].map((i) => (
                      <input
                        key={i}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const newImages = [...productData.otherImages];
                          newImages[i] = e.target.files[0];
                          setProductData((prev) => ({ ...prev, otherImages: newImages }));
                        }}
                      />
                    ))}

<button type="submit" className="site-btn w-100 mt-3 mb-mobile-gap">
  {isEditing ? "Update Product" : "Add Product"}
</button>

                    {isEditing && (
  <button
    type="button"
    className="btn btn-secondary w-100 mt-2"
    onClick={() => {
      setIsEditing(false);
      setEditingProductId(null);
      setProductData({
        title: '',
        brand: '',
        description: '',
        originalPrice: '',
        discountedPrice: '',
        promoCode: '',
        promoDiscountPercent: '',
        stockStatus: 'In Stock',
        quantity: '',
        colors: '',
        sizes: '',
        label: '',
        specifications: '',
        mainImage: null,
        otherImages: [null, null, null, null],
      });
    }}
  >
    Cancel Edit
  </button>
)}

                  </form>
                </div>
              </div>
            </div>

{/* Product Display Section */}
<div className="mt-5">
  <div className="admin-contact__content">
    <h5 className="text-center admin-product-title">PRODUCTS IN CATEGORY</h5>
    {products.length === 0 ? (
      <p className="text-center">No products found in this category.</p>
    ) : (
   <div className="row no-gutters">
        {products.map((prod) => (
          <div className="col-sm-6 col-md-4 mb-4" key={prod._id}>
            <div className="card h-100 shadow-sm border-0 admin-product-card">
              <Link to={`/adminproduct/${prod._id}`} className="text-decoration-none text-dark">
              <img
                src={`${API}/uploads/${prod.mainImage}`}
                alt={prod.title}
                className="card-img-top"
              />
              </Link>
              <div className="admin-product-card-body">
                  <Link to={`/adminproduct/${prod._id}`} className="text-decoration-none text-dark">
                <h6 className="admin-product-name">{prod.title}</h6>
                </Link>

                {/* Styled Prices */}
    <p className="admin-product-price-group">
  <span className="admin-discounted-price">₹{prod.discountedPrice}</span>
  <span className="admin-original-price">₹{prod.originalPrice}</span>
</p>


<p className="admin-product-stock">
  <span className="admin-product-label">Stock:</span>
  <span className={prod.stockStatus === 'In Stock' ? 'stock-in' : 'stock-out'}>
    {prod.stockStatus}
  </span>
</p>




              {expandedId !== prod._id ? (
  <div className="d-flex flex-wrap gap-2">
    <div className="admin-product-buttons">
    <button
      className="btn btn-sm btn-outline-dark"
      onClick={() => setExpandedId(prod._id)}
    >
      Read More
    </button>

   <button
  className="btn btn-sm btn-outline-dark"
  onClick={() => startEditing(prod)} // changed from handleUpdate
>
  Update
</button>

    <button
      className="btn btn-sm btn-outline-danger"
      onClick={() => handleDelete(prod._id)}
    >
      Delete
    </button>
    </div>
  </div>
) : (

                  <>
                    <div className="mt-2 admin-product-details">
                      {prod.brand && <p><strong>Brand:</strong> {prod.brand}</p>}
                      <p><strong>Quantity:</strong> {prod.quantity}</p>
                      {prod.label && <p><strong>Label:</strong> {prod.label}</p>}
                      {prod.colors && <p><strong>Colors:</strong> {Array.isArray(prod.colors) ? prod.colors.join(', ') : prod.colors}</p>}
                      {prod.sizes && <p><strong>Sizes:</strong> {Array.isArray(prod.sizes) ? prod.sizes.join(', ') : prod.sizes}</p>}
                      {prod.promoCode && (
                        <p>
                          <strong>Promo:</strong> {prod.promoCode} ({prod.promoDiscountPercent}% off)
                        </p>
                      )}
                      {prod.specifications && <p><strong>Specs:</strong> {prod.specifications}</p>}
                      <p><strong>Description:</strong><br />{prod.description}</p>
                    </div>
                    <button className="btn btn-sm btn-danger mt-2" onClick={() => setExpandedId(null)}>
                      Show Less
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>



          </div>
        </section>
      </div>
    </div>
  );
};

export default Manageproducts;
