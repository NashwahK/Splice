import { useEffect, useState } from 'react';

const EmailCard = ({ email, onClassify }) => {
  const [timer, setTimer] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);

  // Reset state when new email is loaded
  useEffect(() => {
    setTimer(10);
    setShowAnswer(false);
    setUserAnswer(null);
  }, [email]); // this resets whenever a new question is loaded

  // Countdown timer logic
  useEffect(() => {
    if (showAnswer) return; // stop timer once answer is shown

    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          setShowAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [showAnswer]);

  // Auto advance after showing model prediction
  useEffect(() => {
    if (showAnswer) {
      const advance = setTimeout(() => {
        onClassify(userAnswer); // proceed with user's choice (or null)
      }, 2000);
      return () => clearTimeout(advance);
    }
  }, [showAnswer]);

  const handleUserClick = (label) => {
    if (!showAnswer) {
      setUserAnswer(label);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 relative">

      {/* Timer */}
      <div className="absolute top-4 left-4 text-lg font-mono bg-zinc-800 px-3 py-1 rounded">
        ⏱️ {timer}s
      </div>

      {/* Computer */}
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold text-fuchsia-400">
          Computer: {showAnswer ? email.modelPrediction.toUpperCase() : 'Thinking...'}
        </h2>
      </div>

      {/* Email content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-zinc-900 p-6 rounded-xl shadow-xl max-w-2xl w-full text-center">
          <p className="text-xl font-medium leading-relaxed">{email.text}</p>
        </div>
      </div>

      {/* Options */}
      <div className="flex justify-center gap-10 mt-10 pb-6">
        <button
          onClick={() => handleUserClick("spam")}
          disabled={showAnswer}
          className={`px-6 py-3 rounded-full text-lg font-semibold ${
            userAnswer === "spam" ? "bg-red-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          SPAM
        </button>
        <button
          onClick={() => handleUserClick("ham")}
          disabled={showAnswer}
          className={`px-6 py-3 rounded-full text-lg font-semibold ${
            userAnswer === "ham" ? "bg-green-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          HAM
        </button>
      </div>
    </div>
  );
};

export default EmailCard;
