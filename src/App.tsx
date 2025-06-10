import { useState, useEffect, useRef } from 'react'
import './App.css'

// Interface for the API response
interface ChatAppearance {
  agentTitle: string
  welcomeMessage: string
  chatbotPrimaryBackground: string
  chatWindowBackground: string
  chatboatMessageBackground: string
  userChatMessageBackground: string
  sendMessageButton: string
  placeholder: string
  dashboardBgColor: string
  dashboardHeaderWelcomeText: string
  dashboardHeaderWelcomeEmoji: string
  avatar: string
  avatarUrl: string
  chatBubbleTitle: string
  chatBubbleIntroductoryMessage: string
  chatBubbleButtonText: string
}

interface AppearanceApiResponse {
  data: {
    chatAppearance: ChatAppearance
  }
  success: boolean
}

// Interface for chat messages API
interface ChatMessage {
  endUserID: number
  chatSessionID: number
  messageID: number
  sentDate: string
  userName: string
  senderType: "Bot" | "EndUser"
  senderID: number
  messageText: string
  senderUID: string | null
  tokenInfo: string | null
}

interface ChatMessagesApiResponse {
  message: string
  data: ChatMessage[]
  success: boolean
}

// Chat messages will be loaded from API

// Add prop types for LandingPage
interface LandingPageProps {
  appearance: ChatAppearance;
  openChat: () => void;
}

// Add prop types for ChatPage
interface ChatPageProps {
  appearance: ChatAppearance;
  messages: Array<{id: number, text: string, sender: string}>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  sendMessage: () => void;
  goBack: () => void;
  onNewChat: () => void;
}

