
function switchMode(mode) {
    const calc = document.getElementById("calculator");
    if (mode === "mini") {
        calc.innerHTML = "<input id=\"display\" readonly><br><button onclick=\"append('1')\">1</button><button onclick=\"append('2')\">2</button><button onclick=\"append('+')\">+</button><button onclick=\"calculate()\">=</button>";
    } else if (mode === "scientific") {
        calc.innerHTML = "<input id=\"display\" readonly><br><button onclick=\"append('sin(')\">sin</button><button onclick=\"append('cos(')\">cos</button><button onclick=\"append('tan(')\">tan</button><button onclick=\"calculate()\">=</button>";
    } else if (mode === "equation") {
        calc.innerHTML = '<input id="equation" placeholder="Enter equation like x+2=5"><button onclick="solveEquation()">Solve</button><div id="result"></div>';
    } else if (mode === "physics") {
        calc.innerHTML = '<input id="equation" placeholder="Enter physics formula e.g. F=m*a"><br><input id="vars" placeholder="Enter variables e.g. m=2,a=3"><button onclick="solvePhysics()">Solve</button><div id="result"></div>';
    } else if (mode === "finance") {
        calc.innerHTML = '<select id="financeType"><option value="simple">Simple Interest</option><option value="compound">Compound Interest</option></select><br><input id="P" placeholder="Principal"><input id="r" placeholder="Rate"><input id="t" placeholder="Time"><button onclick="solveFinance()">Solve</button><div id="result"></div>';
    }
}

function append(val) {
    const display = document.getElementById("display");
    display.value += val;
}

function calculate() {
    const display = document.getElementById("display");
    try {
        display.value = math.evaluate(display.value);
    } catch {
        display.value = "Error";
    }
}

function solveEquation() {
    const eq = document.getElementById("equation").value;
    try {
        const result = math.solve(eq, 'x');
        document.getElementById("result").innerText = result.toString();
    } catch (err) {
        document.getElementById("result").innerText = "Error: " + err.message;
    }
}

function solvePhysics() {
    const equation = document.getElementById("equation").value;
    const vars = document.getElementById("vars").value;
    let scope = {};
    vars.split(',').forEach(kv => {
        const [key, val] = kv.split('=');
        scope[key.trim()] = parseFloat(val);
    });
    try {
        const [lhs, rhs] = equation.split('=');
        const unknown = lhs.trim();
        scope[unknown] = math.evaluate(rhs, scope);
        document.getElementById("result").innerText = `${unknown} = ${scope[unknown]}`;
    } catch (err) {
        document.getElementById("result").innerText = "Error: " + err.message;
    }
}

function solveFinance() {
    const type = document.getElementById("financeType").value;
    const P = parseFloat(document.getElementById("P").value);
    const r = parseFloat(document.getElementById("r").value) / 100;
    const t = parseFloat(document.getElementById("t").value);
    let result = 0;
    if (type === "simple") {
        result = (P * r * t);
    } else if (type === "compound") {
        result = P * Math.pow(1 + r, t);
    }
    document.getElementById("result").innerText = "Result: " + result.toFixed(2);
}
function solveEquationSteps() {
    const equationInput = document.getElementById("equation").value;
    const steps = mathsteps.solveEquation(equationInput);

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    if (!steps || steps.length === 0) {
        resultDiv.innerHTML = "No steps found or unable to solve the equation.";
        return;
    }

    steps.forEach((step, index) => {
        const stepDiv = document.createElement("div");
        stepDiv.textContent = `Step ${index + 1}: ${step.newEquation.ascii()}`;
        resultDiv.appendChild(stepDiv);
    });
}