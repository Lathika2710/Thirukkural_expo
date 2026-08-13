const input = document.getElementById("kuralNumber");
const searchBtn = document.getElementById("searchBtn");
const randomBtn = document.getElementById("randomBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const result = document.getElementById("result");
const statusBox = document.getElementById("status");

const numberDisplay = document.getElementById("kuralNumberDisplay");
const kuralText = document.getElementById("kuralText");
const athigaram = document.getElementById("athigaram");
const athigaramNumber = document.getElementById("athigaramNumber");
const porul = document.getElementById("porul");

let currentNumber = null;

function setStatus(message = "", type = "") {
    statusBox.textContent = message;
    statusBox.className = `status ${type}`.trim();
}

function setLoading(isLoading) {
    searchBtn.disabled = isLoading;
    randomBtn.disabled = isLoading;
    prevBtn.disabled = isLoading;
    nextBtn.disabled = isLoading;

    if (isLoading) {
        setStatus("திருக்குறளைத் தேடுகிறது...", "loading");
    }
}

function validateNumber(value) {
    const number = Number(value);

    if (!value) {
        setStatus("குறள் எண்ணை உள்ளிடுங்கள்.", "error");
        return null;
    }

    if (!Number.isInteger(number) || number < 1 || number > 1330) {
        setStatus("குறள் எண் 1 முதல் 1330 வரை இருக்க வேண்டும்.", "error");
        return null;
    }

    return number;
}

async function loadKural(number) {
    setLoading(true);
    result.classList.add("hidden");

    try {
        const response = await fetch(`/api/kural/${number}`, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        const payload = await response.json();

        if (!response.ok || !payload.success) {
            throw new Error(payload.message || "API error");
        }

        const data = payload.data;

        currentNumber = Number(data.number);
        input.value = currentNumber;

        numberDisplay.textContent = `குறள் ${currentNumber}`;
        kuralText.innerHTML = `
            <span>${escapeHtml(data.line1 || "")}</span>
            <span>${escapeHtml(data.line2 || "")}</span>
        `;

        athigaram.textContent = data.athigaram || "—";
        athigaramNumber.textContent =
            data.athigaram_number ? data.athigaram_number : "—";
        porul.textContent = data.porul || "பொருள் கிடைக்கவில்லை.";

        prevBtn.disabled = currentNumber <= 1;
        nextBtn.disabled = currentNumber >= 1330;

        setStatus("");
        result.classList.remove("hidden");

        requestAnimationFrame(() => {
            result.classList.add("show");
        });
    } catch (error) {
        setStatus(
            error.message.includes("API configuration")
                ? "API configuration error. Please check the .env configuration."
                : "திருக்குறள் தகவலை பெற முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.",
            "error"
        );
    } finally {
        searchBtn.disabled = false;
        randomBtn.disabled = false;
        prevBtn.disabled = currentNumber === null || currentNumber <= 1;
        nextBtn.disabled = currentNumber === null || currentNumber >= 1330;
    }
}

function search() {
    const number = validateNumber(input.value);
    if (number !== null) {
        loadKural(number);
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

searchBtn.addEventListener("click", search);

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        search();
    }
});

randomBtn.addEventListener("click", () => {
    const number = Math.floor(Math.random() * 1330) + 1;
    loadKural(number);
});

prevBtn.addEventListener("click", () => {
    if (currentNumber > 1) {
        loadKural(currentNumber - 1);
    }
});

nextBtn.addEventListener("click", () => {
    if (currentNumber < 1330) {
        loadKural(currentNumber + 1);
    }
});
