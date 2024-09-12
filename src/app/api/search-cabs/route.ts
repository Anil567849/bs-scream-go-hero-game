import { NextRequest } from "next/server";

const reviewsSample = [
    {
      location: "Manali",
      cabs: 45,
      star: "4.9"
    },
    {
      username: "Priya",
      review: "Fantastic experience! Very professional and delivered exactly what was promised. Definitely worth the investment.",
      star: "5.0"
    },
    {
      username: "Ravi",
      review: "An exceptional influencer with a keen understanding of the market. His insights and strategies have helped us reach new audiences.",
      star: "4.8"
    },
    {
      username: "Sanya",
      review: "Very pleased with the results. The collaboration was smooth, and the campaign exceeded our expectations. Will work together again!",
      star: "2.7"
    },
    {
      username: "Arjun",
      review: "A true professional who brings creativity and dedication to the table. Highly effective and great to work with.",
      star: "4.9"
    },
    {
      username: "Meera",
      review: "Absolutely fantastic work! The engagement and reach were beyond what we anticipated. Highly recommended for impactful collaborations.",
      star: "5.0"
    },
    {
      username: "Karan",
      review: "Great results and very professional. The campaign was well-executed, and the communication was excellent throughout.",
      star: "4.8"
    },
    {
      username: "Nisha",
      review: "Exceptional quality and creativity. He managed to captivate our target audience and deliver outstanding results.",
      star: "4.9"
    },
    {
      username: "Vikram",
      review: "Highly impressed with the work. The influencer demonstrated a deep understanding of our brand and delivered an impactful campaign.",
      star: "4.7"
    }
];

export async function POST(request: NextRequest){
    const {location, cabs, adType} = await request.json();

    console.log(location, cabs, adType);
    
    try {
        // Todo: get from Database 


        return Response.json({"data" : reviewsSample}, {status: 200});
    } catch (error) {
        return Response.json({"data" : "error"}, {status: 401});
    }
}