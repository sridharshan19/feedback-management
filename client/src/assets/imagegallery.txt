"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState, useEffect } from "react";
import a1 from "../../../../public/images/homepage/a5.jpg";
import a2 from "../../../../public/images/cart/a1.jpg";
import a3 from "../../../../public/images/cart/a2.jpg";
import a4 from "../../../../public/images/cart/a3.jpg";
import a5 from "../../../../public/images/cart/a4.jpg";
import a6 from "../../../../public/images/cart/a5.jpg";
import a7 from "../../../../public/images/cart/a6.jpg";
import Image from "next/image";
import ordersummary from "../../../../components/orderssummary/main"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./cart.css";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useOrderContext } from '../../../../components/cart/OrderContext';
import Loader from "../../../../components/loader/loader";
export default function Cart() {
  const token = localStorage.getItem('token');
const router=useRouter();
  const decodedToken = jwtDecode(token);
 const userId = decodedToken?.id; 
  const [selectedItems, setSelectedItems] = useState([]);
  const [showPurchaseButton, setShowPurchaseButton] = useState(true);
  const [cartdata, setcartdata] = useState([]);
  const [showMobileFooter, setShowMobileFooter] = useState(true);
  const [grandTotal, setGrandTotal] = useState(0);
  const[savings,settotalsavings]=useState(0);
  const images = [a1, a2, a3, a4, a5, a6, a7];
  const { setOrderData } = useOrderContext();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false); 
