"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

// コンポーネント
import { CustomButton } from "./components/custom-button";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [desiredResults, setDesiredResults] = useState(false); //望まれたJson結果だったか。
  const [showResult, setShowResult] = useState(true); //結果の表示ステータス
  const [count, setCount] = useState(0);//挙動確認で設定

  useEffect(() => {
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }
  }, [selectedFile]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setDesiredResults(false);
        setShowResult(true);
      }
    },
  });

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setDesiredResults(false);
    setShowResult(true);
  };

  const handleCountUp = () => {
    setCount((prevCount) => prevCount + 1);
    setDesiredResults(true);
  };

  const handleMask = () => {
    setShowResult(false); // マスクボタンを押したときにボタンを非表示にする
  };

  const resetForm = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setDesiredResults(false);
    setCount(0);
    setShowResult(true); // 全てリセットして最初の画面に戻す
  };

  const countShow = count % 2 === 0;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 font-sans min-h-screen">
      {/* ファイルアップロードフィールドの表示 */}
      {!selectedFile && (
        <div
          {...getRootProps()}
          className="flex items-center justify-center w-96 h-60 border-2 border-dashed border-blue-400 rounded-lg bg-white cursor-pointer"
        >
          <input {...getInputProps()} />
          <p className="text-gray-500 m-8 text-center">
            ここに以下の拡張子に該当するファイルを
            <br />
            ドラッグ＆ドロップするか、
            <br />
            クリックしてファイルを選択してください
            <br /> (png, jpeg, jpg)
          </p>
        </div>
      )}

      {/* 画像が読み込まれた際に画像を表示 */}
      {filePreview && showResult && (
        <div className="m-4">
          <Image
            src={filePreview}
            alt="画像ファイル"
            width={500}
            height={500}
          />
        </div>
      )}

      {selectedFile && !showResult && (
        <div className="m-4">
          <Image
            src= "/images/result.png"
            alt="画像ファイル"
            width={500}
            height={500}
          />
        </div>
      )}

      {/* 画像が読み込まれた際にボタンを表示 */}
      {selectedFile && showResult && (
        <div className="m-4 flex space-x-10">
          <CustomButton onClick={removeFile} disabled={false}>
            画像を削除
          </CustomButton>
          {!desiredResults ? (
            <CustomButton onClick={handleCountUp} disabled={false}>
              画像を送信
            </CustomButton>
          ) : (
            <CustomButton onClick={handleMask} disabled={countShow}>
              画像をマスク
            </CustomButton>
          )}
        </div>
      )}

      {/* 戻るボタンの表示 */}
      {selectedFile && !showResult && (
        <div className="m-4">
          <CustomButton onClick={resetForm} disabled={false}>
            戻る
          </CustomButton>
        </div>
      )}

      {/* お試しのカウント表示 */}
      <p className="text-xl">カウント: {count}</p>
    </div>
  );
}
