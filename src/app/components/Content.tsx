"use client";
import React, { useState, useEffect,useRef } from 'react';
import couponData, { Coupon } from '../repositories/coupon';
import ontopData, { Ontop } from '../repositories/ontop';
import useOnClickOutside from '../hooks/useOnClickOutside';




const Content = () => {


    const [showPopup,setShowPopup] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(popupRef, () => handleClosePopup());

    const handleClosePopup = () => {
    setShowPopup(false);
        window.location.reload();
      };
    const [userInputCode, setUserInputCode] = useState("");
    const [couponCodeSuccess, setCouponCodeSuccess] = useState(false);
    const [seasonalCountDiscount, setSeasonalCountDiscount] = useState(0);
    const [seasonalDiscount , setSeasonalDiscount] = useState(0);

    const [coupon, setCoupon] = useState<Coupon>({ description: "", discountTypeId: 0, discount: 0, discountPercentage: 0 });
    const [ontop, setOntop] = useState<Ontop>({ description: "", discountTypeId: 0, discount: 0, discountPercentage: 0, limitation: 0 });
    const [couponPercentage, setCouponPercentage] = useState(0);
    const [onTopPercentageByGroup, setOntopPercentageByGroup] = useState(0);

    const [total, setTotal] = useState(0);
    const [preTotal,setPreTotal] = useState(0);
    const [summaryQuantity, setSummaryQuantity] = useState(0);
    const [pointDiscount, setPointDiscount] = useState(0);

    const [tshirt, setTshirt] = useState({ "id": 1, "name": "T-shirt", "price": 350, "image": "T-shirt.jpg", "quantity": 0, type: "clothing" });
    const [hoodie, setHoodie] = useState({ "id": 2, "name": "Hoodie", "price": 700, "image": "Hoodie.jpg", "quantity": 0, type: "clothing" });
    const [watch, setWatch] = useState({ "id": 3, "name": "Watch", "price": 850, "image": "Watch.jpg", "quantity": 0, type: "accessories" });
    const [bag, setBag] = useState({ "id": 4, "name": "Bag", "price": 640, "image": "Bag.jpg", "quantity": 0, type: "accessories" });
    const [belt, setBelt] = useState({ "id": 5, "name": "Belt", "price": 230, "image": "Belt.jpg", "quantity": 0, type: "accessories" });
    const [hat, setHat] = useState({ "id": 6, "name": "Hat", "price": 250, "image": "Hat.jpg", "quantity": 0, type: "accessories" });

    const couponList = couponData.Coupon;
    const ontopList = ontopData.Ontop;



    useEffect(() => {
        summary();
    }, [setOntopPercentageByGroup,onTopPercentageByGroup,summaryQuantity,setSummaryQuantity,tshirt.quantity,hoodie.quantity, watch.quantity, bag.quantity, belt.quantity, hat.quantity, coupon, couponPercentage,preTotal,setPreTotal,ontop,setSeasonalDiscount,seasonalDiscount,setSeasonalCountDiscount,seasonalCountDiscount]);


    const summary = () => {
        setSummaryQuantity(tshirt.quantity + hoodie.quantity + watch.quantity + bag.quantity + belt.quantity + hat.quantity);

        if(summaryQuantity <= 0)
        {
            setPointDiscount(0);
        }
       
        if (ontop.discountTypeId === 3) {
            setOntopPercentageByGroup((((tshirt.quantity * tshirt.price) * ontop.discountPercentage) / 100) + (((hoodie.quantity * hoodie.price) * ontop.discountPercentage) / 100));
        }
        else if (ontop.discountTypeId === 4) {
            setOntopPercentageByGroup(0);
        }

        setCouponPercentage((((tshirt.quantity * tshirt.price) + (hoodie.quantity * hoodie.price) + (watch.quantity * watch.price) + (bag.quantity * bag.price)
        + (belt.quantity * belt.price) + (hat.quantity * hat.price)) * coupon.discountPercentage) / 100);

         setPreTotal(((tshirt.quantity * tshirt.price) + (hoodie.quantity * hoodie.price) + (watch.quantity * watch.price) + (bag.quantity * bag.price)
        + (belt.quantity * belt.price) + (hat.quantity * hat.price)) - coupon.discount - couponPercentage - onTopPercentageByGroup - pointDiscount);


        if(preTotal<=0)
        {
            setSeasonalDiscount(0);
        }
        else
        {
            setSeasonalCountDiscount(Math.floor(preTotal / 300));
            setSeasonalDiscount(seasonalCountDiscount *40);
        }



        setSeasonalDiscount

        if (preTotal < 0) {
            setTotal(0);
        }
        else {
            setTotal(preTotal-seasonalDiscount);
        }
    };
    const handleOntopChange = (e: string) => {
        const foundOntop = ontopList.find((item) => item.discountTypeId === parseInt(e));
        if (foundOntop) {
            setOntop(foundOntop);
            console.log(foundOntop);
            if(foundOntop.discountTypeId === 3)
            {
                setPointDiscount(0);
            }
        } 


    };

    const handleUserInputCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserInputCode(value);
    };

  

    const handlePointDiscountChange = (e: string) => {
        console.log("preTotal = ", preTotal);
        const point = parseInt(e);
        const maxDiscount = (preTotal * 20) / 100; 
        
        if (e === "") {
          setPointDiscount(0);
        } else {
          if (point > maxDiscount) {
            setPointDiscount(maxDiscount);
          } else {
            if(preTotal<= 0)
            {
                setPointDiscount(0);
            }
            else
            {
            setPointDiscount(point);
            }
          }
        }
      }
     
      
    const handleCheckInputCode = () => {
        const foundCoupon = couponList.find((item) => item.description === userInputCode);
        if (foundCoupon) {
            setUserInputCode("");
            setCouponCodeSuccess(true);
            setCoupon(foundCoupon);
            summary();
            setPointDiscount(0);

        } else {
            setUserInputCode("");
            setCouponCodeSuccess(false);
        }
    };

    const removeDiscountCode = () => {
        setCoupon({ description: "", discountTypeId: 0, discount: 0, discountPercentage: 0 });
        setCouponCodeSuccess(false);
        setUserInputCode("");
    };

    const handleAddTshirt = () => {
        setTshirt({ ...tshirt, quantity: tshirt.quantity + 1 });
        summary();
        setPointDiscount(0);
    }
    const handleReduceTshirt = () => {
        if (tshirt.quantity <= 0) {
            window.alert("Tshirt ถึงจำนวนต่ำสุดแล้ว")
        }
        else {
            setTshirt({ ...tshirt, quantity: tshirt.quantity - 1 });
            summary();
            setPointDiscount(0);
        }
    }
    const handleAddHoodie = () => {
        setHoodie({ ...hoodie, quantity: hoodie.quantity + 1 });
        summary();
        setPointDiscount(0);
    }
    const handleReduceHoodie = () => {
        if (hoodie.quantity <= 0) {
            window.alert("Hoodie ถึงจำนวนต่ำสุดแล้ว")
        }
        else {
            setHoodie({ ...hoodie, quantity: hoodie.quantity - 1 });
            summary();
            setPointDiscount(0);
        }
    }
    const handleAddWatch = () => {
        setWatch({ ...watch, quantity: watch.quantity + 1 });
        summary();
        setPointDiscount(0);
    }
    const handleReduceWatch = () => {
        if (watch.quantity <= 0) {
            window.alert("Watch ถึงจำนวนต่ำสุดแล้ว")
        }
        else {
            setWatch({ ...watch, quantity: watch.quantity - 1 });
            summary();
            setPointDiscount(0);
        }
    }
    const handleAddBag = () => {
        setBag({ ...bag, quantity: bag.quantity + 1 });
        summary();
        setPointDiscount(0);
    }
    const handleReduceBag = () => {
        if (bag.quantity <= 0) {
            window.alert("Bag ถึงจำนวนต่ำสุดแล้ว")
        }
        else {
            setBag({ ...bag, quantity: bag.quantity - 1 });
            summary();
            setPointDiscount(0);
        }
    }
    const handleAddBelt = () => {
        setBelt({ ...belt, quantity: belt.quantity + 1 });
        summary();
        setPointDiscount(0);
    }
    const handleReduceBelt = () => {
        if (belt.quantity <= 0) {
            window.alert("belt ถึงจำนวนต่ำสุดแล้ว")
        }
        else {
            setBelt({ ...belt, quantity: belt.quantity - 1 });
            summary();
            setPointDiscount(0);
        }
    }
    const handleAddHat = () => {
        setHat({ ...hat, quantity: hat.quantity + 1 });
        summary();
        setPointDiscount(0);
    }
    const handleReduceHat = () => {
        if (hat.quantity <= 0) {
            window.alert("Hat ถึงจำนวนต่ำสุดแล้ว")
        }
        else {
            setHat({ ...hat, quantity: hat.quantity - 1 });
            summary();
            setPointDiscount(0);
        }
    }

    const submitPurchase = () => {
        if (summaryQuantity === 0 )
        {
            window.alert("ไม่มีสินค้าในตะกร้า");
        }
        else
        {
            setShowPopup(true);
        }
    }
    return (
        <>
            <div className="flex justify-center bg-orange-50  ">
                <div className="lg:full w-full mt-10 ">

                    <div className="text-center">
                        <div>
                            <p className="text-2xl">Shopping Cart </p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="bg-white shadow-2xl lg:w-2/3 w-full mt-4 pb-8">


                            <div className="w-full  ">
                                <div className="flex justify-center">
                                    <div>
                                        <p >รายการสินค้า </p>
                                    </div>
                                </div>
                            </div>


                            <div className="w-full ">
                                <div className="flex justify-center items-center">
                                    <div className="w-3/12 ">
                                        <img className="w-[60px] h-[60px] mx-auto" src={`images/${tshirt.image}`}></img>
                                    </div>
                                    <div className="w-3/12  text-center ">

                                        <p>{tshirt.name} ({tshirt.price}฿)</p>
                                    </div>
                                    <div className="w-3/12 " >
                                        <div className="flex justify-center">
                                            <button className="border-4 border-stone-500 px-2 bg-stone-300 mx-4" onClick={handleAddTshirt} > + </button>
                                            <button className="border-4 border-stone-500 px-2 bg-stone-300 mx-4" onClick={handleReduceTshirt}> - </button>
                                        </div>
                                    </div>
                                    <div className="w-3/12  flex">
                                        <div className="w-10/12 text-center">
                                            <p>{tshirt.quantity}</p>
                                        </div>
                                        <div className="w-2/12">
                                            <p>ชิ้น</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full ">
                                <div className="flex justify-center items-center">
                                    <div className="w-3/12 ">
                                        <img className="w-[60px] h-[60px] mx-auto" src={`images/${hoodie.image}`}></img>
                                    </div>
                                    <div className="w-3/12  text-center ">

                                        <p>{hoodie.name} ({hoodie.price}฿)</p>
                                    </div>
                                    <div className="w-3/12 " >
                                        <div className="flex justify-center">
                                            <button className="border-4 border-stone-500 px-2 bg-stone-300 mx-4" onClick={handleAddHoodie} > + </button>
                                            <button className="border-4 border-stone-500 px-2 bg-stone-300 mx-4" onClick={handleReduceHoodie}> - </button>
                                        </div>
                                    </div>
                                    <div className="w-3/12  flex">
                                        <div className="w-10/12 text-center">
                                            <p>{hoodie.quantity}</p>
                                        </div>
                                        <div className="w-2/12">
                                            <p>ชิ้น</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full ">
                                <div className="flex justify-center items-center">
                                    <div className="w-3/12 ">
                                        <img className="w-[60px] h-[60px] mx-auto" src={`images/${watch.image}`}></img>
                                    </div>
                                    <div className="w-3/12  text-center ">

                                        <p>{watch.name} ({watch.price}฿)</p>
                                    </div>
                                    <div className="w-3/12 " >
                                        <div className="flex justify-center">
                                            <button className="border-4 border-stone-500 px-2 bg-stone-300 mx-4" onClick={handleAddWatch} > + </button>
                                            <button className="border-4 border-stone-500 px-2 bg-stone-300 mx-4" onClick={handleReduceWatch}> - </button>
                                        </div>
                                    </div>
                                    <div className="w-3/12  flex">
                                        <div className="w-10/12 text-center">
                                            <p>{watch.quantity}</p>
                                        </div>
                                        <div className="w-2/12">
                                            <p>ชิ้น</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full ">
                                <div className="flex justify-center items-center">
                                    <div className="w-3/12 ">
                                        <img className="w-[60px] h-[60px] mx-auto" src={`images/${bag.image}`}></img>
                                    </div>
                                    <div className="w-3/12  text-center ">

                                        <p>{bag.name} ({bag.price}฿)</p>
                                    </div>
                                    <div className="w-3/12 " >
                                        <div className="flex justify-center">
                                            <button className="border-4 border-stone-500 px-2 bg-stone-300 mx-4" onClick={handleAddBag} > + </button>
                                            <button className="border-4 border-stone-500 px-2 bg-stone-300 mx-4" onClick={handleReduceBag}> - </button>
                                        </div>
                                    </div>
                                    <div className="w-3/12  flex">
                                        <div className="w-10/12 text-center">
                                            <p>{bag.quantity}</p>
                                        </div>
                                        <div className="w-2/12">
                                            <p>ชิ้น</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full ">
                                <div className="flex justify-center items-center">
                                    <div className="w-3/12 ">
                                        <img className="w-[60px] h-[60px] mx-auto" src={`images/${belt.image}`}></img>
                                    </div>
                                    <div className="w-3/12  text-center ">

                                        <p>{belt.name} ({belt.price}฿)</p>
                                    </div>
                                    <div className="w-3/12 " >
                                        <div className="flex justify-center">
                                            <button className="border-4 border-stone-500 px-2 bg-stone-300 mx-4" onClick={handleAddBelt} > + </button>
                                            <button className="border-4 border-stone-500 px-2 bg-stone-300 mx-4" onClick={handleReduceBelt}> - </button>
                                        </div>
                                    </div>
                                    <div className="w-3/12  flex">
                                        <div className="w-10/12 text-center">
                                            <p>{belt.quantity}</p>
                                        </div>
                                        <div className="w-2/12">
                                            <p>ชิ้น</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="w-full ">
                                <div className="flex justify-center items-center">
                                    <div className="w-3/12 ">
                                        <img className="w-[60px] h-[60px] mx-auto" src={`images/${hat.image}`}></img>
                                    </div>
                                    <div className="w-3/12  text-center ">

                                        <p>{hat.name} ({hat.price}฿)</p>
                                    </div>
                                    <div className="w-3/12 " >
                                        <div className="flex justify-center">
                                            <button className="border-4 border-stone-500 px-2 bg-stone-300 mx-4" onClick={handleAddHat} > + </button>
                                            <button className="border-4 border-stone-500 px-2 bg-stone-300 mx-4" onClick={handleReduceHat}> - </button>
                                        </div>
                                    </div>
                                    <div className="w-3/12  flex">
                                        <div className="w-10/12 text-center">
                                            <p>{hat.quantity}</p>
                                        </div>
                                        <div className="w-2/12">
                                            <p>ชิ้น</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                         <div className="border-2 border-black">
                            <div className="w-full mt-2 ">
                                <div className="flex justify-center">
                                    <div className="w-9/12 text-center">
                                        <p> สรุปยอด </p>
                                    </div>
                                    <div className="w-3/12 flex">
                                        <div className="w-10/12 text-center">
                                            <p>{summaryQuantity}</p>
                                        </div>
                                        <div className="w-2/12 text-center">
                                            <p>ชิ้น</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {couponCodeSuccess &&
                                <>
                                    <div className="w-full mt-2 ">
                                        <div className="flex ">
                                            <div className="w-9/12 text-center">
                                                <p><button className="text-blue-500 font-semibold underline" onClick={removeDiscountCode}> นำคูปองส่วนลดออก</button> (ส่วนลด coupon) {coupon.description}  </p>

                                            </div>
                                            <div className="w-3/12 flex text-center" >
                                                <div className="w-10/12">
                                                    <p> {couponPercentage + coupon.discount} </p>
                                                </div>
                                                <div className="w-2/12 text-center">
                                                    <p>บาท</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            {ontop.discountTypeId !== 0 && (
                                <>
                                    <div className="w-full mt-2 ">
                                        <div className="flex ">
                                            <div className="w-9/12 text-center flex justify-center ">
                                                <p className=""> (ส่วนลด ontop) {ontop.description} 
                                                {ontop.discountTypeId === 4 && (<>
                                                <p className="text-red-500"> ใส่ point ได้ไม่เกิน 
                                                {preTotal <= 0 ? 0 :  preTotal*20/100}</p>
                                                </>)}  </p>
                                                {ontop.discountTypeId === 4 && (
                                                    <>
                                                        <input
                                                            placeholder="ใส่ point เพื่อลดราคาได้ไม่เกิน ..."
                                                            type="text"
                                                            name="pointDiscount"
                                                            id="pointDiscount"
                                                            value={pointDiscount}
                                                            onChange={(e) => handlePointDiscountChange(e.target.value)}
                                                            className="bg-stone-400 w-[90px] ml-2 text-center">
                                                        </input>
                                                    </>
                                                )}

                                            </div>
                                            <div className="w-3/12 flex" >
                                                <div className="w-10/12 text-center">
                                                    <p>{onTopPercentageByGroup + pointDiscount}</p>
                                                </div>
                                                <div className="w-2/12 text-center">
                                                    <p>บาท</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}


                            <div className="w-full mt-2 ">
                                <div className="flex ">
                                    <div className="w-9/12 text-center">
                                        <p> (ส่วนลด seasonal) Special campaigns </p>
                                    </div>
                                    <div className="w-3/12 flex "  >
                                        <div className="w-10/12 text-center">
                                            <p>{seasonalDiscount}</p>
                                        </div>
                                        <div className="w-2/12 text-center">
                                            <p>บาท</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full mt-2 ">
                                <div className="flex ">
                                    <div className="w-9/12 text-center">
                                        <p> รวมราคาทั้งหมดหลังหักส่วนลด  </p>
                                    </div>
                                    <div className="w-3/12 flex" >
                                        <div className="w-10/12 text-center">
                                            <p>{total-pointDiscount}</p>
                                        </div>
                                        <div className="w-2/12 text-center">
                                            <p>บาท</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         </div>   


                            <div className=" text-center  mt-4" >
                                <p className="text-md" title={`Fixed amount = ลด 50 บาท, Percentage discount = ลด 10% `}>
                                    ชี้ตรงนี้เพื่อดูโค๊ดส่วนลด
                                </p>
                            </div>


                            {/*div ตรวจสอบรหัสโปรโมชัน */}
                            <div className="w-full mt-2">
                                <div className=" flex justify-center ">
                                    <div className="w-11/12 rounded-xl border-2 border-[#76a5af] mt-4 mb-4 py-2 px-2 text-center" >
                                        <div>
                                            <input className="text-center border-b-2 border-stone-500 mt-6 focus: outline-none"
                                                placeholder="กรอกรหัสโปรโมชัน"
                                                type="text"
                                                name="inputDiscountCode"
                                                id="inputDiscountCode"
                                                value={userInputCode}
                                                onChange={handleUserInputCodeChange}
                                                disabled={couponCodeSuccess}
                                            ></input>
                                        </div>
                                        <div>
                                            <button className="border-2 border-[#76a5af] bg-[#d0e0e3] text-black py-2 px-4 rounded-md mt-6 mb-4" disabled={couponCodeSuccess} onClick={handleCheckInputCode}> ตรวจสอบรหัสโปรโมชัน</button>
                                        </div>
                                        <div>

                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="w-full mt-2">
                                <div className="flex ">

                                    {ontopList && ontopList.map((ontop1: any) => (
                                        <>
                                            <div className={`w-[${ontopList.length}/100%] mx-auto`}>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="discountOntop"
                                                        value={ontop1.discountTypeId}
                                                        onChange={(e) => handleOntopChange(e.target.value)}
                                                        className="mr-4"
                                                    />
                                                    {ontop1.description}
                                                </label>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </div>

                            <div className=' flex justify-center'>
                {showPopup && (
                  <div className='fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50'>
                    <div ref={popupRef} className='relative bottom-1 mb-8 h-4/6 w-full max-w-2xl  rounded-lg bg-white p-8 border-2 border-stone-500'>
                      <button
                        className='absolute right-0 top-0 m-4 text-lg font-bold text-gray-700 hover:text-gray-900 focus:outline-none'
                        onClick={handleClosePopup}
                      >
                        X
                      </button>

                      <div className='flex flex-col items-center justify-center h-full'>
        
                        <div className='text-center mt-2'>
                          <p className='text-lg font-semibold w-full'>ระบบจะดำเนินการจัดส่งสินค้าให้คุณอย่างรวดเร็ว</p>
                          <p className='text-md'>ยอดสั่งซื้อทั้งหมด {total} บาท</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>




                            <div className="flex justify-center mt-4">
                                <button onClick={submitPurchase} className={`lg:w-[35%] w-[40%] font-bold py-2 px-4 rounded ml-1 bg-[#0000ff] text-white `}
                                    type="button" >ชำระเงิน</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Content;