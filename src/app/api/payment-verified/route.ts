
import { NextRequest } from "next/server";
import { parse } from 'querystring';
import crypto from 'crypto';

export async function POST(request: NextRequest){

    const text = await request.text(); // Get the raw text from the request body

    // Parse the URL-encoded data
    const parsedBody = parse(text);

    const razorpay_payment_id = parsedBody['razorpay_payment_id'];
    const razorpay_order_id = parsedBody['razorpay_order_id'];
    const razorpay_signature = parsedBody['razorpay_signature'];

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    var expectedSignature = await crypto.createHmac('sha256', process.env.RAZORPAY_CLIENT_SECRET as string)
                                    .update(body.toString())
                                    .digest('hex');
                                    

    // console.log(expectedSignature);
    // console.log(razorpay_signature);
    
    if(expectedSignature === razorpay_signature){
        return Response.redirect(`http://localhost:3000/payment-verified?payid=${razorpay_payment_id}`);
    }
    return Response.redirect('http://localhost:3000');
   
}
