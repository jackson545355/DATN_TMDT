// import Navbar from "./Components/Navbar/Navbar"
import Header from "./Components/Header/Header"
// import women_banner from "./Components/Assets/banner_women.png";
// import men_banner from "./Components/Assets/banner_mens.png";
// import kid_banner from "./Components/Assets/banner_kids.png";
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
//import NewsLetter from "./Components/NewsLetter/NewsLetter";
// import SuppliersByRegion from "./Components/SuppliersByRegion/SuppliersByRegion";
// import Services from "./Components/Services/Services";
// import CategoriesSection from "./Components/CategoriesSection/CategoriesSection";
// import SupplierRequestSection from "./Components/SupplierRequestSection/SupplierRequestSection";
// import HeaderSection from "./Components/HeaderSection/HeaderSection";
// import RecommendedItems from "./Components/RecommendedItems/RecommendedItems";
//import Offers from "./Components/Offers/Offers";
import FilterSection from "./Components/FilterSection/FilterSection";
//import ShopCategory from "./Pages/ShopCategory";
import Shop from "./Pages/Shop";
import ProfilePage from "./Pages/Profile"
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
// import WebMain from "./Pages/Web_main";
// import WebListView from "./Pages/Web_listview";
import WebProduct from "./Pages/Web_Product";
import MyOrder from "./Components/MyOrder/MyOrder";
import React, { useState } from "react";
import Checkout from "./Components/Checkout/Checkout";
import Thankyou from "./Components/Thankyou/Thankyou";
import Momo from "./Components/Momo/Momo";
//import Product from "./Pages/Web_Product";
// import FilterSection from "./Components/FilterSection/FilterSection"
// Tạo hàm kiểm tra token
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('auth-token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || 'path-to-default-user-icon.png');

  const updateAvatar = (newAvatar) => {
    setAvatar(newAvatar);
    localStorage.setItem('avatar', newAvatar);
  };

  return (
    <div>
      <Router>
        <Header avatar={avatar}/>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Shop gender="all" />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage updateAvatar={updateAvatar}/></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/filterSection" element={<FilterSection/>}/>
          <Route path='/product' element={<WebProduct />}>
            <Route path=':productId' element={<WebProduct />} />
          </Route>
          <Route path='/myorder' element={<MyOrder />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thankyou" element={<Thankyou />} />
          <Route path="/momo" element={<Momo />} />
          <Route path="/productlist" element={<FilterSection />} />
        </Routes>
        <Footer />
      </Router>

    </div>
  );
}

export default App;
