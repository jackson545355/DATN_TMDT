import React from 'react'
import Offers from '../Components/Offers/Offers'
// import NewsLetter from '../Components/NewsLetter/NewsLetter'
import HeaderSection from '../Components/HeaderSection/HeaderSection'
// import Services from '../Components/Services/Services'
import RecommendedItems from '../Components/RecommendedItems/RecommendedItems'
// import SuppliersByRegion from '../Components/SuppliersByRegion/SuppliersByRegion'
// import SupplierRequestSection from '../Components/SupplierRequestSection/SupplierRequestSection'
import CategoriesSection from '../Components/CategoriesSection/CategoriesSection'


const Shop = () => {
  // const [newcollection, setNewCollection] = useState([]);

  // const fetchInfo = () => { 
  //   fetch('http://localhost:4000/newcollections') 
  //           .then((res) => res.json()) 
  //           .then((data) => setNewCollection(data))
  //   }
  //   useEffect(() => {
  //     fetchInfo();
  //   }, [])


  return (
    <div>
      <HeaderSection/>
      
      <Offers/>
      <CategoriesSection/>
      {/* <SupplierRequestSection/> */}
      <RecommendedItems/>
      {/* <Services/> */}
      {/* <SuppliersByRegion/>   */}
      {/* <NewsLetter/> */}
    </div>
  )
}

export default Shop