// Move LandingPage outside App
const LandingPage = ({ appearance, openChat }: LandingPageProps) => (
  <div 
    className="min-h-screen flex flex-col"
    style={{ 
      background: `linear-gradient(to bottom, ${appearance.dashboardBgColor}, #f472b6)` 
    }}
  >
    {/* Header with Discord logo */}
    <div className="p-4">
      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
        {/* Discord logo - simplified version */}
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
        </svg>
      </div>
    </div>
    {/* Main content area */}
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      {/* Dynamic heading from API */}
      <h1 className="text-6xl font-bold text-white mb-8">{appearance.dashboardHeaderWelcomeText}</h1>
      {/* Dynamic emoji from API */}
      <div className="text-6xl mb-12">{appearance.dashboardHeaderWelcomeEmoji}</div>
      {/* Widget card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {/* Widget title - dynamic from API */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{appearance.chatBubbleTitle}</h2>
          {/* Widget message - dynamic from API */}
          <p className="text-gray-500 mb-6">{appearance.chatBubbleIntroductoryMessage}</p>
          {/* Widget button - dynamic from API */}
          <button
            onClick={openChat}
            className="w-full py-3 px-6 bg-red-400 hover:bg-red-500 text-white font-medium rounded-xl transition-colors"
          >
            {appearance.chatBubbleButtonText}
          </button>
        </div>
      </div>
    </div>
    {/* Bottom navigation */}
    <div className="flex justify-between items-center px-8 py-6">
      {/* Home icon */}
      <div className="flex flex-col items-center">
        <svg className="w-6 h-6 text-white/60 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-white/60 text-sm">Home</span>
      </div>
      {/* Messages icon */}
      <div className="flex flex-col items-center">
        <svg className="w-6 h-6 text-white/60 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-white/60 text-sm">Messages</span>
      </div>
    </div>
  </div>
);

// Move ChatPage outside App
const ChatPage = ({
  appearance, messages, inputValue, setInputValue, handleKeyPress, sendMessage, goBack, onNewChat
}: ChatPageProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  console.log('ChatPage rendered');
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="border rounded-2xl bg-white shadow-lg mx-auto my-8 max-w-5xl w-full min-h-[80vh] flex flex-col">
        {/* Header with dynamic background color */}
        <div 
          className="text-white px-4 py-3 flex items-center justify-between rounded-t-2xl"
          style={{ backgroundColor: appearance.chatbotPrimaryBackground }}
        >
          <div className="flex items-center">
            <button onClick={goBack} className="mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">{appearance.agentTitle}</h1>
          </div>
          {/* Dots menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 focus:outline-none"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="6" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="18" r="1.5" fill="currentColor" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
                <button
                  onClick={() => { setDropdownOpen(false); onNewChat(); }}
                  className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New chat
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center mr-3 flex-shrink-0">
                    {appearance.avatar ? (
                      <img 
                        src={`data:image/png;base64,${appearance.avatar}`}
                        alt="Bot Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V6C15 7.1 14.1 8 13 8S11 7.1 11 6V4L5 7V9C5 10.1 5.9 11 7 11S9 10.1 9 9V8L11 9V11C11 12.1 11.9 13 13 13S15 12.1 15 11V9L17 8V9C17 10.1 17.9 11 19 11S21 10.1 21 9Z"/>
                      </svg>
                    )}
                  </div>
                )}
                <div
                  className="px-4 py-2 rounded-2xl"
                  style={{
                    backgroundColor: message.sender === 'user' 
                      ? appearance.userChatMessageBackground 
                      : appearance.chatboatMessageBackground,
                    color: message.sender === 'user' ? 'white' : '#374151'
                  }}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Input area */}
        <div className="border-t bg-white p-4 rounded-b-2xl">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={appearance.placeholder}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              className="w-10 h-10 text-white rounded-full flex items-center justify-center hover:opacity-80 transition-colors"
              style={{ backgroundColor: appearance.sendMessageButton }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
          {/* Powered by ChatMaven */}
          <div className="text-center mt-3">
            <p className="text-xs text-gray-400">
              Powered by <span className="text-purple-500 font-medium">ChatMaven</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  // State to manage current view and chat messages
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing')
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: string}>>([])
  const [inputValue, setInputValue] = useState('')
  const [appearance, setAppearance] = useState<ChatAppearance | null>(null)
  const [loading, setLoading] = useState(true)
  const [chatSessionID, setChatSessionID] = useState<number | null>(null)

  // Define common headers for all API requests
  const apiHeaders = {
    'Content-Type': 'application/json',
    'X-API-KEY-CC-BI': 'iy45ytVZo40Ii1dzT78EJDpv3'
  };

  // Fetch appearance data and chat messages from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appearance data
        const appearanceResponse = await fetch('https://api2.chatmaven.ai/Appearance/GetAppearanceByUniqueId/iy45ytVZo40Ii1dzT78EJDpv3', {
          method: 'GET',
          headers: apiHeaders
        })
        const appearanceData: AppearanceApiResponse = await appearanceResponse.json()
        
        if (appearanceData.success && appearanceData.data.chatAppearance) {
          setAppearance(appearanceData.data.chatAppearance)
        }

        // Fetch chat messages
        const messagesResponse = await fetch('https://api2.chatmaven.ai/Chats/GetChatMessages?chatSessionID=449', {
          method: 'GET',
          headers: apiHeaders
        })
        const messagesData: ChatMessagesApiResponse = await messagesResponse.json()
        
        if (messagesData.success && messagesData.data) {
          // Transform API messages to our message format
          const transformedMessages = messagesData.data.map((msg, index) => ({
            id: msg.messageID || index + 1,
            text: msg.messageText.replace(/<[^>]*>/g, ''), // Remove HTML tags
            sender: msg.senderType === 'Bot' ? 'bot' : 'user'
          }))
          setMessages(transformedMessages)
        }

      } catch (error) {
        console.error('Failed to fetch data:', error)
        // Set fallback data if API fails
        // const fallbackMessages = [
        //   { id: 1, text: "Hello", sender: "user" },
        //   { id: 2, text: "I am a Chatbot!", sender: "bot" },
        //   { id: 3, text: "Hello again! How can I assist you today?", sender: "bot" }
        // ]
        // setMessages(fallbackMessages)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Function to handle opening chat
  const openChat = () => {
    setCurrentView('chat')
  }

  // Function to go back to landing page
  const goBack = () => {
    setCurrentView('landing')
  }

  // Start a new chat session and insert the first bot message
  const startNewChatSession = async (userMessage: string) => {
    // 1. Create new chat session
    const sessionRes = await fetch('https://api2.chatmaven.ai/Chats/InsertChatSession', {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify({
        botUniqueID: 'iy45ytVZo40Ii1dzT78EJDpv3',
        endUserID: null,
        messageText: userMessage
      })
    });
    const sessionData = await sessionRes.json();
    if (sessionData.success && sessionData.data) {
      const newSessionID = sessionData.data;
      setChatSessionID(newSessionID);
      // 2. Insert the first bot message
      const senderUID = `iy45ytVZo40Ii1dzT78EJDpv3_cs_${newSessionID}_enduser`;
      await fetch('https://api2.chatmaven.ai/Chats/InsertMessage', {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify({
          chatSessionID: newSessionID,
          senderType: 'Bot',
          senderID: 0,
          messageText: 'I am a Chatbot!',
          SenderUID: senderUID
        })
      });
      // 3. Fetch messages for the new session
      await fetchMessages(newSessionID);
      return newSessionID;
    }
    return null;
  };

  // Update fetchMessages to accept a session ID
  const fetchMessages = async (sessionId?: number | null) => {
    const id = sessionId ?? chatSessionID;
    if (!id) return;
    const messagesResponse = await fetch(`https://api2.chatmaven.ai/Chats/GetChatMessages?chatSessionID=${id}`, {
      method: 'GET',
      headers: apiHeaders
    });
    const messagesData: ChatMessagesApiResponse = await messagesResponse.json();
    if (messagesData.success && messagesData.data) {
      const transformedMessages = messagesData.data.map((msg, index) => ({
        id: msg.messageID || index + 1,
        text: msg.messageText.replace(/<[^>]*>/g, ''),
        sender: msg.senderType === 'Bot' ? 'bot' : 'user'
      }));
      setMessages(transformedMessages);
    }
  };

  // Update postMessage to accept session ID and send as EndUser
  const postMessage = async (text: string, sessionId: number) => {
    const senderUID = `iy45ytVZo40Ii1dzT78EJDpv3_cs_${sessionId}_enduser`;
    await fetch('https://api2.chatmaven.ai/Chats/InsertMessage', {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify({
        chatSessionID: sessionId,
        senderType: 'EndUser',
        senderID: 0,
        messageText: text,
        SenderUID: senderUID
      })
    });
  };

  // Update sendMessage to handle new session logic
  const sendMessage = async () => {
    if (inputValue.trim()) {
      if (!chatSessionID) {
        // Start new session and insert bot message
        const newSessionID = await startNewChatSession(inputValue);
        if (newSessionID) {
          // Insert the user's first message after session and bot message
          await postMessage(inputValue, newSessionID);
          setInputValue('');
          await fetchMessages(newSessionID);
        }
      } else {
        // Existing session: just post message
        await postMessage(inputValue, chatSessionID);
        setInputValue('');
        await fetchMessages();
      }
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  // Add handler for new chat
  const handleNewChat = () => {
    setCurrentView('chat');
    setMessages([]);
    setInputValue('');
    setChatSessionID(null);
    // The next message will start a new session
  };

  // Show loading spinner while fetching data
  if (loading || !appearance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  // Render current view
  return currentView === 'landing'
    ? <LandingPage appearance={appearance} openChat={openChat} />
    : <ChatPage
        appearance={appearance}
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleKeyPress={handleKeyPress}
        sendMessage={sendMessage}
        goBack={goBack}
        onNewChat={handleNewChat}
      />;
}

export default App
