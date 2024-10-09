import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};
export async function POST(req: NextRequest) {
  const apiUrl = process.env.COMPREFACE_URL || '';
  const apiKey = process.env.COMPREFACE_KEY || '';  

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
    const box = result.result?.[0].box;
    console.log("HIMAHIMAHIMAHIMAHIMAHIMAHIMAHIMAHIMAHIMAHIMAHIMAHIMAHIMAHIMAHIMAHIMAHIMAHIMAHIMA")
    console.log('box data:', box);
    return NextResponse.json({ message: '成功したお', box });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    console.error('エラーが発生しました:', errorMessage);
    return NextResponse.json({ message: 'サーバーエラー', error: errorMessage }, { status: 500 });
  }
}
