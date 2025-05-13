import { useState, useEffect } from 'react';
import EmailCard from '../components/EmailCard';
import ResultPanel from '../components/ResultPanel';

const Quiz = () => {
  const [emails, setEmails] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ user: 0, naive: 0, svm: 0 });
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://splice-production.up.railway.app/quiz-data');
        const data = await res.json();
        setEmails(data.slice(0, 5));
      } catch (err) {
        console.error('Error loading quiz data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // No longer fetches predictions, just receives score update from EmailCard
  const handleClassification = (newScore) => {
    setScore(prev => ({
      user: prev.user + newScore.user,
      naive: prev.naive + newScore.naive,
      svm: prev.svm + newScore.svm,
    }));
    setCurrentIndex(prev => prev + 1);
  };

  if (loading) {
    return <div className="text-center text-white mt-20">Loading quiz...</div>;
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <h1 className="text-4xl font-bold text-white">Ready to</h1>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#B43BE3] to-[#FBC334] text-transparent bg-clip-text">
            splice
          </h1>
          <h1 className="text-4xl font-bold text-white">through some spams?</h1>
        </div>

        <button
          onClick={() => setQuizStarted(true)}
          className="bg-fuchsia-600 border-2 border-transparent hover:bg-fuchsia-700 hover:border-red-300 focus:outline-none text-white px-6 py-3 rounded-full text-lg font-semibold transition"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  return (
    <>
      {emails.length > 0 && currentIndex < emails.length ? (
        <div className='relative min-h-screen'>
        <div className="absolute top-4 right-4 bg-zinc-800 px-4 py-2 rounded text-sm">
          <p className="text-green-400">You: {score.user}</p>
          <p className="text-yellow-400">NB: {score.naive}</p>
          <p className="text-blue-400">SVM: {score.svm}</p>
        </div>

        <EmailCard
          email={emails[currentIndex]}
          onClassify={handleClassification}
        />
        </div>
      ) : (
        <ResultPanel score={score} />
      )}
    </>
  );
};

export default Quiz;
