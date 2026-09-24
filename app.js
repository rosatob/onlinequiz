const API_URL =
  "https://script.google.com/macros/s/AKfycbwr5k1UGyqMlKrc13NXlCZXQa2eUkgUd-4j5fgbjB03bwklAkV-7R95x2p_zI2NsUZvBg/exec";


/* =========================================================
   Application State
   ========================================================= */

let quizData = null;

let student = {
  name: "",
  birthday: ""
};

let submissionID = null;
let submissionStatus = null;

let allowEditing = false;

let answers = {};

let autosaveTimer = null;
let autosaveInProgress = false;
let unsavedChanges = false;

let recognition = null;
let activeMicButton = null;


/* =========================================================
   Start Application
   ========================================================= */

document.addEventListener("DOMContentLoaded", initialize);


async function initialize() {

  const quizID = getQuizIDFromURL();

  if (!quizID) {
    showError("Error - Quiz not found");
    return;
  }

  try {

    quizData = await getQuiz(quizID);

    if (!quizData || quizData.error) {
      showError("Error - Quiz not found");
      return;
    }

    document.title = quizData.title || "Quiz";

    setupIdentityScreen();

  } catch (error) {

    console.error(error);

    showError("Error - Unable to connect. Please try again.");

  }
}


/* =========================================================
   URL / Quiz Loading
   ========================================================= */

function getQuizIDFromURL() {

  const params = new URLSearchParams(window.location.search);

  return params.get("quiz");

}


async function getQuiz(quizID) {

  const url =
    API_URL +
    "?action=getQuiz&quizID=" +
    encodeURIComponent(quizID);

  const response = await fetch(url, {
    method: "GET",
    redirect: "follow"
  });

  if (!response.ok) {
    throw new Error("Unable to load quiz.");
  }

  return await response.json();

}


/* =========================================================
   Identity Screen
   ========================================================= */

function setupIdentityScreen() {

  showScreen("identityScreen");

  document
    .getElementById("identityForm")
    .addEventListener("submit", handleIdentitySubmit);

}


async function handleIdentitySubmit(event) {

  event.preventDefault();

  const name =
    document.getElementById("studentName").value.trim();

  const birthday =
    document.getElementById("birthday").value.trim();

  if (!name) {
    return;
  }

  if (!/^\d{1,2}$/.test(birthday)) {
    setConnectionMessage(
      "Please enter a 1- or 2-digit birthday."
    );
    return;
  }

  student.name = name;
  student.birthday = birthday;

  const button =
    document.querySelector("#identityForm button");

  button.disabled = true;

  setConnectionMessage("Loading quiz...");

  try {

    const result = await apiPost({
      action: "identify",
      name: student.name,
      birthday: student.birthday,
      quizID: quizData.quizID
    });

    if (result.error) {
      throw new Error(result.error);
    }

    handleIdentificationResult(result);

  } catch (error) {

    console.error(error);

    setConnectionMessage(
      "Error - Unable to connect. Please try again."
    );

    button.disabled = false;

  }

}


/* =========================================================
   Identification Result
   ========================================================= */

function handleIdentificationResult(result) {

  submissionID = result.submissionID || null;
  submissionStatus = result.status || null;

  allowEditing =
    result.allowEditing === true ||
    result.allowEditing === "true";

  answers = result.responses || {};

  /*
   * No previous submission.
   */
  if (!submissionStatus) {

    showQuiz();

    startAutosave();

    return;

  }


  /*
   * Previous draft.
   */
  if (submissionStatus === "Draft") {

    showQuiz();

    startAutosave();

    return;

  }


  /*
   * Previous submitted.
   */

  if (submissionStatus === "Submitted") {

    if (!allowEditing) {

      showScreen("completedScreen");

      return;

    }

    /*
     * Editing is allowed.
     */
    showQuiz();

    startAutosave();

    return;

  }


  /*
   * Unexpected status.
   */
  showError("Error - Unable to load your quiz.");

}


/* =========================================================
   Build Quiz
   ========================================================= */

function showQuiz() {

  showScreen("quizScreen");

  document.getElementById("quizTitle").textContent =
    quizData.title || "";

  document.getElementById("quizDescription").textContent =
    quizData.description || "";

  const container =
    document.getElementById("questionsContainer");

  container.innerHTML = "";

  quizData.questions.forEach((question, index) => {

    const element =
      createQuestionElement(question, index);

    container.appendChild(element);

  });

  attachAnswerListeners();

}


/* =========================================================
   Create Question
   ========================================================= */

