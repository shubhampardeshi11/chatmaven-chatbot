import { useState, useEffect } from 'react';
import axios from 'axios';

interface FormData {
  Name: string;
  Email: string;
  Phone: string;
  Message: string;
}

interface LeadFormProps {
  chatSessionID: number | null;
  botID: string;
  onClose: () => void;
}

// API Response interfaces
interface ChatSessionResponse {
  message: string;
  data: number;
  success: boolean;
}

interface MessageResponse {
  message: string;
  data: null;
  success: boolean;
}

const LeadForm = ({ chatSessionID, botID, onClose }: LeadFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    Name: '',
    Email: '',
    Phone: '',
    Message: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string | undefined}>({});

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error for the field being changed
    setValidationErrors(prev => ({
      ...prev,
      [e.target.name]: undefined
    }));
  };

  const validateForm = () => {
    const errors: {[key: string]: string | undefined} = {};
    if (!formData.Name.trim()) {
      errors.Name = 'Name is required';
    }
    if (!formData.Email.trim()) {
      errors.Email = 'Email is required';
    } else if (!/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.Email)) {
      errors.Email = 'Invalid email format';
    }
    if (!formData.Phone.trim()) {
      errors.Phone = 'Phone Number is required';
    } else if (!/^[0-9]+$/.test(formData.Phone)) {
      errors.Phone = 'Phone Number must contain only digits';
    }
    if (!formData.Message.trim()) {
      errors.Message = 'Message is required';
    }
    return errors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(false);
    setValidationErrors({}); // Clear previous validation errors

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return; // Stop submission if there are validation errors
    }

    try {
      // 1. First create a new chat session if we don't have one
      let currentSessionID = chatSessionID;
      if (!currentSessionID) {
        const sessionRes = await axios.post<ChatSessionResponse>(
          'https://api2.chatmaven.ai/Chats/InsertChatSession',
          {
            botUniqueID: botID,
            endUserID: null,
            messageText: ""
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY-CC-BI': botID
            }
          }
        );
        if (sessionRes.data.success) {
          currentSessionID = sessionRes.data.data;
        }
      }

      if (!currentSessionID) {
        throw new Error('Failed to create chat session');
      }

      // 2. Insert bot welcome message
      await axios.post<MessageResponse>(
        'https://api2.chatmaven.ai/Chats/InsertMessage',
        {
          chatSessionID: currentSessionID,
          senderType: "Bot",
          senderID: 0,
          messageText: "I am a Chatbot! How may I help you? \r\n",
          SenderUID: `${botID}_cs_${currentSessionID}_enduser`
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY-CC-BI': botID
          }
        }
      );

      // 3. Submit the contact form
      await axios.post<MessageResponse>(
        'https://api2.chatmaven.ai/chats/submitcontactform',
        {
          MessageSentBodyText: "Thank you for your message, we will get back to you as soon as possible.",
          MessageSentHeaderText: "Message Sent",
          Name: formData.Name,
          Email: formData.Email,
          Phone: formData.Phone,
          Message: formData.Message,
          BotId: botID,
          ChatSessionID: currentSessionID.toString()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY-CC-BI': botID
          }
        }
      );

      setSuccess(true);
      setFormData({ Name: '', Email: '', Phone: '', Message: '' }); // Clear form on success
      // Hide form after successful submission
      setTimeout(() => onClose(), 1500); 
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(true);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{
        ...styles.form,
        transform: animateIn ? 'translateY(0)' : 'translateY(100%)',
        opacity: animateIn ? 1 : 0,
      }}
    >
      <h3 style={styles.heading}>Get in touch</h3>

      <input
        name="Name"
        placeholder="Name"
        value={formData.Name}
        onChange={handleChange}
        required
        style={styles.input}
      />
      {validationErrors.Name && <p style={styles.errorText}>{validationErrors.Name}</p>}
      <input
        name="Email"
        placeholder="Email"
        type="email"
        value={formData.Email}
        onChange={handleChange}
        required
        style={styles.input}
      />
      {validationErrors.Email && <p style={styles.errorText}>{validationErrors.Email}</p>}
      <input
        name="Phone"
        placeholder="Phone Number"
        value={formData.Phone}
        onChange={handleChange}
        required
        style={styles.input}
      />
      {validationErrors.Phone && <p style={styles.errorText}>{validationErrors.Phone}</p>}
      <textarea
        name="Message"
        placeholder="Message"
        rows={3}
        value={formData.Message}
        onChange={handleChange}
        required
        style={{...styles.textarea, color: '#333'}}
      ></textarea>
      {validationErrors.Message && <p style={styles.errorText}>{validationErrors.Message}</p>}

      <button type="submit" style={styles.button}>Submit</button>

      {success && <p style={styles.success}>✅ Message Sent Successfully</p>}
      {error && <p style={styles.error}>❌ Failed to submit the message</p>}
    </form>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    width: '300px',
    backgroundColor: '#ff66cc',
    padding: '20px',
    borderRadius: '15px',
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    color: '#fff',
    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
  },
  heading: {
    marginBottom: '15px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
    border: 'none',
    color: '#333', // Ensure text is visible
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    marginBottom: '10px',
  },
  button: {
    backgroundColor: '#004AB1',
    color: '#fff',
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
  success: {
    marginTop: '10px',
    color: '#d4ffcc',
  },
  error: {
    marginTop: '10px',
    color: '#ffcccc',
  },
  errorText: {
    color: '#ffcccc',
    fontSize: '0.8rem',
    marginTop: '-8px',
    marginBottom: '10px',
  }
};

export default LeadForm; 