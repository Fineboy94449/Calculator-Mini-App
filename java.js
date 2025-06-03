
function switchMode(mode) {
    const calcDiv = document.getElementById("calculator");
    const eqSection = document.getElementById("equation-section");
    eqSection.style.display = mode === "equation" ? "block" : "none";
    calcDiv.innerHTML = "";

    if (mode === "games") {
        let score = 0;
        let question = {};

        function generateQuestion() {
            const a = Math.floor(Math.random() * 10);
            const b = Math.floor(Math.random() * 10);
            question = { a, b, answer: a + b };
            calcDiv.innerHTML = `
                <h2>What is ${a} + ${b}?</h2>
                <input type="number" id="game-answer" />
                <button onclick="checkAnswer()">Submit</button>
                <p id="game-result"></p>
                <p>Score: <span id="score">${score}</span></p>
            `;
        }

        window.checkAnswer = () => {
            const userAnswer = parseInt(document.getElementById("game-answer").value);
            const result = document.getElementById("game-result");
            if (userAnswer === question.answer) {
                score++;
                result.textContent = "Correct!";
            } else {
                result.textContent = `Wrong. The answer was ${question.answer}`;
            }
            document.getElementById("score").textContent = score;
            setTimeout(generateQuestion, 1500);
        };

        generateQuestion();
    }
}

function solveEquationSteps() {
    const input = document.getElementById("equation").value;
    const resultDiv = document.getElementById("result");

    try {
        const steps = Algebrite.run(`solve(${input})`);
        resultDiv.innerHTML = `<h3>Solution:</h3><p>${steps}</p>`;
    } catch (err) {
        resultDiv.innerHTML = "Unable to solve. Please enter a valid equation.";
    }
}

function explainMath() {
    const expr = document.getElementById("explain-input").value.trim();
    const explanation = document.getElementById("explanation");

    try {
        const node = math.parse(expr);
        const simplified = math.simplify(expr).toString();
        explanation.innerHTML = `
            <p><strong>Original:</strong> ${expr}</p>
            <p><strong>Parsed Tree:</strong> ${node.toString()}</p>
            <p><strong>Simplified:</strong> ${simplified}</p>
        `;
    } catch (e) {
        explanation.textContent = "Sorry, couldn't explain that.";
    }
}

function startVoiceRecognition() {
    const display = document.getElementById("voice-input-display");
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        display.textContent = "Listening...";
    };

    recognition.onerror = (event) => {
        display.textContent = "Error: " + event.error;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        display.textContent = "You said: " + transcript;
        try {
            const result = math.evaluate(transcript);
            alert("Result: " + result);
        } catch (e) {
            alert("Sorry, couldn't evaluate that.");
        }
    };

    recognition.start();
}

function login() {
    const username = document.getElementById("username").value;
    if (username.trim()) {
        localStorage.setItem("calculatorUser", username);
        document.getElementById("login-container").style.display = "none";
        document.querySelector(".calculator-container").style.display = "block";
        alert(`Welcome, ${username}!`);
    } else {
        alert("Please enter a name.");
    }
}

window.onload = () => {
    if (localStorage.getItem("calculatorUser")) {
        document.getElementById("login-container").style.display = "none";
    } else {
        document.querySelector(".calculator-container").style.display = "none";
    }
};
