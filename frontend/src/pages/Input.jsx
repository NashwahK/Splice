import { useState } from "react";
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";

const Input = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [accuracy, setAccuracy] = useState(0);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage("");

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage }
    ]);

    try {
      const res = await fetch("https://splice-production.up.railway.app/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();

      const botResponse = `
        Naive Bayes: ${data.naive_bayes} (${data.naive_bayes_confidence})
        SVM: ${data.svm} (${data.svm_confidence})
      `;

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botResponse }
      ]);
    } catch (err) {
      console.error("Error fetching prediction:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error fetching prediction. Please try again." }
      ]);
    }
  };

  const handleReport = async (category, label) => {
    const userMessage = inputMessage;
    setInputMessage("");

    try {
      await fetch("https://splice-production.up.railway.app/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          category: category,
          message: userMessage,
          label: label
        })
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `${category.charAt(0).toUpperCase() + category.slice(1)} reported successfully.` }
      ]);
    } catch (err) {
      console.error("Error reporting message:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error reporting message. Please try again." }
      ]);
    }
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
      <div className="w-full bg-zinc-900 p-6 rounded-lg shadow-lg mt-4 space-y-4 overflow-y-auto max-h-96 flex-1">
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                  message.sender === "user" ? "bg-[#B43BE3] text-white" : "bg-[#FBC334] text-black"
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Box and Buttons */}
      <div className="w-full bg-zinc-900 p-4 rounded-b-lg shadow-md mt-4 flex items-center space-x-3">
        <textarea
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
          rows="3"
          className="w-full p-3 border-2 border-gray-700 bg-black text-white rounded-lg"
        />
        <button
          onClick={handleSubmit}
          className="w-16 h-16 bg-fuchsia-600 text-white flex items-center justify-center rounded-full hover:bg-fuchsia-700 focus:outline-none transition"
        >
          <FaPaperPlane className="text-2xl" />
        </button>
      </div>

      {/* Report Buttons */}
      <div className="w-full flex justify-between mt-3 space-x-2">
        <button
          onClick={() => handleReport('spam', 1)}
          className="w-full border-2 text-white py-2 rounded-lg hover:border-red-600 hover:text-red-600 transition"
        >
          Report as Spam
        </button>
        <button
          onClick={() => handleReport('ham', 0)}
          className="w-full border-2 text-white py-2 rounded-lg hover:bg-green-600 hover:text-green-600 transition"
        >
          Report as Ham
        </button>
      </div>
    </div>
  );
};

export default Input;
