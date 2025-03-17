import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceAssistantProps {
  onCommand?: (command: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const synth = window.speechSynthesis;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  useEffect(() => {
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!isListening) return; // Prevents processing when turned off

      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript.trim();
      setTranscript(transcriptText);

      if (event.results[current].isFinal) {
        handleCommand(transcriptText.toLowerCase());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    return () => {
      recognition.stop();
      synth.cancel(); // Ensure speech stops when component unmounts
    };
  }, [isListening]);

  const handleCommand = (command: string) => {
    if (!isListening) return; // Prevent processing when off

    if (command.includes('start listening')) {
      toggleListening();
    } else if (command.includes('stop listening')) {
      setIsListening(false);
      recognition.stop();
      synth.cancel(); // Stop any speech immediately
    } else if (command.includes('deposit') || command.includes('transfer') || command.includes('withdraw')) {
      onCommand?.(command);
      speak(`Opening ${command} form for you.`);
    } else if (command.includes('balance')) {
      speak('Showing your current balance.');
    } else if (command.includes('help')) {
      speak('Available commands: check balance, make deposit, withdraw money, transfer funds.');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      synth.cancel(); // Stop speaking immediately
    } else {
      recognition.start();
      setIsListening(true);
      speak('Voice assistant activated. How can I help you?');
    }
  };

  const speak = (text: string) => {
    if (!isListening) return; // Prevent speaking when off

    if (synth.speaking) {
      synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {transcript && isListening && (
          <div className="absolute bottom-16 right-0 bg-white p-3 rounded-lg shadow-lg mb-2 w-64">
            <p className="text-sm text-gray-600">{transcript}</p>
          </div>
        )}
        <button
          onClick={toggleListening}
          className={`p-4 rounded-full shadow-lg transition-colors ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-500 hover:bg-sky-600'
          }`}
          title={isListening ? 'Click to stop listening' : 'Click to start listening'}
        >
          {isListening ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
        </button>
      </div>
    </div>
  );
};

export default VoiceAssistant;
