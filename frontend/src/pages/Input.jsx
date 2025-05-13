import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const Input = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [accuracy, setAccuracy] = useState(0);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (!inputMessage.trim()) return;

    // Dummy prediction logic for spam or ham
    const response = inputMessage.includes("offer") || inputMessage.length % 2 === 0 ? "SPAM" : "HAM";
    const randomAccuracy = Math.floor(Math.random() * (95 - 70 + 1)) + 70; // Random accuracy between 70 and 95

    setMessages([
      ...messages,
      { sender: "user", text: inputMessage },
      { sender: "bot", text: `${response}`, accuracy: randomAccuracy },
    ]);

    setPrediction(response);
    setAccuracy(randomAccuracy);
    setInputMessage("");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-4">
      {/* Chat Header */}
      <div className="w-full flex items-center justify-start p-4 bg-zinc-900 shadow-md rounded-t-lg">
        <div className="flex items-center space-x-3">
          <FaUserCircle className="text-4xl text-fuchsia-500" />
          <div>
            <p className="text-xl font-semibold">SpliceMaster</p>
            <p className="text-sm text-gray-400">Online</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="w-full max-w-2xl bg-zinc-900 p-6 rounded-lg shadow-lg mt-4 space-y-4 overflow-y-auto max-h-96 flex-1">
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-[#B43BE3] text-white"
                    : "bg-[#FBC334] text-black"
                }`}
              >
                <p>{message.text}</p>
                {message.sender === "bot" && (
                  <p className="text-sm text-black-700 mt-1">Confidence: {message.accuracy}%</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Box and Submit Button */}
      <div className="w-full max-w-2xl bg-zinc-900 p-4 rounded-b-lg shadow-md mt-4">
        <textarea
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
          rows="3"
          className="w-full p-3 border-2 border-gray-700 bg-black text-white rounded-lg mb-3"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-fuchsia-600 text-white py-2 rounded-lg hover:bg-fuchsia-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;
