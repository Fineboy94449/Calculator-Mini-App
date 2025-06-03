function switchMode(mode) {
    const calcDiv = document.getElementById("calculator");
    const eqSection = document.getElementById("equation-section");
    eqSection.style.display = mode === "equation" ? "block" : "none";
    calcDiv.innerHTML = "";

    if (mode === "scientific") {
        calcDiv.innerHTML = `
            <div class="display">
                <input type="text" id="display" readonly>
                <div id="history"></div>
            </div>
            <div class="scientific-keypad">
                <button onclick="appendToDisplay('(')" class="function-key">(</button>
                <button onclick="appendToDisplay(')')" class="function-key">)</button>
                <button onclick="clearDisplay()" class="clear-key">C</button>
                <button onclick="backspace()" class="clear-key">⌫</button>
                <button onclick="appendToDisplay('sin(')" class="function-key">sin</button>
                <button onclick="appendToDisplay('cos(')" class="function-key">cos</button>
                <button onclick="appendToDisplay('tan(')" class="function-key">tan</button>
                <button onclick="appendToDisplay('^')" class="operator-key">^</button>
                <button onclick="appendToDisplay('√(')" class="function-key">√</button>
                <button onclick="appendToDisplay('log(')" class="function-key">log</button>
                <button onclick="appendToDisplay('ln(')" class="function-key">ln</button>
                <button onclick="appendToDisplay('!')" class="operator-key">!</button>
                <button onclick="appendToDisplay('7')" class="number-key">7</button>
                <button onclick="appendToDisplay('8')" class="number-key">8</button>
                <button onclick="appendToDisplay('9')" class="number-key">9</button>
                <button onclick="appendToDisplay('/')" class="operator-key">/</button>
                <button onclick="appendToDisplay('4')" class="number-key">4</button>
                <button onclick="appendToDisplay('5')" class="number-key">5</button>
                <button onclick="appendToDisplay('6')" class="number-key">6</button>
                <button onclick="appendToDisplay('*')" class="operator-key">×</button>
                <button onclick="appendToDisplay('1')" class="number-key">1</button>
                <button onclick="appendToDisplay('2')" class="number-key">2</button>
                <button onclick="appendToDisplay('3')" class="number-key">3</button>
                <button onclick="appendToDisplay('-')" class="operator-key">-</button>
                <button onclick="appendToDisplay('0')" class="number-key">0</button>
                <button onclick="appendToDisplay('.')" class="number-key">.</button>
                <button onclick="calculate()" class="equals-key">=</button>
                <button onclick="appendToDisplay('+')" class="operator-key">+</button>
            </div>
        `;
    } else if (mode === "games") {
        let score = 0;
        let question = {};
        let streak = 0;
        let timeLeft = 30;
        let timer;

        function generateQuestion() {
            const operations = ['+', '-', '*'];
            const op = operations[Math.floor(Math.random() * operations.length)];
            const a = Math.floor(Math.random() * 12);
            const b = Math.floor(Math.random() * 12);
            let answer;
            
            switch(op) {
                case '+': answer = a + b; break;
                case '-': answer = a - b; break;
                case '*': answer = a * b; break;
            }
            
            question = { a, b, op, answer };
            updateGameUI();
        }

        function updateGameUI() {
            calcDiv.innerHTML = `
                <div class="game-container">
                    <div class="game-stats">
                        <p>Score: <span id="score">${score}</span></p>
                        <p>Streak: <span id="streak">${streak}</span>🔥</p>
                        <p>Time: <span id="timer">${timeLeft}</span>s</p>
                    </div>
                    <h2>What is ${question.a} ${question.op} ${question.b}?</h2>
                    <input type="number" id="game-answer" autofocus />
                    <button onclick="checkAnswer()" class="game-button">Submit</button>
                    <div id="game-result" class="game-result"></div>
                </div>
            `;
            document.getElementById('game-answer').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') checkAnswer();
            });
        }

        function startTimer() {
            timer = setInterval(() => {
                timeLeft--;
                const timerElement = document.getElementById('timer');
                if (timerElement) timerElement.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    calcDiv.innerHTML = `
                        <div class="game-over">
                            <h2>Game Over!</h2>
                            <p>Final Score: ${score}</p>
                            <p>Best Streak: ${streak}</p>
                            <button onclick="switchMode('games')" class="game-button">Play Again</button>
                        </div>
                    `;
                }
            }, 1000);
        }

        window.checkAnswer = () => {
            const userAnswer = parseInt(document.getElementById("game-answer").value);
            const result = document.getElementById("game-result");
            
            if (userAnswer === question.answer) {
                score += 10 + (streak * 2);
                streak++;
                result.textContent = "Correct! +" + (10 + (streak * 2)) + " points";
                result.className = "game-result correct";
            } else {
                streak = 0;
                result.textContent = `Wrong. The answer was ${question.answer}`;
                result.className = "game-result incorrect";
            }
            
            setTimeout(() => {
                generateQuestion();
            }, 1000);
        };

        generateQuestion();
        startTimer();
    }
}

