import { useState, useEffect, useRef } from 'react'

function Chatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I'm your official SmartGN Assistant. How can I help you today?"
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (!isOpen) return null

  // Guided response logic
  const getAssistantResponse = (userText) => {
    const text = userText.toLowerCase()
    
    if (text.includes('profile')) {
      return "To edit your profile, please follow these steps:\n\n1. Click on the 'Profile' tab in the side navigation menu.\n2. Once on the My Profile page, click the 'Edit profile' button in the top right of the profile card.\n3. Update your details and save your changes."
    }
    
    if (text.includes('certificate')) {
      return "To request certificates, please follow these steps:\n\n1. Go to the 'Certificates' tab in your side menu or click 'Request Certificates' in Quick Actions.\n2. Select your certificate type (e.g., Character, Income, or Residency).\n3. Fill in the required details and upload your verified supporting documents.\n4. Click Submit. Your GN Officer will receive it immediately."
    }

    if (text.includes('appointment')) {
      return "To book an appointment, please follow these steps:\n\n1. Navigate to the 'Appointments' tab in your sidebar.\n2. Select an available date on the calendar and choose a preferred time slot.\n3. Enter the purpose of your visit and click 'Confirm Appointment'."
    }

    if (text.includes('allowance')) {
      return "To apply for government allowance programs:\n\n1. Go to the 'Allowance Programs' tab in the sidebar.\n2. Browse active schemes (such as Aswesuma, Samurdhi, or senior citizen benefits).\n3. Fill out the digital application form and submit it for GN and divisional approval."
    }

    if (text.includes('disaster') || text.includes('relief')) {
      return "To report disaster damage or request immediate relief aid:\n\n1. Navigate to 'Disaster Report' in the sidebar or click 'Disaster Relief' in Quick Actions.\n2. Enter the type of disaster, estimate your damage level, and specify any urgent food, health, or shelter aid needed.\n3. Click Submit to alert your GN Division emergency team."
    }

    return "I am here to help you navigate SmartGN! You can ask me about:\n\n• How to edit your profile\n• How to request certificates\n• How to book appointments\n• How to apply for allowances\n• How to report disaster damage"
  }

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return

    // 1. Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // 2. Trigger assistant typing response
    setTimeout(() => {
      const responseText = getAssistantResponse(textToSend)
      const assistantMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: responseText
      }
      setMessages(prev => [...prev, assistantMessage])
    }, 600)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue)
    }
  }

  // Quick Action Prompts
  const quickPrompts = [
    "How can I edit my profile?",
    "How do I request certificates?",
    "Book an appointment",
    "Report disaster damage"
  ]

  return (
    <div className="chatbot-window">
      
      {/* Header */}
      <div className="chatbot-header">
        <div className="header-left-avatar">
          <div className="chatbot-robot-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"></rect>
              <circle cx="12" cy="5" r="2"></circle>
              <path d="M12 7v4"></path>
              <line x1="8" y1="16" x2="8" y2="16"></line>
              <line x1="16" y1="16" x2="16" y2="16"></line>
            </svg>
          </div>
          <div className="chatbot-header-text">
            <h4>SmartGN Assistant</h4>
            <span className="online-indicator">
              <span className="green-dot"></span>
              ONLINE
            </span>
          </div>
        </div>
        <button className="chatbot-close-btn" onClick={onClose} aria-label="Close Chatbot">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Message Area */}
      <div className="chatbot-messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
            
            {msg.sender === 'assistant' && (
              <div className="avatar-icon assistant-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                  <circle cx="12" cy="5" r="2"></circle>
                  <path d="M12 7v4"></path>
                </svg>
              </div>
            )}

            <div className={`chat-bubble ${msg.sender}`}>
              <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
            </div>

            {msg.sender === 'user' && (
              <div className="avatar-icon user-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}

          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Guided Quick Prompts Chips */}
      <div className="quick-prompts-container">
        {quickPrompts.map((prompt, idx) => (
          <button 
            key={idx} 
            className="quick-prompt-chip"
            onClick={() => handleSendMessage(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="chatbot-input-container">
        <input 
          type="text" 
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="chatbot-input"
        />
        <button 
          className="chatbot-send-btn" 
          onClick={() => handleSendMessage(inputValue)}
          aria-label="Send Message"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>

    </div>
  )
}

export default Chatbot