function createQuestionElement(question, index) {

  const wrapper = document.createElement("div");

  wrapper.className = "question";

  wrapper.dataset.questionID = question.questionID;

  const number = index + 1;

  const header =
    document.createElement("div");

  header.className = "question-header";

  const questionText =
    document.createElement("div");

  questionText.className = "question-text";

  questionText.innerHTML =
    `<span class="question-number">${number}.</span> ` +
    escapeHTML(question.question);

  header.appendChild(questionText);


  /*
   * TTS only for multiple choice.
   */
  if (
    question.questionType.toLowerCase() ===
    "multiple choice"
  ) {

    const ttsButton =
      createTTSButton(question.question);

    header.appendChild(ttsButton);

  }

  wrapper.appendChild(header);


  const type =
    question.questionType.toLowerCase();


  if (type === "multiple choice") {

    createMultipleChoice(
      wrapper,
      question
    );

  } else if (type === "fill in") {

    createTextAnswer(
      wrapper,
      question,
      false
    );

  } else if (type === "short answer") {

    createTextAnswer(
      wrapper,
      question,
      true
    );

  }


  return wrapper;

}


/* =========================================================
   Multiple Choice
   ========================================================= */

function createMultipleChoice(
  wrapper,
  question
) {

  const choices = [
    ["A", question.choiceA],
    ["B", question.choiceB],
    ["C", question.choiceC],
    ["D", question.choiceD]
  ];

  choices.forEach(([letter, text]) => {

    if (!text) {
      return;
    }

    const choice =
      document.createElement("label");

    choice.className = "choice";

    const radio =
      document.createElement("input");

    radio.type = "radio";
    radio.name = "question_" + question.questionID;
    radio.value = letter;

    if (
      answers[question.questionID] !== undefined &&
      answers[question.questionID] === letter
    ) {
      radio.checked = true;
    }

    const choiceText =
      document.createElement("span");

    choiceText.className = "choice-label";

    choiceText.textContent =
      `${letter}. ${text}`;

    const ttsButton =
      createTTSButton(text);

    choice.appendChild(radio);
    choice.appendChild(choiceText);
    choice.appendChild(ttsButton);

    wrapper.appendChild(choice);

  });

}


/* =========================================================
   Fill In / Short Answer
   ========================================================= */

function createTextAnswer(
  wrapper,
  question,
  multiline
) {

  const row =
    document.createElement("div");

  row.className = "answer-with-mic";

  let input;

  if (multiline) {

    input =
      document.createElement("textarea");

  } else {

    input =
      document.createElement("input");

    input.type = "text";

  }

  input.dataset.questionID =
    question.questionID;

  input.className = "answer-input";

  input.value =
    answers[question.questionID] || "";

  const micButton =
    createMicButton(input);

  row.appendChild(input);
  row.appendChild(micButton);

  wrapper.appendChild(row);

}


/* =========================================================
   TTS
   ========================================================= */

function createTTSButton(text) {

  const button =
    document.createElement("button");

  button.type = "button";

  button.className = "tts-button";

  button.textContent = "🔊";

  button.title = "Read aloud";

  button.addEventListener(
    "click",
    function(event) {

      event.preventDefault();

      speak(text);

    }
  );

  return button;

}


function speak(text) {

  if (
    !("speechSynthesis" in window)
  ) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  window.speechSynthesis.speak(
    utterance
  );

}


/* =========================================================
   Voice Typing
   ========================================================= */

function createMicButton(input) {

  const button =
    document.createElement("button");

  button.type = "button";

  button.className = "mic-button";

  button.textContent = "🎤";

  button.title = "Voice typing";

  button.addEventListener(
    "click",
    function(event) {

      event.preventDefault();

      toggleSpeechRecognition(
        input,
        button
      );

    }
  );

  return button;

}


function toggleSpeechRecognition(
  input,
  button
) {

  if (
    !(
      "SpeechRecognition" in window ||
      "webkitSpeechRecognition" in window
    )
  ) {

    alert(
      "Voice typing is not supported in this browser."
    );

    return;

  }


  /*
   * Stop current recognition.
   */
  if (recognition) {

    recognition.stop();

    return;

  }


  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  recognition =
    new SpeechRecognition();

  recognition.continuous = false;

  recognition.interimResults = false;

  recognition.lang = "en-US";

  activeMicButton = button;


  button.textContent = "■";

  button.title = "Stop voice typing";


  recognition.onresult =
    function(event) {

      const transcript =
        event.results[0][0].transcript;

      insertAtCursor(
        input,
        transcript
      );

      input.dispatchEvent(
        new Event("input", {
          bubbles: true
        })
      );

    };


  recognition.onerror =
    function(event) {

      console.error(
        "Speech recognition error:",
        event.error
      );

    };


  recognition.onend =
    function() {

      recognition = null;

      if (activeMicButton) {

        activeMicButton.textContent =
          "🎤";

        activeMicButton.title =
          "Voice typing";

      }

      activeMicButton = null;

    };


  recognition.start();

}


