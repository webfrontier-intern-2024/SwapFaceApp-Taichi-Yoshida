"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { CustomButton } from "./components/custom-button";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(true);

  // ファイル選択時にプレビューを作成
  useEffect(() => {
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [selectedFile]);

  // ドロップゾーンの設定
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".png", ".jpeg", ".jpg"] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setShowResult(true);
        setError(null);
      }
    },
  });

  // フォームリセット
  const resetForm = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setError(null);
    setIsSending(false);
    setShowResult(true);
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
        setShowResult(false);
        console.log(data)
        // JSONから必要な値を抜き出す
        const box = data.result[0].box; // 受け取ったJSONからboxを取得 
        console.log(box)
        const xMax = box.x_max;
        const yMax = box.y_max;
        const xMin = box.x_min;
        const yMin = box.y_min;
        // 値をconsole.log
        console.log({ xMax, yMax, xMin, yMin });
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

  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 font-sans min-h-screen">
      {!selectedFile && (
        <div className="bg-white py-6 rounded-xl m-4 border border-red-900 border-4 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="flex flex-col overflow-hidden rounded-lg bg-gray-200 border border-slate-950 border-4 sm:flex-row md:h-80">
              <div className="order-first h-48 w-full bg-gray-300 sm:order-none sm:h-auto sm:w-1/2 lg:w-2/5">
                <img
                  src="/images/pro.png"
                  loading="lazy"
                  alt="プロフィール画像"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="flex w-full flex-col p-4 sm:w-1/2 sm:p-8 lg:w-3/5">
                <h2 className="mb-4 text-xl font-bold text-gray-800 md:text-xl lg:text-2xl">
                  顔モザイクジェネレーター
                </h2>

                <p className="mb-8 max-w-md text-gray-600">
                  顔認識を行い、写真に映る顔にスタンプを貼り付けます。
                </p>
                <div
                  {...getRootProps()}
                  className="flex items-center justify-center border-2 border-dashed border-amber-900 rounded-lg bg-white cursor-pointer md:w-auto h-auto lg:w-96 h-28 "
                >
                  <input {...getInputProps()} />
                  <p className="text-gray-500 m-8 text-center md:text-xs lg:text-sm">
                    ここにファイルをドラッグ＆ドロップするか、<br />クリックして選択してください
                    <br /> (png, jpeg, jpg)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {filePreview && showResult && (
        <div className="bg-white rounded-xl m-4 flex flex-col item-center border border-4 border-amber-900 sm:py-8 lg:py-12">
          <div className="m-4">
            <Image src={filePreview} alt="画像ファイル" width={300} height={300} />
          </div>
          <div className="m-4 flex justify-around">
            <CustomButton onClick={resetForm} disabled={false}>
              画像を削除
            </CustomButton>
            <CustomButton onClick={imageRecognition} disabled={isSending || error !== null}>
              {isSending ? "送信中..." : "画像を送信"}
            </CustomButton>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      )}
      {selectedFile && !showResult && (
        <div className="m-4">
          <CustomButton onClick={resetForm} disabled={false}>
            戻る
          </CustomButton>
        </div>
      )}
    </div>
  );
}
