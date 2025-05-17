const startBtn = document.getElementById('start-btn');
const transcriptEl = document.getElementById('transcript');
const responseEl = document.getElementById('response');

// Initialize Web Speech API recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

startBtn.onclick = () => {
  transcriptEl.textContent = 'Listening...';
  responseEl.textContent = '';
  recognition.start();
};

recognition.onresult = async (event) => {
  const userInput = event.results[0][0].transcript;
  transcriptEl.textContent = userInput;

  try {
    const aiResponse = await getAIResponse(userInput);
    responseEl.textContent = aiResponse;
    speak(aiResponse);
  } catch (error) {
    responseEl.textContent = 'Error fetching response.';
    console.error('AI API Error:', error);
  }
};

recognition.onerror = (event) => {
  transcriptEl.textContent = 'Speech recognition error';
  console.error('Speech recognition error:', event.error);
};

// Function to get AI response from OpenAI
async function getAIResponse(userText) {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: userText })
  });

  if (!response.ok) {
    throw new Error('Failed to get response from AI');
  }

  const data = await response.json();
  return data.reply;
}
// Function to speak text using speech synthesis
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.pitch = 1;
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}
