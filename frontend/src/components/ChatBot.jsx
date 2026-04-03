import React, { useEffect, useRef, useState } from 'react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const chatInitialized = useRef(false);

    useEffect(() => {
        // Load n8n chat widget script
        if (!chatInitialized.current) {
            const script = document.createElement('script');
            script.type = 'module';
            script.innerHTML = `
                import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
                
                window.n8nChat = createChat({
                    webhookUrl: 'https://rajkumar23435.app.n8n.cloud/webhook/06b0e158-ab71-44d6-bfa0-e38f77679182/chat',
                    initialMessages: [],
                    i18n: {
                        en: {
                            title: 'AI Mental Health Chatbot',
                            subtitle: 'Chat with our AI assistant',
                            footer: '',
                            getStarted: 'Start conversation',
                            inputPlaceholder: 'Type your message...',
                        }
                    },
                    chatWindowOpen: false,
                    showWelcomeScreen: false,
                });
            `;
            document.body.appendChild(script);

            // Load CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
            document.head.appendChild(link);

            chatInitialized.current = true;
        }
    }, []);

    const openChat = () => {
        if (window.n8nChat) {
            window.n8nChat.open();
        }
    };

    return (
        <button
            onClick={openChat}
            className="fixed bottom-6 right-6 h-14 w-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 text-2xl"
            aria-label="Open chat"
        >
            💬
        </button>
    );
};

export default ChatBot;
