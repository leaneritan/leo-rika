import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div className="space-y-5">
        <h1 className="text-6xl font-black text-white">404</h1>
        <p className="text-muted">ページが見つかりませんでした</p>
        <button type="button" onClick={() => navigate('/')} className="btn-primary bg-white/10 hover:bg-white/20">
          Home
        </button>
      </div>
    </main>
  );
};

export default NotFound;
