import Cookies from 'js-cookie';
import defaultSettings from './characters';


class Conversation {
    conversation: string;
    num_user_inputs: number;
    settings: any;

    constructor(settings: any) {
        this.conversation = "";
        this.num_user_inputs = 0;
        this.settings = settings;

    }

    get_prompt(user_input: string): string {
        if (this.conversation === "") {
            this.conversation =
                //this.settings["STARTING_PROMPT"] + "\n" +
                (Cookies.get("startingPrompt") || this.settings["STARTING_PROMPT"]) + "\n" +
                this.settings["USER_PREFIX"] + user_input +
                "\n" +
                this.settings["AI_PREFIX"];
        } else {
            this.conversation =
                this.conversation.trim() +
                "\n" +
                this.settings["USER_PREFIX"] +
                user_input +
                "\n" +
                this.settings["AI_PREFIX"];
        }
        this.num_user_inputs += 1;

        if (this.num_user_inputs > this.settings["MAX_NUM_USER_INPUTS"]) {
            this.conversation =
                this.settings["STARTING_PROMPT"] +
                "\n" +
                this.settings["CUT_DIALOGUE_PLACEHOLDER"] +
                "\n" +
                this.settings["USER_PREFIX"] +
                this.conversation.split("\n" + this.settings["USER_PREFIX"], 2)[2];
        }

        return this.conversation;
    }

    set_completion(completion: string) {
        this.conversation += completion;
    }
}

export default Conversation;