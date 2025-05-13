import quiz from '../assets/quiz.png';
import input from '../assets/input.png';
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* Title */}
      <div className="pcb-text mb-4">
        <p>Splice</p>
      </div>

      {/* Subtitle */}
      <p className="text-lg text-center mb-10 max-w-md">
        Your friendly neighbourhood spam detector
      </p>

      {/* Cards */}
      <section className="flex gap-8 flex-wrap justify-center">
        {/* Quiz Card */}
        <button
          aria-label="Start Quiz"
          onClick={() => navigate("/quiz")}
          className="border-2 border-fuchsia-500 rounded-2xl p-6 w-60 text-center bg-transparent hover:bg-fuchsia-900/10 transition-transform transform hover:scale-105 hover:border-fuchsia-600 focus:outline-none"
        >
          <img src={quiz} alt="Quiz Icon" className="w-16 h-16 mx-auto mb-4" />
          <p className="text-sm font-medium">Compete with the Computer</p>
        </button>

        {/* Test Spam Card */}
        <button
          aria-label="Test Emails for Spam"
          onClick={() => navigate("/input")}
          className="border-2 border-yellow-400 rounded-2xl p-6 w-60 text-center bg-transparent hover:bg-yellow-900/10 transition-transform transform hover:scale-105 hover:border-yellow-500 focus:outline-none"
        >
          <img src={input} alt="Input Icon" className="w-16 h-16 mx-auto mb-4" />
          <p className="text-sm font-medium">Test spam in your emails</p>
        </button>
      </section>
    </main>
  );
}
