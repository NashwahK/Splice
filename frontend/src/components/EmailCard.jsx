import { useEffect, useState } from 'react';

const EmailCard = ({ email, onClassify }) => {
  const [timer, setTimer] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);
  const [missedAnswer, setMissedAnswer] = useState(false);
  const [naiveBayesPrediction, setNaiveBayesPrediction] = useState(null);
  const [svmPrediction, setSvmPrediction] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch('https://splice-production.up.railway.app/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: email.text }),
        });

        const data = await res.json();
        setNaiveBayesPrediction(data.naive_bayes.toLowerCase());
        setSvmPrediction(data.svm.toLowerCase());
      } catch (err) {
        console.error('Prediction fetch failed:', err);
      }
    };

    // Reset state
    setTimer(10);
    setShowAnswer(false);
    setUserAnswer(null);
    setMissedAnswer(false);
    setNaiveBayesPrediction(null);
    setSvmPrediction(null);

    fetchPredictions();
  }, [email]);

  // Countdown logic
  useEffect(() => {
    if (showAnswer) return;

    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          setShowAnswer(true);
          setMissedAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [showAnswer]);

  // Auto advance + scoring after 2s delay
  useEffect(() => {
    if (showAnswer) {
      const delay = setTimeout(() => {
        const trueLabel = email.trueLabel
        const trueLabelText = trueLabel === 1 ? 'spam' : 'ham';
        const score = {
          user: userAnswer === trueLabelText ? 1 : 0,
          naive: naiveBayesPrediction === trueLabelText ? 1 : 0,
          svm: svmPrediction === trueLabelText ? 1 : 0,
        };
        console.log(score)

        onClassify(score);
      }, 2000);

      return () => clearTimeout(delay);
    }
  }, [showAnswer]);

  const handleUserClick = (label) => {
    if (!showAnswer) {
      setUserAnswer(label);
      setShowAnswer(true);
    }
  };

  const labelToText = (label) => {
    if (label === "spam" || label === 1) return "SPAM";
    if (label === "ham" || label === 0) return "HAM";
    return "—";
  };

  const Loader = () => (
    <div className="inline-block">
      <span className="dot">.</span>
      <span className="dot">.</span>
      <span className="dot">.</span>
      <style jsx>{`
        .dot {
          animation: blink 1.5s infinite step-start;
          color: #FBC334;
        }
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .dot:nth-child(2) {
          animation-delay: 0.3s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.6s;
        }
        @keyframes blink {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 relative">
      <div className="absolute top-4 left-4 text-lg font-mono bg-zinc-800 px-3 py-1 rounded">
        ⏱️ {timer}s
      </div>

      {/* Computer Prediction */}
      <div className="text-center mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-[#B43BE3]">
          Naive Bayes: {showAnswer ? labelToText(naiveBayesPrediction) : <Loader />}
        </h2>
        <h2 className="text-xl font-semibold text-[#FBC334]">
          SVM: {showAnswer ? labelToText(svmPrediction) : <Loader />}
        </h2>
      </div>

      {/* Email */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-zinc-900 p-6 rounded-xl shadow-xl max-w-2xl w-full text-center">
          <div className="text-xl font-medium leading-relaxed overflow-y-auto max-h-[20rem] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800 pr-2 text-left">
            {email.text}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-10 mt-10 pb-6">
        <button
          onClick={() => handleUserClick("spam")}
          disabled={showAnswer}
          className={`px-6 py-3 rounded-full text-lg font-semibold ${missedAnswer && userAnswer === "spam" ? "bg-red-700" : "bg-red-600 hover:bg-red-700"}`}
        >
          SPAM
        </button>
        <button
          onClick={() => handleUserClick("ham")}
          disabled={showAnswer}
          className={`px-6 py-3 rounded-full text-lg font-semibold ${missedAnswer && userAnswer === "ham" ? "bg-green-700" : "bg-green-600 hover:bg-green-700"}`}
        >
          HAM
        </button>
      </div>

      {/* Feedback if missed */}
      {missedAnswer && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl text-yellow-400">
          <p>You missed this one. Correct: {labelToText(email.trueLabel)}</p>
        </div>
      )}
    </div>
  );
};

export default EmailCard;
