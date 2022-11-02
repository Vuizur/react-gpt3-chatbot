const defaultSettings = {
    "STARTING_PROMPT": "A conversation between two people.",
    "STARTING_REQUEST": "Say something!",
    "MAX_NUM_USER_INPUTS": 3,
    "USER_PREFIX": "P1: ",
    "AI_PREFIX": "P2:",
    "CUT_DIALOGUE_PLACEHOLDER": "...",
    "FREQUENCY_PENALTY": 1,
    "PRESENCE_PENALTY": 1,
    "MAX_TOKENS": 400,
    "LANGUAGE": "English"
}

const spanishSettings = 
{
    "STARTING_PROMPT": "Una conversación entre una mujer y un hombre.",
    "STARTING_REQUEST": "Habla!",
    "USER_PREFIX": "M: ",
    "AI_PREFIX": "H:",
    "LANGUAGE": "Spanish"
}

//export

export default defaultSettings;