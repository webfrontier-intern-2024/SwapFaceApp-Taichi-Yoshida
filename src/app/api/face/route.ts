import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiUrl = process.env.HIMAZIN_COMPREFACE_URL || '';
  const apiKey = process.env.HIMAZIN_COMPREFACE_KEY || '';  

  try {
    const formData = await req.formData();//画像ファイルをアップロードする際に使用
    const response = await fetch(apiUrl, {//外部の顔認識APIにPOSTリクエストを送信し、データを取得する。
      method: 'POST',
      headers: {'x-api-key': apiKey },
      body: formData,
    });
    if (!response.ok) throw new Error(response.statusText);
    const result = await response.json();//APIから返されたレスポンスをJSON形式に変換
    const box = result.result?.[0].box;//APIのレスポンスの中から、認識された顔の「ボックス情報」を取得
    return NextResponse.json({ message: '成功', box });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json({ message: '顔を認識することが出来ませんでした。', error: errorMessage }, { status: 500 });
  }
}
