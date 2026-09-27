let questions = [];

let questionCounter = 0;


/*
 * ADD QUESTION
 */

document
  .getElementById("add-question")
  .addEventListener("click", addQuestion);


function addQuestion() {

  questionCounter++;

  const question = {
    id: "Q" + questionCounter,
    question: "",
    type: "multiple choice",
    imageURL: "",
    imageName: "",
    choices: ["", "", "", ""],
    correctAnswer: "A",
    points: 1
  };

  questions.push(question);

  renderQuestions();

}


/*
 * RENDER QUESTIONS
 */

function renderQuestions() {

  const container =
    document.getElementById(
      "questions-container"
    );

  container.innerHTML = "";

  questions.forEach(
    (question, index) => {

      const card =
        document.createElement("div");

      card.className =
        "question-card";

      card.dataset.id =
        question.id;


      /*
       * HEADER
       */

      const header =
        document.createElement("div");

      header.className =
        "question-card-header";


      const number =
        document.createElement("div");

      number.className =
        "question-number";

      number.textContent =
        "Question " + (index + 1);


      const deleteButton =
        document.createElement("button");

      deleteButton.type = "button";

      deleteButton.className =
        "delete-button";

      deleteButton.textContent =
        "Delete Question";


      deleteButton.addEventListener(
        "click",
        () => {

          questions =
            questions.filter(
              item =>
                item.id !== question.id
            );

          renderQuestions();

        }
      );


      header.appendChild(number);

      header.appendChild(
        deleteButton
      );

      card.appendChild(header);


      /*
       * QUESTION TEXT
       */

      const questionField =
        document.createElement("div");

      questionField.className =
        "question-field";


      const questionLabel =
        document.createElement("label");

      questionLabel.textContent =
        "Question";


      const questionInput =
        document.createElement("textarea");

      questionInput.rows = 3;

      questionInput.value =
        question.question;


      questionInput.addEventListener(
        "input",
        () => {

          question.question =
            questionInput.value;

        }
      );


      questionLabel.appendChild(
        questionInput
      );

      questionField.appendChild(
        questionLabel
      );

      card.appendChild(
        questionField
      );


      /*
       * IMAGE
       */

      createImageControls(
        card,
        question
      );


      /*
       * QUESTION TYPE
       */

      const typeField =
        document.createElement("div");

      typeField.className =
        "question-field";


      const typeLabel =
        document.createElement("label");

      typeLabel.textContent =
        "Question Type";


      const typeSelect =
        document.createElement("select");


      [
        "multiple choice",
        "fill in",
        "short answer"
      ].forEach(type => {

        const option =
          document.createElement("option");

        option.value = type;

        option.textContent =
          type === "multiple choice"
            ? "Multiple Choice"
            : type === "fill in"
              ? "Fill In"
              : "Short Answer";

        typeSelect.appendChild(
          option
        );

      });


      typeSelect.value =
        question.type;


      typeSelect.addEventListener(
        "change",
        () => {

          question.type =
            typeSelect.value;

          renderQuestions();

        }
      );


      typeLabel.appendChild(
        typeSelect
      );

      typeField.appendChild(
        typeLabel
      );

      card.appendChild(
        typeField
      );


      /*
       * MULTIPLE CHOICE
       */

      if (
        question.type ===
        "multiple choice"
      ) {

        const choices =
          document.createElement("div");

        choices.className =
          "choices";


        question.choices.forEach(
          (choice, choiceIndex) => {

            const row =
              document.createElement("div");

            row.className =
              "choice-row";


            const label =
              document.createElement("div");

            label.className =
              "choice-label";

            label.textContent =
              String.fromCharCode(
                65 + choiceIndex
              );


            const input =
              document.createElement("input");

            input.type = "text";

            input.value = choice;

            input.placeholder =
              "Answer choice " +
              String.fromCharCode(
                65 + choiceIndex
              );


            input.addEventListener(
              "input",
              () => {

                question.choices[
                  choiceIndex
                ] = input.value;

              }
            );


            row.appendChild(label);

            row.appendChild(input);

            choices.appendChild(row);

          }
        );


        /*
         * CORRECT ANSWER
         */

        const correctRow =
          document.createElement("div");

        correctRow.className =
          "correct-row";


        const correctLabel =
          document.createElement("label");

        correctLabel.textContent =
          "Correct Answer";


        const correctSelect =
          document.createElement("select");


        ["A", "B", "C", "D"]
          .forEach(letter => {

            const option =
              document.createElement("option");

            option.value = letter;

            option.textContent =
              letter;

            correctSelect.appendChild(
              option
            );

          });


        correctSelect.value =
          question.correctAnswer;


        correctSelect.addEventListener(
          "change",
          () => {

            question.correctAnswer =
              correctSelect.value;

          }
        );


        correctRow.appendChild(
          correctLabel
        );

        correctRow.appendChild(
          correctSelect
        );

        choices.appendChild(
          correctRow
        );


        /*
         * POINTS
         */

        const pointsRow =
          document.createElement("div");

        pointsRow.className =
          "points-row";


        const pointsLabel =
          document.createElement("label");

        pointsLabel.textContent =
          "Points Possible";


        const pointsInput =
          document.createElement("input");

        pointsInput.type = "number";

        pointsInput.min = "0";

        pointsInput.step = "1";

        pointsInput.value =
          question.points;


        pointsInput.addEventListener(
          "input",
          () => {

            question.points =
              Number(
                pointsInput.value
              ) || 0;

          }
        );


        pointsRow.appendChild(
          pointsLabel
        );

        pointsRow.appendChild(
          pointsInput
        );

        choices.appendChild(
          pointsRow
        );


        card.appendChild(choices);

      }


      container.appendChild(card);

    }
  );

}


