import { useNavigate } from 'react-router-dom';

const ResultPanel = ({ score }) => {
  const navigate = useNavigate();

  const userScore = score?.user || 0;
  const naiveScore = score?.naive || 0;
  const svmScore = score?.svm || 0;

  const handleRestart = () => {
    navigate('/');
    setTimeout(() => navigate('/quiz'), 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-zinc-900 p-10 rounded-2xl shadow-lg w-full max-w-md text-center space-y-6 border border-zinc-800">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#B43BE3] to-[#FBC334] bg-clip-text text-transparent">
          Quiz Complete
        </h1>

        <div className="text-lg space-y-3">
          <p>
            <span className="text-zinc-400">Your Score:</span>{' '}
            <span className="text-[#B43BE3] font-semibold">{userScore}</span>
          </p>
          <p>
            <span className="text-zinc-400">Naive Bayes:</span>{' '}
            <span className="text-[#FBC334] font-semibold">{naiveScore}</span>
          </p>
          <p>
            <span className="text-zinc-400">SVM:</span>{' '}
            <span className="text-[#D2749A] font-semibold">{svmScore}</span>
          </p>
        </div>

        <div className="space-y-2 pt-4">
          <button
            onClick={handleRestart}
            className="w-full bg-gradient-to-r from-[#B43BE3] to-[#FBC334] text-black font-bold py-2 px-4 rounded-full transition hover:brightness-110"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-zinc-500 underline hover:text-white transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPanel;
