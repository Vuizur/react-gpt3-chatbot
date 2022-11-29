import Chat, { Bubble, useMessages } from "@chatui/core";
import { useState } from "react";
import Conversation from "./conversation";
import defaultSettings from "./characters";
import { Configuration, OpenAIApi } from "openai";
import Cookies from "js-cookie";
import GrammarChecker from "./grammarChecker";


const ChatArea = () => {
    const { messages, appendMsg, setTyping } = useMessages([]);
    const [openai, setOpenai] = useState(new OpenAIApi(new Configuration({ apiKey: Cookies.get("apiKey") })));

    const [grammarChecker, setGrammarChecker] = useState(new GrammarChecker(Cookies.get("language") || defaultSettings.LANGUAGE, new Configuration({ apiKey: Cookies.get("apiKey") })));

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
            let correction = new Promise<string>((resolve) => resolve(val))
            console.log("CorrectErrors: " , Cookies.get("correctErrors"))
            if (Cookies.get("correctErrors") === "true"){
                 correction = grammarChecker.check(val)
            }

            correction.then((correction) => {

                console.log(correction)
                if (correction.trim() !== val.trim()) {
                    appendMsg({
                        type: 'text',
                        content: { text: "*" + correction },
                        position: 'right',
                    });
                }

                const prompt = conversation.get_prompt(correction).trim()
                console.log("Prompt: ", prompt)
                console.log("Conversation: ", conversation.conversation)

                if (Cookies.get("apiKey") === undefined || Cookies.get("apiKey") === "") {
                    console.log("NO API KEY")
                    appendMsg({
                        type: 'text',
                        content: { text: "Please set an API key in the settings. If you don't have one, you can get it at https://beta.openai.com/account/api-keys after creating an OpenAI account." },
                        position: 'left',
                    });
                }
                else {
                    openai.createCompletion({
                        model: 'text-davinci-003',
                        prompt: prompt,
                        stop: (Cookies.get("userPrefix") || defaultSettings['USER_PREFIX']).trim(),
                        max_tokens: defaultSettings['MAX_TOKENS'],
                        frequency_penalty: defaultSettings['FREQUENCY_PENALTY'],
                        presence_penalty: defaultSettings['PRESENCE_PENALTY'],
                    }).then((completion) => {
                        const responseText = completion.data.choices![0].text!;
                        conversation.set_completion(responseText)
                        appendMsg({
                            type: 'text',
                            content: { text: responseText.trim() },
                        });
                    });

                }
            })

        }
    }

    function renderMessageContent(msg: any) {
        const { content } = msg;
        return <Bubble content={content.text} />;
    }


    return (
        <>
            <Chat
                navbar={{ title: 'Chatbot' }}
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
