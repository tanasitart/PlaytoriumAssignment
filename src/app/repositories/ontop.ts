export interface Ontop {
    description: string;
    discountTypeId: number;
    discount: number;
    discountPercentage: number;
    limitation : number;
}


const ontopData = {"Ontop": [
    {
      "description": "Percentage discount by item category",
      "discountTypeId": 3,
      "discount": 0,
      "discountPercentage": 15,
	"limitation" : 0
    },
    {
      "description": "Discount by points",
      "discountTypeId": 4,
      "discount": 0,
      "discountPercentage": 0,
	"limitation" : 20
    }
  ]};

  export default ontopData ;