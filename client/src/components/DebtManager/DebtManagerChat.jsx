import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import styled from 'styled-components';

const ChatContainer = styled(Box)`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  overflow-y: auto; /* Enable scrolling */
`;

const BotMessage = styled(Box)`
  background: #f1f0fe;
  padding: 15px;
  border-radius: 20px 20px 20px 5px;
  margin: 10px 0;
  max-width: 85%;
  animation: fadeIn 0.3s ease-in;
  position: relative;
`;

const UserMessage = styled(Box)`
  background: #dcf8c6;
  padding: 15px;
  border-radius: 20px 20px 5px 20px;
  margin: 10px 0 10px auto;
  max-width: 85%;
  animation: fadeIn 0.3s ease-in;
`;

const TypingIndicator = styled(Box)`
  display: flex;
  padding: 10px;
  animation: fadeIn 0.3s ease-in;
`;

const TypingDot = styled(Box)`
  height: 8px;
  width: 8px;
  margin: 0 3px;
  background: #ddd;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
`;

const InputContainer = styled(Box)`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const ChoiceButtons = styled(Box)`
  display: flex;
  gap: 10px;
  margin: 10px 0;
`;

const ChoiceButton = styled(Button)`
  background: #e5efff;
  color: #0084ff;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0084ff;
    color: white;
  }
