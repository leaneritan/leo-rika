import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-6 bg-[#090b18] text-white">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl text-muted">ページが見つかりませんでした</p>
      <button onClick={() => navigate('/')} className="btn-primary bg-white/10">ホームに戻る</button>
    </div>
  );
};

export default NotFound;
