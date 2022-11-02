import { Configuration, OpenAIApi } from "openai";
//import openai


class GrammarChecker {
    /** Many of these request were machine translated, so they might be buggy */
    public static supported_languages_correction_dict: { [key: string]: string } = {
        
        "German": "Behebe die Rechtschreibung (falls es Fehler gibt)!",
        "English": "Fix the spelling in the given text if there are any mistakes!",
        "Spanish": "¡Corrige la ortografía y la gramática (si hay errores)!",
        "Czech": "Opravte pravopis v daném textu, pokud v něm jsou nějaké chyby!",
        "Russian": "Исправьте орфографию в приведенном тексте, если в нем есть ошибки!",
        "French": "Corrigez l'orthographe dans le texte donné s'il y a des erreurs!",
        "Italian": "Correggete l'ortografia del testo dato, se ci sono errori!",
        "Polish": "Poprawić pisownię w podanym tekście, jeśli są w nim jakieś błędy!",
        "Portuguese": "Fixar a ortografia no texto dado se houver algum erro!",
        "Chinese": "如果有任何错误，请修正给定文本中的拼写",
        "Japanese": "与えられたテキストにスペルの間違いがあれば、修正しましょう"
    }
    correction_string: string | null;
    openai: OpenAIApi;
    // Init with language
    constructor(language: string, configuration: Configuration) {
        this.openai = new OpenAIApi(configuration);
        if (language in GrammarChecker.supported_languages_correction_dict) {
            this.correction_string = GrammarChecker.supported_languages_correction_dict[language];
        } else {
            console.log("Language not supported!");
            this.correction_string = null;
            this.openai = new OpenAIApi(configuration)
        }
    }

    async check(input: string): Promise<string> {
        // Remove the * from the input string, call _check and add the * again
        let disallowed_characters: string[] = ["*", "(", ")", "[", "]", "{", "}"];
        // Remove all disallowed characters left of the string
        let left_index = 0;
        for (let i = 0; i < input.length; i++) {
            if (disallowed_characters.includes(input[i])) {
                left_index = i + 1;
            } else {
                break;
            }
        }
        // Remove all disallowed characters right of the string
        let right_index = input.length - 1;
        for (let i = input.length - 1; i >= 0; i--) {
            if (disallowed_characters.includes(input[i])) {
                right_index = i - 1;
            } else {
                break;
            }
        }
        // Remove all disallowed characters in the string
        let input_without_disallowed_characters = input.substring(left_index, right_index + 1);
        let output = await (await this._check(input_without_disallowed_characters)).trim();
        // Add the * again
        let output_with_disallowed_characters = input.substring(0, left_index) + output + input.substring(right_index + 1, input.length);
        return output_with_disallowed_characters;
    }

    // Check if the input is correct
    async _check(input: string): Promise<string> {

        if (this.correction_string == null) {
            // return promise with input string
            console.log("Language not supported!");
            return input;
        }
        // Returns the correct string
        const completion = this.openai.createEdit({
            model: "text-davinci-edit-001",
            input: input,
            instruction: this.correction_string,
            temperature: 0,
        });
        // Wait for the completion

        let corrected_text: string = "";
        const compl = await completion

        corrected_text = compl.data.choices![0].text!;
        //let corrected_text: string = completion.data.choices![0].text!;
        // Can be buggy this way
        corrected_text = corrected_text.replace(this.correction_string, "");

        // Check if the corrected text is more than 20 % longer than the original text
        // Test example: "What do you love to do?"
        // This means that the correction model probably added some extra text :(
        if (corrected_text.length > input.length * 1.2) {
            // Something fishy is going on, the script generated garbage
            // Calculate the indices of separators

            // Iterate over corrected_text
            let separator_indices_corrected_text: number[] = [];
            for (let i = 0; i < corrected_text.length; i++) {
                if (corrected_text[i] === "." || corrected_text[i] === "," || corrected_text[i] === ";" || corrected_text[i] === ":" || corrected_text[i] === "!" || corrected_text[i] === "?") {
                    separator_indices_corrected_text.push(i);
                }
            }
            let separator_index_input_text: number[] = [];
            for (let i = 0; i < input.length; i++) {
                if (input[i] === "." || input[i] === "," || input[i] === ";" || input[i] === ":" || input[i] === "!" || input[i] === "?") {
                    separator_index_input_text.push(i);
                }
            }


            // Find the separator_index that is closest to the last separator_index of the input
            let last_separator_index_input: number = separator_index_input_text[separator_index_input_text.length - 1];
            //
            let minimum_distance = 999
            let minimum_distance_index = -1
            for (let i = 0; i < separator_indices_corrected_text.length; i++) {
                let distance = Math.abs(separator_indices_corrected_text[i] - last_separator_index_input);

                if (distance < minimum_distance) {
                    minimum_distance = distance;
                    minimum_distance_index = i;
                }
            }

            // Return the text up to the minimum_distance_index
            corrected_text = corrected_text.slice(0, separator_indices_corrected_text[minimum_distance_index] + 1);
            return corrected_text
        }

        return corrected_text

    }
}

export default GrammarChecker;