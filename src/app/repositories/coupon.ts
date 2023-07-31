export interface Coupon {
    description: string;
    discountTypeId: number;
    discount: number;
    discountPercentage: number;
}



const couponData = {
    "Coupon": [
      {
        "description": "Fixed amount",
        "discountTypeId": 1,
        "discount": 50,
        "discountPercentage": 0
      },
      {
        "description": "Percentage discount",
        "discountTypeId": 2,
        "discount": 0,
        "discountPercentage": 10
      }
    ]
  };
  
  export default couponData;