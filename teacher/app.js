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
  
      chooseExistingImage(
        question
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
    async () => {
  
      const file =
        fileInput.files[0];
  
      if (!file) {
        return;
      }
  
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp"
      ];
  
      if (!allowedTypes.includes(file.type)) {
  
        alert(
          "Please choose a PNG, JPEG, GIF, or WebP image."
        );
  
        fileInput.value = "";
  
        return;
      }
  
      if (file.size > 10 * 1024 * 1024) {
  
        alert(
          "The image must be smaller than 10 MB."
        );
  
        fileInput.value = "";
  
        return;
      }
  
      uploadButton.disabled = true;
  
      uploadButton.textContent =
        "Uploading...";
  
      try {
  
        const formData =
          new FormData();
  
        formData.append(
          "file",
          file
        );
  
        formData.append(
          "upload_preset",
          "quiz_images"
        );
  
        formData.append(
          "asset_folder",
          "quiz-images"
        );
  
        const response =
          await fetch(
            "https://api.cloudinary.com/v1_1/rugxb33q/image/upload",
            {
              method: "POST",
              body: formData
            }
          );
  
        const result =
          await response.json();
  
        if (!response.ok || !result.secure_url) {
  
          console.error(
            "Cloudinary upload failed:",
            result
          );
  
          throw new Error(
            "Cloudinary upload failed."
          );
        }
  
        question.imageURL =
          result.secure_url;
  
        question.imageName =
          file.name;
  
        renderQuestions();
  
      } catch (error) {
  
        console.error(error);
  
        alert(
          "The image could not be uploaded."
        );
  
      } finally {
  
        uploadButton.disabled = false;
  
        uploadButton.textContent =
          "Upload New Image";
  
        fileInput.value = "";
  
      }
  
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

async function chooseExistingImage(question) {

  try {

    /*
     * Ask the Apps Script backend
     * for the Media library.
     *
     * Replace API_URL with the
     * same API_URL already used
     * elsewhere in teacher/app.js.
     */

    const response =
      await fetch(
        API_URL +
        "?action=getTeacherMediaImages"
      );

    const result =
      await response.json();

    if (!result.success) {

      throw new Error(
        result.error ||
        "Unable to load images."
      );

    }

    const images =
      result.images || [];

    if (images.length === 0) {

      alert(
        "No images are available."
      );

      return;

    }

    /*
     * Temporary visual picker.
     */

    const overlay =
      document.createElement("div");

    overlay.className =
      "image-picker-overlay";


    const picker =
      document.createElement("div");

    picker.className =
      "image-picker";


    const heading =
      document.createElement("h2");

    heading.textContent =
      "Choose Image";

    picker.appendChild(
      heading
    );


    const grid =
      document.createElement("div");

    grid.className =
      "image-picker-grid";


    images.forEach(image => {

      const item =
        document.createElement("button");

      item.type = "button";

      item.className =
        "image-picker-item";


      const thumbnail =
        document.createElement("img");

      thumbnail.src =
        image.url;

      thumbnail.alt =
        image.name;


      const name =
        document.createElement("div");

      name.textContent =
        image.name;


      item.appendChild(
        thumbnail
      );

      item.appendChild(
        name
      );


      item.addEventListener(
        "click",
        () => {

          question.imageURL =
            image.url;

          question.imageName =
            image.name;

          overlay.remove();

          renderQuestions();

        }
      );


      grid.appendChild(item);

    });


    picker.appendChild(
      grid
    );


    const closeButton =
      document.createElement("button");

    closeButton.type = "button";

    closeButton.textContent =
      "Cancel";


    closeButton.addEventListener(
      "click",
      () => {
        overlay.remove();
      }
    );


    picker.appendChild(
      closeButton
    );

    overlay.appendChild(
      picker
    );

    document.body.appendChild(
      overlay
    );

  } catch (error) {

    console.error(
      "Image library error:",
      error
    );

    alert(
      "Unable to load the image library."
    );

  }

}
