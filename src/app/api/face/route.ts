import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};
export async function POST(req: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_COMPREFACE_URL || '';
  const apiKey = process.env.NEXT_PUBLIC_COMPREFACE_KEY || '';  
  console.log(apiUrl)
  console.log(apiKey)
  
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    console.log(formData)
    if (!file) throw new Error('ファイルがアップロードされていません');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {'x-api-key': apiKey },
      body: formData,
    });

    if (!response.ok) throw new Error(response.statusText);

    const result = await response.json();
    return NextResponse.json({ message: '成功したお', result });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    console.error('エラーが発生しました:', errorMessage);
    return NextResponse.json({ message: 'サーバーエラー', error: errorMessage }, { status: 500 });
  }
}
