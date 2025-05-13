import React from 'react';
import { useNavigate } from 'react-router-dom';

const ResultPanel = ({ score }) => {
  const navigate = useNavigate();
  const total = score.total || score.user + score.model;

  const handleRestart = () => {
    navigate('/'); // go home first
    setTimeout(() => navigate('/quiz'), 0); // then go to quiz again — this forces remount
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="bg-zinc-900 p-10 rounded-2xl shadow-2xl w-full max-w-md text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-fuchsia-400">Quiz Complete!</h1>

        <div className="text-lg space-y-2">
          <p>
            You got <span className="text-green-400 font-bold">{score.user}</span> correct
          </p>
          <p>
            The computer got <span className="text-yellow-400 font-bold">{score.model}</span> correct
          </p>
          <p className="text-sm text-zinc-400">
            Accuracy: <span className="text-white font-semibold">
              {((score.user / total) * 100).toFixed(1)}%
            </span>
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleRestart}
            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-2 px-4 rounded-full transition"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate('/')}
            className="text-sm text-zinc-400 underline hover:text-white"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPanel;
