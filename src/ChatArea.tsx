import Chat, { Bubble, useMessages } from "@chatui/core";
import { useState } from "react";
import Conversation from "./conversation";
import defaultSettings from "./characters";




const ChatArea = () => {
    const { messages, appendMsg, setTyping } = useMessages([]);

    // Conversation hook
    const [conversation, setConversation] = useState(new Conversation(defaultSettings));

    function handleSend(type: any, val: string) {
        if (type === 'text' && val.trim()) {
            appendMsg({
                type: 'text',
                content: { text: val },
                position: 'right',
            });

            setTyping(true);

            console.log(conversation.get_prompt(val))
            conversation.set_completion("Bala bala")


            setTimeout(() => {
                appendMsg({
                    type: 'text',
                    content: { text: 'Bala bala' + val },
                });
            }, 1000);
        }
    }

    function renderMessageContent(msg: any) {
        const { content } = msg;
        return <Bubble content={content.text} />;
    }


    return (
        <>
            <Chat
                navbar={{ title: 'Assistant' }}
                messages={messages}
                renderMessageContent={renderMessageContent}
                onSend={handleSend}
                locale="en"
                placeholder='Type a message'
            />
        </>
    )
}

export default ChatArea;
