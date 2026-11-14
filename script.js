
// Get HTML Elements

const passwordInput = document.getElementById("password");
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");
const message = document.getElementById("message");


// Character Sets

const charSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}?"
};


// Secure Random Number

function randomNumber(max) {

    const limit = Math.floor(4294967296 / max) * max;
    const randomValues = new Uint32Array(1);

    do {
        crypto.getRandomValues(randomValues);
    } while (randomValues[0] >= limit);

    return randomValues[0] % max;
}


// Shuffle Password Characters

function shufflePassword(passwordArray) {

    for (let i = passwordArray.length - 1; i > 0; i--) {

        const j = randomNumber(i + 1);

        [passwordArray[i], passwordArray[j]] =
        [passwordArray[j], passwordArray[i]];

    }

    return passwordArray;
}


// Generate Password

function generatePassword() {

    const length = Number(lengthInput.value);

    let availableCharacters = "";
    let passwordArray = [];
    let selectedSets = [];

    message.textContent = "";

    // Check Selected Options

    if (uppercase.checked) {
        availableCharacters += charSets.uppercase;
        selectedSets.push(charSets.uppercase);
    }

    if (lowercase.checked) {
        availableCharacters += charSets.lowercase;
        selectedSets.push(charSets.lowercase);
    }

    if (numbers.checked) {
        availableCharacters += charSets.numbers;
        selectedSets.push(charSets.numbers);
    }

    if (symbols.checked) {
        availableCharacters += charSets.symbols;
        selectedSets.push(charSets.symbols);
    }

    // Validate Options

    if (selectedSets.length === 0) {
        message.textContent = "Please select at least one option!";
        return;
    }

    if (length < selectedSets.length) {
        message.textContent =
            "Password length is too short for selected options!";
        return;
    }

    // Add One Character From Each Selected Set

    selectedSets.forEach(set => {

        passwordArray.push(
            set[randomNumber(set.length)]
        );

    });

    // Generate Remaining Characters

    for (let i = passwordArray.length; i < length; i++) {

        const randomIndex = randomNumber(
            availableCharacters.length
        );

        passwordArray.push(
            availableCharacters[randomIndex]
        );

    }

    // Shuffle Password

    shufflePassword(passwordArray);

    // Display Password

    const finalPassword = passwordArray.join("");

    passwordInput.value = finalPassword;

    // Check Password Strength

    checkPasswordStrength(length, selectedSets.length);

}


// Password Strength Checker

function checkPasswordStrength(length, optionsCount) {

    let strength = 0;

    if (length >= 8) strength++;
    if (length >= 12) strength++;
    if (length >= 16) strength++;
    if (optionsCount >= 3) strength++;
    if (optionsCount === 4) strength++;

    if (strength <= 2) {

        strengthText.textContent = "Weak";
        strengthText.style.color = "#ff6262";

        strengthFill.style.width = "30%";
        strengthFill.style.background = "#ff6262";

    } else if (strength <= 3) {

        strengthText.textContent = "Medium";
        strengthText.style.color = "#f4c45e";

        strengthFill.style.width = "65%";
        strengthFill.style.background = "#f4c45e";

    } else {

        strengthText.textContent = "Strong";
        strengthText.style.color = "#70e6bc";

        strengthFill.style.width = "100%";
        strengthFill.style.background = "#70e6bc";

    }

}


// Update Password Length

lengthInput.addEventListener("input", () => {

    lengthValue.textContent = lengthInput.value;

});


// Generate Button Event

generateBtn.addEventListener("click", generatePassword);


// Copy Password Function

copyBtn.addEventListener("click", async () => {

    const password = passwordInput.value;

    if (!password) {
        message.textContent = "Generate a password first!";
        return;
    }

    try {

        await navigator.clipboard.writeText(password);

        message.textContent = "Password copied successfully!";

    } catch (error) {

        message.textContent = "Unable to copy password.";

    }

});


// Generate Initial Password

generatePassword();
