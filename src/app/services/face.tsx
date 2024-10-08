// // ImageOverlay.tsx
// import React, { useEffect, useRef } from 'react';

// interface ImageOverlayProps {
//   imgAUrl: string; // Aの画像のパス
//   imgBUrl: string; // Bの画像のパス
//   xMin: number;    // 最小X座標
//   yMin: number;    // 最小Y座標
//   xMax: number;    // 最大X座標
//   yMax: number;    // 最大Y座標
// }

// const ImageOverlay: React.FC<ImageOverlayProps> = ({ imgAUrl, imgBUrl, xMin, yMin, xMax, yMax }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const width = xMax - xMin;
//   const height = yMax - yMin;

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
    
//     const imgA = new Image();
//     const imgB = new Image();

//     // 画像が両方読み込まれたら描画
//     const loadImages = Promise.all([
//       new Promise<void>(resolve => { imgA.src = imgAUrl; imgA.onload = resolve; }),
//       new Promise<void>(resolve => { imgB.src = imgBUrl; imgB.onload = resolve; })
//     ]);

//     loadImages.then(() => {
//       // キャンバスのサイズを設定
//       canvas.width = imgA.width;
//       canvas.height = imgA.height;

//       // Aの画像を描画
//       ctx.drawImage(imgA, 0, 0);

//       // Bの画像を指定した座標に描画
//       ctx.drawImage(imgB, xMin, yMin, width, height);
//     });
//   }, [imgAUrl, imgBUrl, xMin, yMin, width, height]);

//   return <canvas ref={canvasRef}></canvas>;
// };

// export default ImageOverlay;
