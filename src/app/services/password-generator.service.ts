import { Injectable } from "@angular/core";

export type PasswordAlgorithm = "strong" | "memorable" | "numeric" | "alphanumeric" | "symbolic";

export interface PasswordOptions {
    length?: number;
    algorithm?: PasswordAlgorithm;
    includeUppercase?: boolean;
    includeLowercase?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
}

@Injectable({
    providedIn: "root",
})
export class PasswordGeneratorService {
    private readonly UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private readonly LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private readonly NUMBERS = "0123456789";
    private readonly SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    private readonly MEMORABLE_WORDS = [
        "apple",
        "banana",
        "cherry",
        "dolphin",
        "elephant",
        "forest",
        "guitar",
        "harbor",
        "island",
        "jungle",
        "knight",
        "lighthouse",
        "mountain",
        "nebula",
        "ocean",
        "penguin",
        "quasar",
        "rainbow",
        "sunset",
        "tiger",
        "umbrella",
        "volcano",
        "whale",
        "xylophone",
        "yacht",
        "zebra",
    ];

    /**
     * Generate a password using the specified algorithm
     */
    generatePassword(options: PasswordOptions = {}): string {
        const algorithm = options.algorithm || "strong";
        const length = options.length || this.getDefaultLength(algorithm);

        switch (algorithm) {
            case "strong":
                return this.generateStrongPassword(length, options);
            case "memorable":
                return this.generateMemorablePassword(length);
            case "numeric":
                return this.generateNumericPassword(length);
            case "alphanumeric":
                return this.generateAlphanumericPassword(length);
            case "symbolic":
                return this.generateSymbolicPassword(length, options);
            default:
                return this.generateStrongPassword(length, options);
        }
    }

    /**
     * Generate a strong password with mixed characters
     */
    private generateStrongPassword(length: number, options: PasswordOptions): string {
        const includeUppercase = options.includeUppercase !== false;
        const includeLowercase = options.includeLowercase !== false;
        const includeNumbers = options.includeNumbers !== false;
        const includeSymbols = options.includeSymbols !== false;

        let charset = "";
        if (includeUppercase) charset += this.UPPERCASE;
        if (includeLowercase) charset += this.LOWERCASE;
        if (includeNumbers) charset += this.NUMBERS;
        if (includeSymbols) charset += this.SYMBOLS;

        // Ensure at least one character from each selected type
        let password = "";
        if (includeUppercase) password += this.getRandomChar(this.UPPERCASE);
        if (includeLowercase) password += this.getRandomChar(this.LOWERCASE);
        if (includeNumbers) password += this.getRandomChar(this.NUMBERS);
        if (includeSymbols) password += this.getRandomChar(this.SYMBOLS);

        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            password += this.getRandomChar(charset);
        }

        // Shuffle the password
        return this.shuffleString(password);
    }

    /**
     * Generate a memorable password using words and numbers
     */
    private generateMemorablePassword(length: number): string {
        const wordCount = Math.floor(length / 8); // Approximately one word per 8 chars
        const words: string[] = [];

        for (let i = 0; i < wordCount; i++) {
            const word = this.getRandomElement(this.MEMORABLE_WORDS);
            // Capitalize first letter of each word
            words.push(word.charAt(0).toUpperCase() + word.slice(1));
        }

        // Add numbers between words
        const numbers = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
        const password = words.join("") + numbers.toString();

        // If still too short, pad with random characters
        if (password.length < length) {
            const padding = this.generateAlphanumericPassword(length - password.length);
            return this.shuffleString(password + padding);
        }

        return password.substring(0, length);
    }

    /**
     * Generate a numeric-only password
     */
    private generateNumericPassword(length: number): string {
        let password = "";
        for (let i = 0; i < length; i++) {
            password += this.getRandomChar(this.NUMBERS);
        }
        return password;
    }

    /**
     * Generate an alphanumeric password (letters and numbers)
     */
    private generateAlphanumericPassword(length: number): string {
        const charset = this.UPPERCASE + this.LOWERCASE + this.NUMBERS;
        let password = "";

        // Ensure at least one uppercase, lowercase, and number
        password += this.getRandomChar(this.UPPERCASE);
        password += this.getRandomChar(this.LOWERCASE);
        password += this.getRandomChar(this.NUMBERS);

        // Fill the rest
        for (let i = password.length; i < length; i++) {
            password += this.getRandomChar(charset);
        }

        return this.shuffleString(password);
    }

    /**
     * Generate a password with symbols
     */
    private generateSymbolicPassword(length: number, options: PasswordOptions): string {
        const includeUppercase = options.includeUppercase !== false;
        const includeLowercase = options.includeLowercase !== false;
        const includeNumbers = options.includeNumbers !== false;

        let charset = this.SYMBOLS;
        if (includeUppercase) charset += this.UPPERCASE;
        if (includeLowercase) charset += this.LOWERCASE;
        if (includeNumbers) charset += this.NUMBERS;

        let password = this.getRandomChar(this.SYMBOLS); // Ensure at least one symbol

        if (includeUppercase) password += this.getRandomChar(this.UPPERCASE);
        if (includeLowercase) password += this.getRandomChar(this.LOWERCASE);
        if (includeNumbers) password += this.getRandomChar(this.NUMBERS);

        // Fill the rest
        for (let i = password.length; i < length; i++) {
            password += this.getRandomChar(charset);
        }

        return this.shuffleString(password);
    }

    /**
     * Get default length for algorithm
     */
    private getDefaultLength(algorithm: PasswordAlgorithm): number {
        switch (algorithm) {
            case "strong":
                return 16;
            case "memorable":
                return 20;
            case "numeric":
                return 12;
            case "alphanumeric":
                return 16;
            case "symbolic":
                return 16;
            default:
                return 16;
        }
    }

    /**
     * Get a random character from a string
     */
    private getRandomChar(charset: string): string {
        return charset.charAt(Math.floor(Math.random() * charset.length));
    }

    /**
     * Get a random element from an array
     */
    private getRandomElement<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Shuffle a string randomly
     */
    private shuffleString(str: string): string {
        const array = str.split("");
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join("");
    }

    /**
     * Get algorithm display name
     */
    getAlgorithmName(algorithm: PasswordAlgorithm): string {
        const names: Record<PasswordAlgorithm, string> = {
            strong: "Strong",
            memorable: "Memorable",
            numeric: "Numeric",
            alphanumeric: "Alphanumeric",
            symbolic: "Symbolic",
        };
        return names[algorithm] || "Strong";
    }

    /**
     * Get algorithm description
     */
    getAlgorithmDescription(algorithm: PasswordAlgorithm): string {
        const descriptions: Record<PasswordAlgorithm, string> = {
            strong: "Mix of letters, numbers, and symbols",
            memorable: "Easy to remember words with numbers",
            numeric: "Numbers only",
            alphanumeric: "Letters and numbers only",
            symbolic: "Includes special symbols",
        };
        return descriptions[algorithm] || "Mix of letters, numbers, and symbols";
    }

    /**
     * Get all available algorithms
     */
    getAvailableAlgorithms(): PasswordAlgorithm[] {
        return ["strong", "memorable", "numeric", "alphanumeric", "symbolic"];
    }
}
