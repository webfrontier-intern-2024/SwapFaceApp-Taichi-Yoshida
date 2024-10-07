"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

import { CustomButton } from "./components/custom-button";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  // ファイルが変更されたときにURLを生成してプレビューを設定
  useEffect(() => {
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
      return () => {
        URL.revokeObjectURL(previewUrl); // クリーンアップ
      };
    }
  }, [selectedFile]);

  // react-dropzone を使ったドロップゾーン設定
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
  });

  // ファイルを削除する
  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  // カウントアップ関数
  const handleCountUp = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 font-sans min-h-screen">
      {/* ファイルがない場合にドロップゾーンを表示 */}
      {!selectedFile && (
        <div
          {...getRootProps()}
          className="flex items-center justify-center w-96 h-60 border-2 border-dashed border-blue-400 rounded-lg bg-white cursor-pointer"
        >
          <input {...getInputProps()} />
          <p className="text-gray-500 m-8 text-center">
            ここに以下の拡張子に該当するファイルを<br/>ドラッグ＆ドロップするか、<br/>クリックしてファイルを選択してください <br/> (png, jpeg, jpg)
          </p>
        </div>
      )}
      {/*画像ファイルが読み込まれた際に画像を表示*/}
      {filePreview && (
        <div className="m-4">
          <Image
            src={filePreview}
            alt="ファイルプレビュー"
            width={500}
            height= {500}
          />
        </div>
      )}

      {/* 画像ファイルが入った際に出現するボタン */}
      {selectedFile && (
        <div className="m-4 flex space-x-10">
          <CustomButton onClick={removeFile}>
            画像を削除
          </CustomButton>
          <CustomButton onClick={handleCountUp}>
            画像を送信
          </CustomButton>
        </div>
      )}

      {/* カウント表示：ボタンが機能しているかのテスト */}
      <p className="text-xl">カウント: {count}</p>

    </div>
  );
}
