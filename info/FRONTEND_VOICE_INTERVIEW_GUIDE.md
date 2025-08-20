# ElevenLabs Voice Interview Integration Guide

## Overview

This guide explains how to integrate ElevenLabs Conversational AI voice interviews into your React frontend application.

## API Endpoints

### 1. Start Voice Interview
```http
POST /api/v1/interviews/{interviewId}/voice/start
```

**Response:**
```json
{
  "sessionId": "signed-url-session",
  "status": "CREATED",
  "agentId": "agent_01k021stbteeds391ztek2baqz",
  "webhookUrl": "/api/v1/webhooks/elevenlabs/events",
  "signedUrl": "wss://hr.acm-ai.ru/ws-elevenlabs/v1/convai/conversation?agent_id=agent_01k021stbteeds391ztek2baqz&conversation_signature=cvtkn_01k027eavdfy4b3ppr6xk5rkyw",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 2. Get Voice Session Status
```http
GET /api/v1/interviews/{interviewId}/voice/status
```

### 3. End Voice Session
```http
POST /api/v1/interviews/{interviewId}/voice/end
```

## WebSocket Integration

### Step 1: Connect to WebSocket
```javascript
const connectToVoiceInterview = async (interviewId) => {
  try {
    // 1. Start voice session
    const response = await fetch(`/api/v1/interviews/${interviewId}/voice/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const sessionData = await response.json();
    const { signedUrl } = sessionData;
    
    // 2. Connect to WebSocket
    const ws = new WebSocket(signedUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      
      // 3. Send contextual_update with interview data
      const contextualUpdate = {
        type: "contextual_update",
        text: `interview_id: ${interviewId}, session_id: session_${interviewId}`
      };
      
      ws.send(JSON.stringify(contextualUpdate));
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    return ws;
  } catch (error) {
    console.error('Failed to start voice interview:', error);
    throw error;
  }
};
```

### Step 2: Handle WebSocket Messages
```javascript
const handleWebSocketMessage = (data) => {
  switch (data.type) {
    case 'conversation_started':
      console.log('Conversation started');
      break;
      
    case 'agent_message':
      console.log('Agent speaking:', data.text);
      // Handle agent speech
      break;
      
    case 'user_message':
      console.log('User said:', data.text);
      // Handle user speech
      break;
      
    case 'conversation_ended':
      console.log('Conversation ended');
      // Handle conversation end
      break;
      
    case 'error':
      console.error('WebSocket error:', data.error);
      break;
      
    default:
      console.log('Unknown message type:', data.type);
  }
};
```

## React Component Example

```jsx
import React, { useState, useEffect, useRef } from 'react';

const VoiceInterview = ({ interviewId }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [agentMessage, setAgentMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const wsRef = useRef(null);

  const startInterview = async () => {
    try {
      const ws = await connectToVoiceInterview(interviewId);
      wsRef.current = ws;
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  };

  const endInterview = async () => {
    try {
      // End voice session
      await fetch(`/api/v1/interviews/${interviewId}/voice/end`, {
        method: 'POST'
      });
      
      // Close WebSocket
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      setIsConnected(false);
    } catch (error) {
      console.error('Failed to end interview:', error);
    }
  };

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'agent_message':
        setAgentMessage(data.text);
        break;
      case 'user_message':
        setUserMessage(data.text);
        break;
      case 'conversation_ended':
        endInterview();
        break;
    }
  };

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };
    }
  }, []);

  return (
    <div className="voice-interview">
      <h2>Voice Interview</h2>
      
      {!isConnected ? (
        <button onClick={startInterview}>Start Interview</button>
      ) : (
        <div>
          <div className="status">Connected to voice interview</div>
          
          <div className="messages">
            {agentMessage && (
              <div className="agent-message">
                <strong>Agent:</strong> {agentMessage}
              </div>
            )}
            
            {userMessage && (
              <div className="user-message">
                <strong>You:</strong> {userMessage}
              </div>
            )}
          </div>
          
          <button onClick={endInterview}>End Interview</button>
        </div>
      )}
    </div>
  );
};

export default VoiceInterview;
```

## Error Handling

```javascript
const handleWebSocketError = (error) => {
  console.error('WebSocket error:', error);
  
  // Reconnect logic
  if (wsRef.current && wsRef.current.readyState === WebSocket.CLOSED) {
    setTimeout(() => {
      startInterview();
    }, 5000);
  }
};

const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }
};
```

## Key Points

1. **Contextual Update**: Always send `contextual_update` after WebSocket connection with `interview_id` and `session_id`
2. **Error Handling**: Implement proper error handling for both WebSocket and API calls
3. **Reconnection**: Consider implementing automatic reconnection logic
4. **State Management**: Track connection status and interview state
5. **Cleanup**: Always close WebSocket connection when component unmounts

## Migration Notes

- **Old approach**: Custom parameters in signed URL (not supported by ElevenLabs)
- **New approach**: Send data via `contextual_update` after WebSocket connection
- **Backend changes**: Removed custom parameters from signed URL request
- **Frontend changes**: Added `contextual_update` message after connection

## Testing

1. Test WebSocket connection with signed URL
2. Verify `contextual_update` is sent correctly
3. Test error scenarios (network issues, API errors)
4. Test interview flow from start to finish
5. Verify webhook calls are working properly 