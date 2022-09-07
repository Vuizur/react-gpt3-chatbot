import { Configuration, OpenAIApi } from "openai";
//import openai


class GrammarChecker {
    correction_string: string;
    openai: OpenAIApi;
    // Init with language
    constructor(language: string, configuration: Configuration) {
        if (language === "German") {
            this.correction_string = "Behebe die Rechtschreibung (falls es Fehler gibt)."
        } else if (language === "English") {
            this.correction_string = "Fix the spelling in the given text if there are any mistakes."
        } else if (language === "Spanish") {
            this.correction_string = "¡Corrige la ortografía y la gramática (si hay errores)!"
        } else if (language === "Czech") {
            this.correction_string = "Opravte pravopisné chyby!"
        }
        else {
            throw Error("Language not supported!")
        }
        this.openai = new OpenAIApi(configuration)
    }

    // Check if the input is correct
    async check(input: string): Promise<string> {
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