`;

const DebtManagerChat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [currentDebt, setCurrentDebt] = useState({});
    const [debts, setDebts] = useState([]);
    const [typing, setTyping] = useState(false);
    const chatContainerRef = useRef(null);

    const extraPayment = 100; // Example extra payment amount

    const questions = [
        {
            text: ["Let's get started! What should we call this debt?", "First, how would you name this obligation?"],
            field: 'name'
        },
        {
            text: ["What's the current amount owed?", "Could you share the remaining balance for this debt?"],
            field: 'balance'
        },
        {
            text: ["What annual interest rate is applied?", "What percentage interest are you being charged yearly?"],
            field: 'interestRate'
        },
        {
            text: ["What's the required minimum payment?", "How much must you pay each month at minimum?"],
            field: 'minPayment'
        },
        {
            text: ["Would you like to add another debt?", "Should we include another financial obligation?"],
            field: 'moreDebts'
        }
    ];

    useEffect(() => {
        askQuestion();
    }, []);

    useEffect(() => {
        // Scroll to the bottom of the chat container when new messages are added
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const showTypingIndicator = () => {
        setTyping(true);
    };

    const hideTypingIndicator = () => {
        setTyping(false);
    };

    const addMessage = (msg, isUser = false) => {
        setMessages(prevMessages => [...prevMessages, { text: msg, isUser }]);
    };

    const askQuestion = async () => {
        const question = questions[currentStep];
        showTypingIndicator();

        await new Promise(resolve => setTimeout(resolve, 1500));
        hideTypingIndicator();

        const randomQuestion = question.text[Math.floor(Math.random() * question.text.length)];
        addMessage(randomQuestion);

        if (question.field === 'moreDebts') {
            showChoiceButtons();
        }
    };

    const showChoiceButtons = () => {
        setMessages(prevMessages => [
            ...prevMessages,
            {
                type: 'choice',
                choices: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' }
                ]
            }
        ]);
    };

    const handleChoice = (choice) => {
        // Remove choice buttons from messages
        setMessages(prevMessages => prevMessages.filter(msg => msg.type !== 'choice'));
        processAnswer(choice);
    };

    const processAnswer = async (answer = null) => {
        let finalAnswer = answer || userInput.trim();

        if (!finalAnswer && currentStep !== 4) return;

        addMessage(finalAnswer, true);
        setUserInput('');

        if (currentStep < 4) {
            setCurrentDebt(prevDebt => ({ ...prevDebt, [questions[currentStep].field]: finalAnswer }));
            setCurrentStep(prevStep => prevStep + 1);
            askQuestion();
        } else if (currentStep === 4) {
            setCurrentDebt(prevDebt => ({ ...prevDebt, [questions[currentStep].field]: finalAnswer }));
            setDebts(prevDebts => [...prevDebts, currentDebt]);
            setCurrentDebt({});

            if (finalAnswer.toLowerCase() === 'yes') {
                setCurrentStep(0); // Restart the debt entry process
                askQuestion();
            } else {
                calculatePayoffPlan();
            }
        }
    };

    const calculatePayoffPlan = async () => {
        addMessage("🧮 Crunching numbers... This might take a moment");

        try {
            const response = await fetch('/api/debt-payoff/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ debts, extraPayment }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            showPayoffDetails(data.payoffPlan, data.totalInterest);
        } catch (error) {
            console.error("Failed to calculate payoff plan:", error);
            addMessage("An error occurred while calculating the payoff plan.");
        }
    };

    const showPayoffDetails = (plan, totalInterest) => {
        let message = "<strong>Recommended Payoff Plan (Snowball method):</strong>";

        // Show all months in detail
        plan.forEach(month => {
            const focusDebt = month.payments.find(p => p.name === month.focusDebt);
            message += `
                <div style="margin-top:15px; background:#f8f9fa; padding:10px; border-radius:8px;">
                    🗓️ <strong>Month ${month.month}</strong>: Focus on ${month.focusDebt}<br>
                    💰 Principal Paid: $${focusDebt.paid.toFixed(2)}<br>
                    📈 Interest Accrued: $${focusDebt.interest.toFixed(2)}<br>
                    ✅ Remaining Balance: $${month.remaining.toFixed(2)}
                </div>
            `;
        });

        // Show summary
        message += `
            <div style="margin-top:20px; background:#e3f2fd; padding:15px; border-radius:8px;">
                ⏱️ Total Months: ${plan.length}<br>
                💸 Total Interest Paid: $${totalInterest.toFixed(2)}<br>
                🎯 Final Payment Date: Month ${plan.length}
            </div>
        `;

        addMessage(message);
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleInputKeyPress = (event) => {
        if (event.key === 'Enter') {
            processAnswer();
        }
    };

    return (
        <Box sx={{ maxWidth: '600px', margin: '20px auto', padding: '20px', background: '#f0f2f5' }}>
            <ChatContainer ref={chatContainerRef}>
                {messages.map((msg, index) => (
                    msg.type === 'choice' ? (
                        <ChoiceButtons key={index}>
                            {msg.choices.map(choice => (
                                <ChoiceButton key={choice.value} onClick={() => handleChoice(choice.value)}>
                                    {choice.label}
                                </ChoiceButton>
                            ))}
                        </ChoiceButtons>
                    ) : (
                        <Box key={index} className={msg.isUser ? 'user-msg' : 'bot-msg'} sx={{
                            background: msg.isUser ? '#dcf8c6' : '#f1f0fe',
                            padding: '15px',
                            borderRadius: msg.isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                            margin: '10px 0',
                            maxWidth: '85%',
                            animation: 'fadeIn 0.3s ease-in',
                            marginLeft: msg.isUser ? 'auto' : '0',
                            textAlign: msg.isUser ? 'right' : 'left',
                        }}>
                            <Typography dangerouslySetInnerHTML={{ __html: msg.text }} />
                        </Box>
                    )
                ))}
                {typing && (
                    <TypingIndicator>
                        <TypingDot />
                        <TypingDot />
                        <TypingDot />
                    </TypingIndicator>
                )}
            </ChatContainer>
            <InputContainer>
                <TextField
                    fullWidth
                    placeholder="Type your response..."
                    variant="outlined"
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyPress={handleInputKeyPress}
                />
                <Button variant="contained" color="primary" onClick={processAnswer}>
                    Send
                </Button>
            </InputContainer>
        </Box>
    );
};

export default DebtManagerChat;