const[coupunId,setcoupunId]=useState(null)
const[coupundiscount,setcoupundiscount]=useState(0)
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }
  if(selectedItems.length<1){
    toast.info("select anyitems to use the coupun")
    return;
  }
  
    try {

      const response = await axios.post("/api/coupun/validate", { 
        coupun: couponCode,
      });
  
      if (response.data.valid) {
        const coupunprice=response.data.coupon.pricing;
        const id = response.data.couponId;
        setcoupundiscount(coupunprice);
        setcoupunId(id);
    
        toast.success(`The coupon is valid. You have saved ${coupunprice} RS.`);
        setCouponDiscount(response.data.coupon.pricing);  
        if(coupunprice>grandTotal){
          toast.warning(`To apply this coupon, please ensure your total selected price exceeds ${coupunprice} RS.`, {
            autoClose:10000
          });
          return;
        }
        else{
          setGrandTotal(grandTotal-coupunprice);
          toast.success(`You have successfully saved ${coupunprice} RS on your total of ${grandTotal} RS. Purchase now to avail the discount!`,{autoClose:10000});
          setIsCouponApplied(true);

        }
         
      } else {
        toast.error("Invalid coupon code.");
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(itemId)) {
        return prevSelected.filter((id) => id !== itemId);
      } else {
        return [...prevSelected, itemId];
      }
    });
  };
  
  
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    console.log("no token",token,"❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥")
    if (token) {
      console.log("token availabel");
        try {
            const decodedToken = jwtDecode(token);
            const expiry = decodedToken?.exp; 
            
            if (expiry) {
                const currentTime = Math.floor(Date.now() / 1000); 
                
                if (currentTime < expiry) {
               
             console.log("👏👏👏😤😤😤")
                    return true; 
                } else {
                  console.log("jsjvsv sfv fs ")
                    localStorage.removeItem('token'); 
                    return false;
                }
            }
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }
  
};

  const handleAction = async (action,productid) => {
    console.log("Consoling the product id in client side:", productid);
  
    if (isAuthenticated()) {
   
      if (token) {
        try {
       
          console.log("Consoling the user id:", userId);
  
          if (!userId) {
            throw new Error('User ID is missing in the token');
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          toast.error("Something went wrong while decoding the token.");
          return; 
        }
      } else {
        console.error("Token not found.");
        toast.error("You need to be logged in to perform this action.");
        return; 
      }
  
      switch (action) {
        case 'ORDER':
          console.log("Adding to ...");
          try{
            const response=await axios.post("/api/wishlist",{ userId, productId: id, quantity: 2 })
            if(response.status===200){
              router.push("/frontend/cart")
            }
          }
          catch(err){
            console.log("Error adding to wishlist");
          }
          break;
        
  
        
  
        case 'WISHLIST':
          console.log("Adding to wishlist...");
          try{
            console.log("first check")
            
            const response=await axios.post("/api/wishlist",{ userId, productId: productid})
            if(response.status===200){
              console.log("no entrey")
              toast.success("Product added to wishlist");
            }
          }
          catch(err){
            console.log("Error adding to wishlist");
          }
          break;
  
        case 'CART':
                try {
            const response = await axios.post("/api/cart", { userId, productId: productid});
  
            if (response.status === 200) {
              console.log("Item added to cart:", response.data);
              toast.success("Item added to cart");
              // router.push("/frontend/cart") // Uncomment if you want to redirect after adding to cart
            }
          } catch (error) {
            console.error("Error adding item to cart:", error);
            toast.error("Something went wrong. Please try again.");
          }
          break;
        case 'DELETE':
          try{
            const response = await axios.delete("/api/cart", {
              data: {
                userId: userId,
                productId: productid,
              },
            });
            
            
            if(response.status===200){
              toast.success("Item removed from cart");
              const updatedCartData = cartdata.filter(item => item._id !== productid); // Assuming cartData holds the products
              setcartdata(updatedCartData);        
            }
          }catch (error) {
            console.error("Error removing item from wishlist:", error);
            toast.error("Something went wrong. Please try again.");
          }
          break;
          case 'PURCHASENOW':
           
            console.log("Selected products:", selectedItems);
            const selectedCartData = cartdata.filter(item => selectedItems.includes(item._id)); 
            
            console.log("Selected Cart Data:", selectedCartData); // Logs the filtered cart data (full product details)
            if(selectedCartData.length<1){
              toast.info("Please select an item to proceed.");
              return;
            }
            setOrderData({
              items: selectedCartData,  
              total: calculateDiscountedTotal(), 
              savings: savings,
              ...(isCouponApplied && {
                couponId: coupunId,       
                couponPrice: couponDiscount  
              })
            });

          
            // Navigate to the order summary page
            router.push('/frontend/ordersummary');
            break;
           
        

          
      }
    } else {
      toast.info("Oops! You need to sign in first.", {
        position: "top-right", 
        autoClose: 5000, 
        hideProgressBar: true, 
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
  
      setTimeout(() => {
        router.push('/frontend/signup'); 
      }, 3000); 
    }
  };
  const handleQuantityChange = (itemId, action) => {
    setcartdata((prevData) => {
      return prevData.map((item) => {
        if (item._id === itemId) {
          const availableStock = item.stock; 
          let updatedQuantity = item.quantity;
  
          if (action === "increment") {
            if (availableStock === 0) {
              toast.warning("Sorry, this item is out of stock!");
              return item; // Exit early.
            }
  
            if (updatedQuantity < availableStock) {
              updatedQuantity += 1;
            } else {
              toast.warning(`Sorry, Only ${item.stock} left`);
            }
          } else if (action === "decrement" && updatedQuantity > 1) {
            updatedQuantity -= 1;
          }
  
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      });
    });
  };
  
  
  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;
      let totalsavings=0;
      cartdata.forEach((item) => {
        if (selectedItems.includes(item._id)) {
          total += item.price * item.quantity;
          totalsavings+=item.originalprice-item.price;
        }
      });
      setGrandTotal(total);
      settotalsavings(totalsavings)
      
    };

    calculateTotal();
  }, [cartdata, selectedItems]);

  const calculateDiscountedTotal = () => {
    return grandTotal + 30;
  };
  const showdetails = (productid) => {
    router.push(`/frontend/productdetails/${productid}`);
  };
  useEffect(() => {
    const handleScroll = () => {
      const priceSection = document.getElementById("price-section");
      const mobileFooter = document.getElementById("mobile-footer");
      if (priceSection && mobileFooter) {
        const priceSectionTop = priceSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (priceSectionTop <= windowHeight) {
          setShowMobileFooter(false);
        } else {
          setShowMobileFooter(true);
        }
      }
    };
  
    const getAllData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken?.id;
          console.log("Consoling the user id:", userId);

          if (!userId) {
            throw new Error('User ID is missing in the token');
          }

          const response = await axios.get(`/api/cart?userId=${userId}`);
          console.log("Cart data:", response.data.cart);

          const cartItems = response.data.cart.map(item => ({
            ...item,
            quantity: item.quantity || 1,
          }));

          setcartdata(cartItems);
          console.log(cartItems);
          
        } catch (error) {
          console.error("Error decoding token:", error);
        }
        setLoading(false)
      } else {
        console.error("Token not found.");
      }
    };

    getAllData();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Cart Heading */}
      <div className="flex flex-col md:flex-row justify-between p-4 pt-4">
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-160px)] space-y-4 pr-4">
       
        {loading ? (
  <Loader />
) : (
  cartdata.map((item, index) => (
    <div
      key={item._id}
      className="flex items-center border rounded-md p-4 bg-gray-50 sm:h-28 md:h-32 lg:h-40 overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {item.stock && item.stock > 0 ? (
        <input
          type="checkbox"
          className="custom-checkbox text-blue-500 absolute top-2 right-2"
          checked={selectedItems.includes(item._id)}
          onChange={() => handleCheckboxChange(item._id, item.price)}
        />
      ) : (
        <div className="absolute top-2 right-2 text-red-600 font-bold text-xs sm:text-sm">
          No Stock
        </div>
      )}
      <img
        src={item.images[0].url}
        alt={`product-${item.name}`}
        className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-md shadow-md"
      />
      <div className="ml-4 flex-1">
      <h2
      className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 hover:text-blue-500"
      onClick={() => showdetails(item._id)} 
    >
      {item.name}
    </h2>

        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mt-1">
          SIZE: {item.sizes}
        </p>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600">
          COUNT: {item.quantity}
        </p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
            {item.price * item.quantity} RS
          </p>
          <p className="text-blue-800 font-bold text-xs sm:text-sm md:text-base lg:text-lg line-through text-gray-500">
            {item.originalprice * item.quantity} RS
          </p>
        </div>
        <p className="text-green-800 font-bold text-xs sm:text-sm md:text-base lg:text-lg mt-1">
          SAVED {item.originalprice - item.price} RS
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-4 ml-4">
        <button
          onClick={() => handleQuantityChange(item._id, "decrement")}
          className="text-gray-700 hover:text-blue-500 text-xl transform hover:scale-110 transition-all duration-300"
        >
          <i className="fas fa-minus-circle"></i>
        </button>
        <span className="text-lg font-semibold text-gray-800">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item._id, "increment")}
          className="text-gray-700 hover:text-blue-500 text-xl transform hover:scale-110 transition-all duration-300"
          disabled={item.stock < item.quantity}
        >
          <i className="fas fa-plus-circle"></i>
        </button>
      </div>

      {/* Icons Section */}
      <div className="flex flex-col items-center space-y-2 ml-4">
        <button
          className="text-gray-700 hover:text-blue-500 text-xl sm:text-2xl transform hover:scale-110 transition-all duration-300"
          onClick={() => handleAction("WISHLIST", item._id)}
        >
          <i className="fas fa-heart"></i>
        </button>
        <button
          className="text-gray-700 hover:text-red-500 text-xl sm:text-2xl transform hover:scale-110 transition-all duration-300"
          onClick={() => handleAction("DELETE", item._id)}
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  ))
)}

        </div>

        {/* Price Section */}
        <div className="mt-6 md:mt-0 md:ml-8 md:w-1/3 space-y-6">
          {/* Coupon Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
        <h3 className="font-bold text-lg sm:text-xl lg:text-2xl">Apply Coupon</h3>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)} // Update coupon code
          className="border p-2 rounded-md w-full text-sm sm:text-base lg:text-lg mt-2"
          placeholder="Enter coupon code"
        />
        <button
          onClick={handleApplyCoupon} // Call the function on button click
          className="bg-black mt-5 text-white px-6 py-2 rounded-md w-full text-sm sm:text-base lg:text-lg hover:bg-gray-800 transition-all duration-300"
        >
          APPLY COUPON
        </button>
      </div>

          {/* Price Section */}
          <div
            id="price-section"
            className="bg-gray-50 p-6 rounded-lg text-sm sm:text-base lg:text-lg shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between">
              <span>Total MRP</span>
              <span>{grandTotal} RS</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-500">0 RS</span>
            </div>
            <div className="flex justify-between">
              <span>Coupon Discount</span>
              <span className="text-green-500">0 RS</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>30 RS</span>
            </div>
            <div className="flex justify-between font-bold text-lg sm:text-xl lg:text-2xl mt-2">
              <span>Grand Total</span>
              <span>{calculateDiscountedTotal()} RS</span>
            </div>
            <p className="text-green-500 text-sm sm:text-base lg:text-lg mt-1">
              SAVINGS {savings} RS
            </p>
          </div>

          {/* Purchase Button */}
          <div className="mt-6">
            <button className="bg-black text-white px-8 py-3 rounded-md w-full text-lg font-bold sm:text-xl lg:text-2xl hover:bg-gray-800 transition-all duration-300" onClick={()=>handleAction('PURCHASENOW',5)}>
              PURCHASE NOW
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-specific buttons */}
      <div
        className={`block md:hidden fixed bottom-4 left-4 w-full px-6 ${showMobileFooter ? "" : "hidden"}`}
      >
        <button className="bg-black text-white px-6 py-3 rounded-md w-full text-lg font-bold sm:text-xl">
          PURCHASE
        </button>
      </div>

      {/* Fixed Price Section for Mobile */}
      <div
        id="mobile-footer"
        className={`block md:hidden fixed bottom-0 left-0 w-full bg-gray-50 p-4 z-20 ${showMobileFooter ? "" : "hidden"}`}
      >
        <div className="flex justify-between">
          <span>Total MRP</span>
          <span>{grandTotal} RS</span>
        </div>
        <div className="flex justify-between">
          <span>Grand Total</span>
          <span>{calculateDiscountedTotal()} RS</span>
        </div>
        <button className="bg-black text-white px-8 py-3 rounded-md w-full text-lg font-bold sm:text-xl mt-4">
          PURCHASE
        </button>
      </div>
      <ToastContainer />

    </div>
  );
}
