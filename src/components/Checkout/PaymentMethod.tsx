import React, { useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";

const PaymentMethod = () => {
  const [payment, setPayment] = useState("bank");
  const totalPrice = useSelector(selectTotalPrice);

  // Generate unique order ID
  const generateOrderId = () => {
    return `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleEsewaPayment = () => {
    const orderId = generateOrderId();
    const amount = totalPrice.toFixed(2);

    // Create form and submit to eSewa
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://uat.esewa.com.np/epay/main';

    const fields = {
      amt: amount,
      psc: '0',
      pdc: '0',
      tAmt: amount,
      pid: orderId,
      scd: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE || '',
      su: `${window.location.origin}/payment/success`,
      fu: `${window.location.origin}/payment/failure`
    };

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Payment Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          <label
            htmlFor="bank"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="bank"
                id="bank"
                className="sr-only"
                onChange={() => setPayment("bank")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "bank"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none ${
                payment === "bank"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image src="/images/checkout/bank.svg" alt="bank" width={29} height={12}/>
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>Direct bank transfer</p>
                </div>
              </div>
            </div>
          </label>

          <label
            htmlFor="cash"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="cash"
                id="cash"
                className="sr-only"
                onChange={() => setPayment("cash")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "cash"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${
                payment === "cash"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image src="/images/checkout/cash.svg" alt="cash" width={21} height={21} />
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>Cash on delivery</p>
                </div>
              </div>
            </div>
          </label>

          <label
            htmlFor="paypal"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="paypal"
                id="paypal"
                className="sr-only"
                onChange={() => setPayment("paypal")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "paypal"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>
            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${
                payment === "paypal"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image src="/images/checkout/paypal.svg" alt="paypal" width={75} height={20}/>
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>Paypal</p>
                </div>
              </div>
            </div>
          </label>

          <label
            htmlFor="esewa"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="esewa"
                id="esewa"
                className="sr-only"
                onChange={() => setPayment("esewa")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "esewa"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>
            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${
                payment === "esewa"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <div className="w-[75px] h-[20px] bg-green-600 text-white text-xs font-bold flex items-center justify-center rounded">
                    eSewa
                  </div>
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>eSewa Digital Wallet</p>
                </div>
              </div>
            </div>
          </label>
        </div>

        {/* eSewa Payment Button */}
        {payment === "esewa" && (
          <div className="mt-6 pt-6 border-t border-gray-3">
            <button
              type="button"
              onClick={handleEsewaPayment}
              className="w-full flex items-center justify-center gap-3 font-medium text-white bg-green-600 py-4 px-6 rounded-md ease-out duration-200 hover:bg-green-700"
            >
              <div className="w-8 h-5 bg-white text-green-600 text-xs font-bold flex items-center justify-center rounded">
                eSewa
              </div>
              Pay ${totalPrice.toFixed(2)} with eSewa
            </button>
            <p className="text-sm text-gray-600 mt-2 text-center">
              You will be redirected to eSewa to complete your payment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
