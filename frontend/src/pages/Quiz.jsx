import { useState } from 'react';
import EmailCard from '../components/EmailCard';
import ResultPanel from '../components/ResultPanel';
import dummyEmails from './dummyEmails.json'; // include if you want local dummy data

const Quiz = () => {
  const [emails] = useState(dummyEmails); // use static emails for now
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ user: 0, model: 0 });

  const handleClassification = (userLabel) => {
    const currentEmail = emails[currentIndex];
    const modelLabel = currentEmail.modelPrediction;

    if (userLabel === modelLabel) {
      setScore(prev => ({ ...prev, user: prev.user + 1 }));
    }
    setScore(prev => ({ ...prev, model: prev.model + 1 }));

    setCurrentIndex(prev => prev + 1);
  };

  return (
    <>
      {emails.length > 0 && currentIndex < emails.length ? (
        <EmailCard
          email={emails[currentIndex]}
          onClassify={handleClassification}
          index={currentIndex}
          total={emails.length}
        />
      ) : (
        <ResultPanel score={score} />
      )}
    </>
  );
};

export default Quiz;
