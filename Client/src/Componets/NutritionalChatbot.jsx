// import { useState } from 'react';
// import ModelClient from "@azure-rest/ai-inference";
// import { AzureKeyCredential } from "@azure/core-auth";
// import dotenv from "dotenv";
// dotenv.config();


// const endpoint = process.env.CHATBOT_ENDPOINT_URL;
// const apiKey = process.env.CHATBOT_API_KEY
// const modelName = "Llama-4-Maverick-17B-128E-Instruct-FP8";

// export default function NutritionalChat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const client = new ModelClient(endpoint, new AzureKeyCredential(apiKey));

//   const handleSend = async () => {
//     if (!input.trim()) return;
    
//     setIsLoading(true);
//     const userMessage = { role: "user", content: input };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');

//     try {
//       const response = await client.path("/chat/completions").post({
//         body: {
//           messages: [
//             { 
//               role: "system", 
//               content: "You are a nutrition expert. Only answer food/health questions. Reject off-topic queries with: 'I specialize in nutrition. Ask me about food or wellness!'" 
//             },
//             ...messages.map(msg => ({ role: msg.role, content: msg.content })),
//             userMessage
//           ],
//           max_tokens: 500,
//           temperature: 0.7,
//           model: modelName,
//         }
//       });

//       if (response.status === 200) {
//         const botMessage = response.body.choices[0].message;
//         setMessages(prev => [...prev, botMessage]);
//       } else {
//         console.error("API error:", response.body.error);
//       }
//     } catch (err) {
//       console.error("Failed to call API:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="messages">
//         {messages.map((msg, i) => (
//           <div key={i} className={`message ${msg.role}`}>
//             {msg.content}
//           </div>
//         ))}
//         {isLoading && <div className="message assistant">Thinking...</div>}
//       </div>
//       <input
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         disabled={isLoading}
//         placeholder="Ask a nutrition question..."
//         onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//       />
//       <button onClick={handleSend} disabled={isLoading}>
//         Send
//       </button>
//     </div>
//   );
// }