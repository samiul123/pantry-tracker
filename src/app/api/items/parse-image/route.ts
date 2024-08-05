import {NextRequest, NextResponse} from "next/server";
import {openai} from "@/app/utils/openai";

export const POST = async (req: NextRequest) => {

    try {
        const base64Image = await req.json().then(res => {
            console.log("Image data: ", res)
            return res.image
        });


        if (!base64Image || typeof base64Image !== 'string') {
            throw new Error('Invalid image data', base64Image);
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: 'system',
                    content: "You are a helpful assistant to give the response back in " +
                        "JSON format. The json format includes name, category and " +
                        "amount(count of the item in image). Only return the JSON structure." +
                        "Do not return ```json"
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Give me a JSON response mentioning the name, category and amount(count of item) in the image'
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `${base64Image}`
                            }
                        }
                    ]
                }
            ]
        })
        console.log("OPEN AI response: ", response.choices)
        const parseResponse = JSON.parse(<string>response.choices[0].message.content)
        return NextResponse.json(parseResponse, {status: 200})
        // return NextResponse.json({name: 'pen', category: 'stationary', amount: 1}, {status: 200})
    } catch (error) {
        console.log("OPEN AI error: ", error)
        return NextResponse.json({error: error}, {status: 500})
    }
}