
import { NextRequest } from "next/server";
import Razorpay from "razorpay";

var instance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_CLIENT_ID as string,
    key_secret: process.env.RAZORPAY_CLIENT_SECRET as string,
});

export async function POST(request: NextRequest){
    const {amount} = await request.json();
    try {
        const options = {
            amount: (parseInt(amount) * 100),  // amount in the smallest currency unit
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        // console.log(order);
        return Response.json({"payment" : order}, {status: 200});
    } catch (error) {
        return Response.json({"payment failed" : error}, {status: 401});
    }
}
