function switchMode(mode) {
    const calcDiv = document.getElementById("calculator");
    const eqSection = document.getElementById("equation-section");
    eqSection.style.display = mode === "equation" ? "block" : "none";
    calcDiv.innerHTML = "";

    if (mode === "scientific") {
        calcDiv.innerHTML = `
            <div class="display">
                <input type="text" id="display" readonly>
            </div>
            <div class="scientific-keypad">
                <button onclick="appendToDisplay('(')">(</button>
                <button onclick="appendToDisplay(')')">)</button>
                <button onclick="clearDisplay()">C</button>
                <button onclick="backspace()">⌫</button>
                <button onclick="appendToDisplay('sin(')">sin</button>
                <button onclick="appendToDisplay('cos(')">cos</button>
                <button onclick="appendToDisplay('tan(')">tan</button>
                <button onclick="appendToDisplay('^')">^</button>
                <button onclick="appendToDisplay('7')">7</button>
                <button onclick="appendToDisplay('8')">8</button>
                <button onclick="appendToDisplay('9')">9</button>
                <button onclick="appendToDisplay('/')">/</button>
                <button onclick="appendToDisplay('4')">4</button>
                <button onclick="appendToDisplay('5')">5</button>
                <button onclick="appendToDisplay('6')">6</button>
                <button onclick="appendToDisplay('*')">×</button>
                <button onclick="appendToDisplay('1')">1</button>
                <button onclick="appendToDisplay('2')">2</button>
                <button onclick="appendToDisplay('3')">3</button>
                <button onclick="appendToDisplay('-')">-</button>
                <button onclick="appendToDisplay('0')">0</button>
                <button onclick="appendToDisplay('.')">.</button>
                <button onclick="calculate()">=</button>
                <button onclick="appendToDisplay('+')">+</button>
            </div>
        `;
    } else if (mode === "games") {
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

let currentExpression = '';

function appendToDisplay(value) {
    const display = document.getElementById('display');
    currentExpression += value;
    display.value = currentExpression;
}

function clearDisplay() {
    currentExpression = '';
    document.getElementById('display').value = '';
}

function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    document.getElementById('display').value = currentExpression;
}

function calculate() {
    try {
        const result = math.evaluate(currentExpression);
        currentExpression = result.toString();
        document.getElementById('display').value = currentExpression;
    } catch (error) {
        document.getElementById('display').value = 'Error';
        currentExpression = '';
    }
}

function solveEquationSteps() {
    const input = document.getElementById("equation").value;
    const resultDiv = document.getElementById("result");

    try {
        const steps = [];
        const equation = input.replace(/\s/g, '');
        
        // Basic equation parsing
        if (equation.includes('=')) {
            const [leftSide, rightSide] = equation.split('=');
            steps.push(`Original equation: ${leftSide} = ${rightSide}`);
            
            try {
                const solution = Algebrite.run(`solve(${input})`);
                steps.push(`Solution: ${solution}`);
            } catch (err) {
                steps.push("Could not solve equation algebraically");
            }
        }

        resultDiv.innerHTML = steps.map(step => `<p>${step}</p>`).join('');
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
        const result = math.evaluate(expr);
        
        explanation.innerHTML = `
            <p><strong>Original Expression:</strong> ${expr}</p>
            <p><strong>Simplified Form:</strong> ${simplified}</p>
            <p><strong>Result:</strong> ${result}</p>
            <p><strong>Expression Tree:</strong></p>
            <pre>${node.toString({ parenthesis: 'all' })}</pre>
        `;
    } catch (e) {
        explanation.textContent = "Sorry, couldn't explain that expression.";
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
        document.querySelector(".calculator-container").style.display = "block";
    } else {
        document.querySelector(".calculator-container").style.display = "none";
    }

    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (/[\d\+\-\*\/\(\)\.\^]/.test(key)) {
            event.preventDefault();
            appendToDisplay(key);
        } else if (key === 'Enter') {
            event.preventDefault();
            calculate();
        } else if (key === 'Backspace') {
            event.preventDefault();
            backspace();
        } else if (key === 'Escape') {
            event.preventDefault();
            clearDisplay();
        }
    });
};