let currentExpression = '';
let history = [];

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
        history.push(`${currentExpression} = ${result}`);
        if (history.length > 5) history.shift();
        updateHistory();
        currentExpression = result.toString();
        document.getElementById('display').value = currentExpression;
    } catch (error) {
        document.getElementById('display').value = 'Error';
        currentExpression = '';
    }
}

function updateHistory() {
    const historyDiv = document.getElementById('history');
    if (historyDiv) {
        historyDiv.innerHTML = history.map(item => `<div class="history-item">${item}</div>`).join('');
    }
}

function solveEquationSteps() {
    const input = document.getElementById("equation").value;
    const resultDiv = document.getElementById("result");

    try {
        const steps = [];
        const equation = input.replace(/\s/g, '');
        
        if (equation.includes('=')) {
            const [leftSide, rightSide] = equation.split('=');
            steps.push(`Original equation: ${leftSide} = ${rightSide}`);
            
            try {
                const solution = Algebrite.run(`solve(${input})`);
                steps.push(`Solution: ${solution}`);
                
                // Verify solution
                const solutions = solution.split(',');
                steps.push('Verification:');
                solutions.forEach(sol => {
                    const verified = math.evaluate(leftSide.replace(/x/g, `(${sol})`)) === 
                                   math.evaluate(rightSide.replace(/x/g, `(${sol})`));
                    steps.push(`  ${sol}: ${verified ? '✓ Correct' : '✗ Incorrect'}`);
                });
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
        
        let steps = [];
        if (expr.includes('+') || expr.includes('-')) {
            steps = ['Combine like terms', 'Apply arithmetic operations'];
        } else if (expr.includes('*') || expr.includes('/')) {
            steps = ['Apply multiplication/division', 'Simplify fractions if any'];
        } else if (expr.includes('^')) {
            steps = ['Apply exponent rules', 'Multiply results'];
        }
        
        explanation.innerHTML = `
            <div class="explanation-box">
                <p><strong>Original Expression:</strong> ${expr}</p>
                <p><strong>Simplified Form:</strong> ${simplified}</p>
                <p><strong>Result:</strong> ${result}</p>
                <p><strong>Steps:</strong></p>
                <ol>
                    ${steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
                <p><strong>Expression Tree:</strong></p>
                <pre>${node.toString({ parenthesis: 'all' })}</pre>
            </div>
        `;
    } catch (e) {
        explanation.innerHTML = `
            <div class="error-box">
                Sorry, couldn't explain that expression.
                <p>Make sure to use valid mathematical notation.</p>
            </div>
        `;
    }
}

function startVoiceRecognition() {
    const display = document.getElementById("voice-input-display");
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        display.innerHTML = `
            <div class="listening">
                <div class="pulse"></div>
                Listening...
            </div>
        `;
    };

    recognition.onerror = (event) => {
        display.innerHTML = `
            <div class="error-message">
                Error: ${event.error}
            </div>
        `;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        display.innerHTML = `
            <div class="transcript">
                You said: "${transcript}"
            </div>
        `;
        
        try {
            const result = math.evaluate(transcript);
            display.innerHTML += `
                <div class="result">
                    Result: ${result}
                </div>
            `;
        } catch (e) {
            display.innerHTML += `
                <div class="error-message">
                    Sorry, couldn't evaluate that expression.
                </div>
            `;
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
        showWelcomeMessage(username);
    } else {
        showError("Please enter a name.");
    }
}

function showWelcomeMessage(username) {
    const welcome = document.createElement('div');
    welcome.className = 'welcome-message';
    welcome.innerHTML = `Welcome, ${username}! 👋`;
    document.body.appendChild(welcome);
    setTimeout(() => welcome.remove(), 3000);
}

function showError(message) {
    const error = document.createElement('div');
    error.className = 'error-toast';
    error.textContent = message;
    document.body.appendChild(error);
    setTimeout(() => error.remove(), 3000);
}

window.onload = () => {
    if (localStorage.getItem("calculatorUser")) {
        document.getElementById("login-container").style.display = "none";
        document.querySelector(".calculator-container").style.display = "block";
    } else {
        document.querySelector(".calculator-container").style.display = "none";
    }

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