import { NextRequest } from "next/server";
import { parse } from "path";

export async function POST(request: NextRequest) {
    
    const formData = await request.formData();


    // Todo: store in db 
    console.log(formData.get('ownerName'));
    console.log(formData.get('cabName'));
    console.log(formData.get('cabType'));
    console.log(formData.get('cabNumber'));
    console.log(formData.get('image'));
    

    return Response.json({"data": 'result'}, {status: 200});

}