/*
 * IMAGE CONTROLS
 */

function createImageControls(
  card,
  question
) {

  const section =
    document.createElement("div");

  section.className =
    "image-section";


  const label =
    document.createElement("div");

  label.className =
    "image-label";

  label.textContent =
    "Question Image";


  section.appendChild(label);


  const controls =
    document.createElement("div");

  controls.className =
    "image-controls";


  /*
   * EXISTING IMAGE
   */

  const chooseButton =
    document.createElement("button");

  chooseButton.type = "button";

  chooseButton.textContent =
    "Choose Image";


  chooseButton.addEventListener(
    "click",
    () => {

      alert(
        "The image library will be added here."
      );

    }
  );


  /*
   * UPLOAD
   */

  const uploadButton =
    document.createElement("button");

  uploadButton.type = "button";

  uploadButton.textContent =
    "Upload New Image";


  const fileInput =
    document.createElement("input");

  fileInput.type = "file";

  fileInput.accept =
    "image/png,image/jpeg,image/gif,image/webp";

  fileInput.style.display =
    "none";


  uploadButton.addEventListener(
    "click",
    () => {

      fileInput.click();

    }
  );


  fileInput.addEventListener(
    "change",
    () => {

      const file =
        fileInput.files[0];

      if (!file) {
        return;
      }


      /*
       * TEMPORARY PREVIEW
       *
       * Cloudinary upload will
       * replace this later.
       */

      const previewURL =
        URL.createObjectURL(file);

      question.imageURL =
        previewURL;

      question.imageName =
        file.name;

      renderQuestions();

    }
  );


  controls.appendChild(
    chooseButton
  );

  controls.appendChild(
    uploadButton
  );

  controls.appendChild(
    fileInput
  );


  section.appendChild(
    controls
  );


  /*
   * IMAGE PREVIEW
   */

  if (question.imageURL) {

    const preview =
      document.createElement("img");

    preview.className =
      "editor-image-preview";

    preview.src =
      question.imageURL;

    preview.alt =
      question.imageName ||
      "Question image";


    section.appendChild(
      preview
    );


    const filename =
      document.createElement("div");

    filename.className =
      "image-filename";

    filename.textContent =
      question.imageName;


    section.appendChild(
      filename
    );


    const removeButton =
      document.createElement("button");

    removeButton.type = "button";

    removeButton.textContent =
      "Remove Image";

    removeButton.className =
      "delete-button";


    removeButton.addEventListener(
      "click",
      () => {

        question.imageURL =
          "";

        question.imageName =
          "";

        renderQuestions();

      }
    );


    section.appendChild(
      removeButton
    );

  }


  card.appendChild(section);

}


/*
 * SAVE
 */

document
  .getElementById("save-quiz")
  .addEventListener(
    "click",
    saveQuiz
  );


function saveQuiz() {

  const title =
    document
      .getElementById("quiz-title")
      .value
      .trim();

  const description =
    document
      .getElementById("quiz-description")
      .value
      .trim();

  const allowEditing =
    document
      .getElementById("allow-editing")
      .checked;


  if (!title) {

    alert(
      "Please enter a quiz title."
    );

    return;

  }


  if (questions.length === 0) {

    alert(
      "Please add at least one question."
    );

    return;

  }


  console.log({
    title,
    description,
    allowEditing,
    questions
  });


  document
    .getElementById("save-message")
    .textContent =
      "Quiz data ready to save.";

}


/*
 * START WITH ONE QUESTION
 */

addQuestion();
