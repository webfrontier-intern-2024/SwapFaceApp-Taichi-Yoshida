"use client";
import Image from "next/image";
import { useState, useEffect, useRef} from "react";

//package
import { useDropzone } from "react-dropzone";
import { useReward } from "react-rewards";
import { CiLocationArrow1 } from "react-icons/ci";

//components
import { CustomButton } from "./components/custom-button";
import ImageOverlay from "./components/face-mask"

//lottie
import { FileUp } from "./components/lottie/file-up";
import {LightArrow} from "./components/lottie/light-arrow";

//顔認識の結果から取得されるデータの型定義
interface BoxData {
  probability: number;
  x_max: number;
  y_max: number;
  x_min: number;
  y_min: number;
}

//紙吹雪
const useConfetti = (callback: () => void, delay: number, condition: boolean) => {
  const callbackRef = useRef(() => {});

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null && condition) {
      const timeoutId = setTimeout(() => callbackRef.current(), delay);
      return () => clearTimeout(timeoutId);
    }
  }, [delay, condition]);
};

export default function Home() {

  //useState
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [warningShowModal,setWarningShowModal] = useState(false)
  const [confirmShowModal,setConfirmShowModal] = useState(false)
  const [showMaskButton, setShowMaskButton] = useState(false);
  const [jsonData,setJsonData] = useState<BoxData>();
  const [isDragActive, setIsDragActive] = useState(false); 
  
  //useReward
  const { reward: rewardLeft, isAnimating: isAnimatingLeft } = useReward(
    "rewardLeft",
    "confetti",
    {
      angle: 45,
      position: "absolute",
    }
  );
  const { reward: rewardRight, isAnimating: isAnimatingRight } = useReward(
    "rewardRight",
    "confetti",
    {
      angle: 135,
      position: "absolute",
    }
  );

  // ファイル選択時にプレビューを作成
  useEffect(() => {
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [selectedFile]);

  // ドロップゾーンの設定
  const { getRootProps, getInputProps} = useDropzone({
    accept: { "image/*": [".png", ".jpeg", ".jpg"] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setShowResult(false);
        setError(null);
        setIsDragActive(false); // ドロップが完了したら非アクティブに戻す
      }
    },
    onDragEnter: () => setIsDragActive(true), // ドラッグが始まったらアクティブに
    onDragLeave: () => setIsDragActive(false), // ドラッグが終了したら非アクティブに
  });

  // フォームリセット
  const resetForm = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setError(null);
    setIsSending(false);
    setShowResult(false);
    setShowMaskButton(false);
  };

  // 画像認識APIに送信
  const imageRecognition = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log(formData)
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch("/api/face", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setError(null);
        setShowMaskButton(true); 
        setJsonData(data.box);
        console.log(data);
      } else {
        setError(data.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("エラーが発生しました");
    } finally {
      setIsSending(false);
    }
  };  

  //紙吹雪
  useConfetti(() => {
    if (!isAnimatingRight || !isAnimatingLeft) {
      rewardLeft();
      rewardRight();
    }}
    ,1000
    ,showResult
  );

  return (
    <div className="flex flex-col items-center justify-center font-sans min-h-screen" style={{
      backgroundImage: `linear-gradient(to right, #f77062, #fe5196)`,
    }}>
      <div className="relative flex items-end justify-between z-50 w-full h-full">
        <span id="rewardLeft" className="absolute left-0 bottom-0">
        </span>
        <span id="rewardRight" className="absolute right-0 bottom-0">
        </span>
      </div>
      {!selectedFile && (
        <div className="bg-white py-6 rounded-xl m-4 border border-red-900 w-2/3 border-4 sm:py-8 lg:py-12 w-2/3">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="flex flex-col overflow-hidden rounded-lg bg-gray-200 border border-slate-950 border-4 sm:flex-row md:h-80">
              <div className="order-first h-48 w-full bg-gray-300 sm:order-none sm:h-auto sm:w-1/2 lg:w-2/5">
                <Image
                  src="/images/pro.png"
                  loading="lazy"
                  alt="プロフィール画像"
                  className="h-full w-full object-cover object-center"
                  height={400}
                  width={400}
                />
              </div>
              <div className="flex w-full flex-col p-4 sm:w-1/2 sm:p-8 lg:w-3/5">
                <h2 className="mb-4 text-xl font-bold text-gray-800 md:text-xl lg:text-2xl">
                  顔モザイクジェネレーター
                </h2>

                <p className="mb-8 max-w-md text-gray-600">
                  顔認識を行い、<br />写真に映る顔にスタンプを貼り付けます。
                </p>
                
                {/* 中央寄せにするために以下のクラスを追加 */}
                <div
                  {...getRootProps()}
                  onMouseEnter={() => setIsDragActive(true)}
                  onMouseLeave={() => setIsDragActive(false)}
                  className="flex items-center justify-center h-52 w-full border-2 border-dashed border-amber-900 rounded-lg bg-white cursor-pointer md:w-auto lg:w-96"
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <FileUp />
                  ) : (
                    <p className="text-gray-500 text-center md:text-xs lg:text-sm">
                      ここにファイルをドラッグ＆ドロップするか、<br />クリックして選択してください
                      <br /> (png, jpeg, jpg)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 画像プレビューがある場合はモーダルを表示 */}
      {filePreview && !showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0" >
          <div className="fixed inset-0 bg-black bg-opacity-50 pointer-events-none"></div>
          <div className="bg-white rounded-xl m-4 flex flex-col items-center border border-red-900 border-4 sm:py-8 lg:py-12 z-10">
            <div className="m-4">
              <Image src={filePreview} alt="画像ファイル" width={300} height={300} />
            </div>
            <div className="m-4 flex justify-around w-full">
              <CustomButton onClick={() => setWarningShowModal(true)} disabled={false} lightColor={"bg-red-500"} darkColor={"bg-red-600"}>
                画像を削除
              </CustomButton>
              {!showMaskButton && (
                <CustomButton onClick={imageRecognition} disabled={isSending || error !== null} lightColor={"bg-blue-500"} darkColor={"bg-blue-600"}>
                  <div className="flex items-center justify-around">
                    <div>{isSending ? "送信中..." : "顔認識確認"}</div>
                    <div className="ml-2">
                      <CiLocationArrow1 />
                    </div>
                  </div>
                </CustomButton>
              )}
              {showMaskButton && (
                <CustomButton onClick={() => setConfirmShowModal(true)} disabled={false} lightColor={"bg-green-500"} darkColor={"bg-green-600"}>
                  画像をマスク
                </CustomButton>
              )}
            </div>
            {!isSending && showMaskButton && <p className="text-blue-500 text-center">座標取得に成功しました。</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
        </div>
      )}
      {showResult && filePreview && (
        <div className="bg-white py-6 rounded-xl m-4 border border-red-900 border-4 sm:py-8 lg:py-12 w-2/3">
          <div className="m-4 flex flex-col items-center justify-center">
            <svg width="400" height="100">
                <defs>
                    <path id="curve" d="M 0 100 Q 200 0, 400 100" fill="transparent" />
                </defs>
                <text>
                    <textPath href="#curve" startOffset="50%" textAnchor="middle" className="text-3xl font-bold text-blue-500">
                        は〜い。完成〜〜〜。
                    </textPath>
                </text>
            </svg>
            <div className="m-5 flex items-center justify-center">
              <Image src={filePreview} alt="画像ファイル" width={320} height={320} className="max-w-60 max-h-60 object-contain"/>
              <LightArrow/>
              <ImageOverlay
                imgAUrl={filePreview}
                imgBUrl={"/images/smile-face.png"}
                boxData={jsonData}
            />   
            </div>     
            <CustomButton onClick={resetForm} disabled={false} lightColor={"bg-green-500"} darkColor={"bg-green-600"}>
              <div className="mx-12">戻る</div>
            </CustomButton>
          </div>
        </div>
      )}

      {/* モーダルコンポーネント */}
      {warningShowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setWarningShowModal(false)}></div>
          <div className="mx-auto w-full overflow-hidden rounded-lg bg-white shadow-xl sm:max-w-sm z-10">
            <div className="relative p-5">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-secondary-900">画像を削除しますか？</h3>
                  <div className="mt-2 text-sm text-secondary-500">この操作は取り消せません。</div>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button type="button" onClick={() => setWarningShowModal(false)} className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100">
                  キャンセル
                </button>
                <button type="button" onClick={() => { resetForm(); setWarningShowModal(false); }} className="flex-1 rounded-lg border border-red-500 bg-red-500 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-red-700 hover:bg-red-700">
                  削除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 確認モーダル */}
      {confirmShowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setConfirmShowModal(false)}></div>
          <div className="mx-auto w-full overflow-hidden rounded-lg bg-white shadow-xl sm:max-w-sm z-10">
            <div className="relative p-5">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-secondary-900">画像をマスク加工しますか？</h3>
                  <div className="mt-2 text-sm text-secondary-500">この操作で元画像が加工される事はありません。</div>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button type="button" onClick={() => setConfirmShowModal(false)} className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100">
                  キャンセル
                </button>
                <button type="button" onClick={() => { setShowResult(true); setConfirmShowModal(false); }} className="flex-1 rounded-lg border border-green-500 bg-green-500 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-green-500 hover:bg-green-500">
                  加工開始！
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
