import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Payment from "@/models/Payment";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");
  
  if (!orderId) {
    return NextResponse.json({ success:false, error: "Order ID is required" ,status: 400 });
  }
  await dbConnect();
  const order = await Order.findOne({_id: orderId}).populate("items.trackingVia").lean();
  if (!order) {
    return NextResponse.json({ success:false, error: "Order not found", status: 404 });
  }
  
  return NextResponse.json({ success: true, order: order });
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, paymentMethod, shippingAddress } = body;

    if(!userId) return NextResponse.json({ success: false, message: "User Not logged in" }, { status: 400 });

    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });
    }

    const items = cart.items.map((item: any) => ({
      productId: item.productId,
      variantId: item.variantId,
      title: item.title,
      image: item.image,
      variant: item.variant,
      price: item.price,
      deliveryCharge: item.deliveryCharge,
      quantity: item.quantity,
      sellerId: item.sellerId,
      status: "Pending",
    }));
    
    const totalAmount = items.reduce((sum: number, i: any) => sum + (i.price * i.quantity + i.deliveryCharge) , 0);
    const order = new Order({
      userId,
      items,
      shippingAddress: shippingAddress,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      paymentStatus: "Pending",
      status: "Pending",
    });
    await order.save();

    await Promise.all(
      items.map(async (item) => {
        await Product.updateOne(
          {
            _id: item.productId,
            "variants.attributes": item.variant,
          },
          {
            $inc: { "variants.$.stock": -item.quantity },
          }
        );
      })
    );

    if(paymentMethod == "ONLINE"){
      const payment = new Payment({
        orderId: order._id,
        userId,
        gateway: "razorpay",
        amount: Number(totalAmount.toFixed(2)),
        currency: "INR",
        gatewayOrderId: order._id,
        transactionId: null,
        status: "created",
      });
      await payment.save();
    }

    //delete the cart after creating the order
    await Cart.findOneAndDelete({ userId: userId });

    //after successful payments update the payment schema as below
    // await Payment.findOneAndUpdate(
    //   { gatewayOrderId: order._id },
    //   {
    //     transactionId: razorpay_payment_id,
    //     signature: razorpay_signature,
    //     status: "captured",
    //   }
    // );

    return NextResponse.json({ success: true, orderId: order._id });
    //return NextResponse.json({ success: true, orderId: 123 });
  } catch (error: any) {
    console.error("Order Create Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}