function insertAtCursor(
  input,
  text
) {

  const start =
    input.selectionStart;

  const end =
    input.selectionEnd;

  const before =
    input.value.substring(
      0,
      start
    );

  const after =
    input.value.substring(
      end
    );

  const needsSpace =
    before.length > 0 &&
    !/\s$/.test(before);

  const insertion =
    (needsSpace ? " " : "") +
    text;

  input.value =
    before +
    insertion +
    after;

  const cursorPosition =
    start + insertion.length;

  input.selectionStart =
    cursorPosition;

  input.selectionEnd =
    cursorPosition;

  input.focus();

}


/* =========================================================
   Answer Tracking
   ========================================================= */

function attachAnswerListeners() {

  const form =
    document.getElementById("quizForm");

  form.addEventListener(
    "change",
    function(event) {

      const target =
        event.target;

      if (
        target.matches(
          "input[type='radio']"
        )
      ) {

        const questionID =
          target.name.replace(
            "question_",
            ""
          );

        answers[questionID] =
          target.value;

        unsavedChanges = true;

      }

    }
  );


  form.addEventListener(
    "input",
    function(event) {

      const target =
        event.target;

      if (
        target.classList.contains(
          "answer-input"
        )
      ) {

        const questionID =
          target.dataset.questionID;

        answers[questionID] =
          target.value;

        unsavedChanges = true;

      }

    }
  );


  form.addEventListener(
    "submit",
    handleSubmit
  );

}


/* =========================================================
   Autosave
   ========================================================= */

function startAutosave() {

  stopAutosave();

  autosaveTimer =
    setInterval(
      function() {

        if (
          unsavedChanges &&
          !autosaveInProgress
        ) {

          saveDraft();

        }

      },
      30000
    );

}


function stopAutosave() {

  if (autosaveTimer) {

    clearInterval(
      autosaveTimer
    );

    autosaveTimer = null;

  }

}


async function saveDraft() {

  if (autosaveInProgress) {
    return;
  }

  autosaveInProgress = true;

  try {

    const result =
      await apiPost({
        action: "saveDraft",

        submissionID:
          submissionID,

        name:
          student.name,

        birthday:
          student.birthday,

        quizID:
          quizData.quizID,

        answers:
          answers
      });


    if (result.error) {
      throw new Error(result.error);
    }


    submissionID =
      result.submissionID;

    submissionStatus =
      "Draft";

    unsavedChanges = false;

  } catch (error) {

    console.error(
      "Autosave failed:",
      error
    );

  } finally {

    autosaveInProgress = false;

  }

}


/* =========================================================
   Submit
   ========================================================= */

async function handleSubmit(event) {

  event.preventDefault();

  const button =
    document.getElementById(
      "submitButton"
    );

  button.disabled = true;

  button.textContent =
    "Submitting...";


  /*
   * Save first if necessary.
   */
  try {

    if (!submissionID || unsavedChanges) {

      await saveDraft();

    }


    const result =
      await apiPost({
        action: "submit",

        submissionID:
          submissionID,

        name:
          student.name,

        birthday:
          student.birthday,

        quizID:
          quizData.quizID,

        answers:
          answers
      });


    if (result.error) {
      throw new Error(result.error);
    }


    stopAutosave();

    unsavedChanges = false;

    submissionStatus =
      "Submitted";

    showScreen(
      "thankYouScreen"
    );


  } catch (error) {

    console.error(error);

    button.disabled = false;

    button.textContent =
      "Submit Answers";

    showQuizMessage(
      "Error - Unable to submit. Please try again."
    );

  }

}


/* =========================================================
   API POST
   ========================================================= */

async function apiPost(data) {

  const response =
    await fetch(API_URL, {

      method: "POST",

      redirect: "follow",

      headers: {
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body:
        JSON.stringify(data)

    });


  if (!response.ok) {

    throw new Error(
      "Server returned an error."
    );

  }


  return await response.json();

}


/* =========================================================
   Leave / Reload Warning
   ========================================================= */

window.addEventListener(
  "beforeunload",
  function(event) {

    if (unsavedChanges) {

      event.preventDefault();

      event.returnValue = "";

    }

  }
);


/* =========================================================
   Screen Management
   ========================================================= */

function showScreen(screenID) {

  const screens = [
    "identityScreen",
    "quizScreen",
    "completedScreen",
    "thankYouScreen",
    "errorScreen"
  ];

  screens.forEach(id => {

    document
      .getElementById(id)
      .classList.add("hidden");

  });

  document
    .getElementById(screenID)
    .classList.remove("hidden");

}


function showError(message) {

  document.getElementById(
    "errorMessage"
  ).textContent = message;

  showScreen("errorScreen");

}


function setConnectionMessage(message) {

  document.getElementById(
    "connectionMessage"
  ).textContent = message;

}


function showQuizMessage(message) {

  document.getElementById(
    "quizMessage"
  ).textContent = message;

}


/* =========================================================
   HTML Escaping
   ========================================================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}
