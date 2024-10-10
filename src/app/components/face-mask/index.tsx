import React, { useEffect, useRef } from 'react';

interface ImageOverlayProps {
  imgAUrl: string; // Aの画像のパス
  imgBUrl: string; // Bの画像のパス
  boxData?: {
    probability: number;
    x_max: number;
    y_max: number;
    x_min: number;
    y_min: number;
  }; // JSONデータのbox内の座標
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({ imgAUrl, imgBUrl, boxData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // boxDataがundefinedまたはnullの場合のデフォルト値を設定
  const { x_max = 0, y_max = 0, x_min = 0, y_min = 0 } = boxData || {};

  const ex_x_max = x_max + 30;
  const ex_y_max = y_max + 30
  const ex_x_min = x_min - 30
  const ex_y_min = y_min - 30

  // 描画する幅と高さを計算
  const width = ex_x_max - ex_x_min;
  const height = ex_y_max - ex_y_min;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const imgA = new Image();
    const imgB = new Image();

    // 画像が両方読み込まれたら描画
    const loadImages = Promise.all([
      new Promise<void>((resolve) => {
        imgA.src = imgAUrl;
        imgA.onload = () => resolve();
      }),
      new Promise<void>((resolve) => {
        imgB.src = imgBUrl;
        imgB.onload = () => resolve();
      })
    ]);

    loadImages.then(() => {
      // キャンバスのサイズを設定
      canvas.width = imgA.width;
      canvas.height = imgA.height;

      // Aの画像を描画
      ctx!.drawImage(imgA, 0, 0);

      // Bの画像を指定した座標に描画
      ctx!.drawImage(imgB, ex_x_min, ex_y_min, width, height);
    });
  }, [imgAUrl, imgBUrl, ex_x_min, ex_y_min, width, height]);

  return (
    <canvas ref={canvasRef} className='max-w-60 max-h-60 object-contain'></canvas>
  );
};
export default ImageOverlay;
