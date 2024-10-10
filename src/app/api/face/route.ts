import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const apiUrl = process.env.HIMAZIN_COMPREFACE_URL || '';
  const apiKey = process.env.HIMAZIN_COMPREFACE_KEY || '';  

  try {
    const formData = await req.formData();
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {'x-api-key': apiKey },
      body: formData,
    });
    if (!response.ok) throw new Error(response.statusText);
    const result = await response.json();
    const box = result.result?.[0].box;
    return NextResponse.json({ message: '成功したおoooo', box });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json({ message: '顔を認識することが出来ませんでした。', error: errorMessage }, { status: 500 });
  }
}
