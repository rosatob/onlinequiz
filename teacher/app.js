const API_URL = "https://script.google.com/macros/s/AKfycbwsUVEpxaPwT9TN-T2LlEgcV-rdU4e_jTSsK79COIDymqpzfSNPfRR8y1remfpJfZ9uqA/exec";

let questions = [];

let questionCounter = 0;

async function apiPost(data) {

  const response =
    await fetch(
      API_URL,
      {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },
        body:
          JSON.stringify(data)
      }
    );

  return await response.json();

}


/*
 * ADD QUESTION
 */

document
  .getElementById("add-question")
  .addEventListener("click", addQuestion);


function addQuestion() {

  questionCounter++;

  const question = {
    questionID: "Q" + questionCounter,
    question: "",
    questionType: "multiple choice",
    imageURL: "",
    imageName: "",
    youtubeURL: "",
    choiceA: "",
    choiceB: "",
    choiceC: "",
    choiceD: "",
    correctAnswer: "A",
    pointsPossible: 1
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
        question.questionID;

      card.dataset.index = index;

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
                item.questionID !== question.questionID
            );

          renderQuestions();

        }
      );

      const reorderButtons =
        document.createElement("div");
      
      reorderButtons.className =
        "reorder-buttons";
      
      const upButton =
        document.createElement("button");
      
      upButton.className =
        "reorder-button";
      
      upButton.type = "button";
      
      upButton.textContent = "↑";
      
      upButton.title =
        "Move question up";
      
      upButton.addEventListener(
        "click",
        () => {
      
          moveQuestion(
            index,
            -1
          );
      
        }
      );
      
      
      const downButton =
        document.createElement("button");
      
      downButton.className =
        "reorder-button";
      
      downButton.type = "button";
      
      downButton.textContent = "↓";
      
      downButton.title =
        "Move question down";
      
      downButton.addEventListener(
        "click",
        () => {
      
          moveQuestion(
            index,
            1
          );
      
        }
      );

      upButton.disabled =
        index === 0;
      
      downButton.disabled =
        index === questions.length - 1;
      
      const duplicateButton =
        document.createElement("button");
      
      duplicateButton.type =
        "button";
      
      duplicateButton.textContent =
        "Duplicate Question";
      
      duplicateButton.addEventListener(
        "click",
        () => {
      
          const newQuestion = {
            questionID:
              "Q" +
              Date.now(),
      
            question:
              question.question,
      
            questionType:
              question.questionType,

      
            imageURL:
              question.imageURL,
      
            imageName:
              question.imageName,
      
            youtubeURL:
              question.youtubeURL,
      
            choiceA:
              question.choiceA,
      
            choiceB:
              question.choiceB,
      
            choiceC:
              question.choiceC,
      
            choiceD:
              question.choiceD,
      
            correctAnswer:
              question.correctAnswer,
      
            pointsPossible:
              question.pointsPossible
          };
      
          const index =
            questions.indexOf(
              question
            );
      
          questions.splice(
            index + 1,
            0,
            newQuestion
          );
      
          renderQuestions();
      
        }
      );

      header.appendChild(number);

      header.appendChild(
        deleteButton
      );
      
      header.appendChild(
        duplicateButton
      );

      reorderButtons.appendChild(
        upButton
      );
      
      reorderButtons.appendChild(
        downButton
      );
      
      header.appendChild(
        reorderButtons
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

      createYouTubeControls(
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
        question.questionType;


      typeSelect.addEventListener(
        "change",
        () => {

          question.questionType =
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
        question.questionType ===
        "multiple choice"
      ) {

        const choices =
          document.createElement("div");

        choices.className =
          "choices";


        const choiceProperties = [
          "choiceA",
          "choiceB",
          "choiceC",
          "choiceD"
        ];
        
        choiceProperties.forEach(
          (property, choiceIndex) => {
        
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
        
            input.value =
              question[property] || "";
        
            input.placeholder =
              "Answer choice " +
              String.fromCharCode(
                65 + choiceIndex
              );
        
            input.addEventListener(
              "input",
              () => {
        
                question[property] =
                  input.value;
        
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


        

        


        card.appendChild(choices);

      }

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
      
      pointsInput.type =
        "number";
      
      pointsInput.min =
        "0";
      
      pointsInput.step =
        "1";
      
      pointsInput.value =
        question.pointsPossible;
      
      pointsInput.addEventListener(
        "input",
        () => {
      
          question.pointsPossible =
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
      
      card.appendChild(
        pointsRow
      );

      container.appendChild(card);

    }
  );

}




/*
 * IMAGE CONTROLS
 */

function createImageControls(card, question) {

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
   * IMAGE NAME + UPLOAD AREA
   *
   * Hidden until a file is selected.
   */

  const uploadArea =
    document.createElement("div");

  uploadArea.className =
    "image-upload-area";

  uploadArea.style.display =
    "none";


  const nameLabel =
    document.createElement("label");

  nameLabel.textContent =
    "Image Name";


  const nameInput =
    document.createElement("input");

  nameInput.type =
    "text";

  nameInput.placeholder =
    "Enter a name for this image";

  nameInput.className =
    "image-name-input";


  nameLabel.appendChild(
    nameInput
  );


  const confirmUploadButton =
    document.createElement("button");

  confirmUploadButton.type =
    "button";

  confirmUploadButton.textContent =
    "Upload Image";

  confirmUploadButton.className =
    "primary-button";


  const cancelUploadButton =
    document.createElement("button");

  cancelUploadButton.type =
    "button";

  cancelUploadButton.textContent =
    "Cancel";


  const uploadStatus =
    document.createElement("div");

  uploadStatus.className =
    "image-upload-status";


  uploadArea.appendChild(
    nameLabel
  );

  uploadArea.appendChild(
    confirmUploadButton
  );

  uploadArea.appendChild(
    cancelUploadButton
  );

  uploadArea.appendChild(
    uploadStatus
  );


  section.appendChild(
    uploadArea
  );


  /*
   * SELECT FILE
   */

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


      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp"
      ];


      if (
        !allowedTypes.includes(
          file.type
        )
      ) {

        alert(
          "Please choose a PNG, JPEG, GIF, or WebP image."
        );

        fileInput.value = "";

        return;

      }


      if (
        file.size >
        10 * 1024 * 1024
      ) {

        alert(
          "The image must be smaller than 10 MB."
        );

        fileInput.value = "";

        return;

      }


      /*
       * Default the name to the
       * filename without extension.
       */

      nameInput.value =
        file.name.replace(
          /\.[^/.]+$/,
          ""
        );


      uploadArea.style.display =
        "block";

      nameInput.focus();

    }
  );


  /*
   * CANCEL UPLOAD
   */

  cancelUploadButton.addEventListener(
    "click",
    () => {

      fileInput.value = "";

      nameInput.value = "";

      uploadArea.style.display =
        "none";

      uploadStatus.textContent =
        "";

    }
  );


  /*
   * CONFIRM UPLOAD
   */

  confirmUploadButton.addEventListener(
    "click",
    async () => {

      const file =
        fileInput.files[0];

      if (!file) {
        return;
      }


      const imageName =
        nameInput.value.trim();


      if (!imageName) {

        alert(
          "Please enter an image name."
        );

        nameInput.focus();

        return;

      }


      confirmUploadButton.disabled =
        true;

      cancelUploadButton.disabled =
        true;

      uploadStatus.textContent =
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


        /*
         * Use the teacher's image name
         * as the Cloudinary public ID.
         */

        formData.append(
          "public_id",
          imageName
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


        if (
          !response.ok ||
          !result.secure_url
        ) {

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
          imageName;

        const mediaResult =
          await apiPost({
            action: "addMediaImage",
        
            name:
              imageName,
        
            url:
              result.secure_url
          });
        
        if (
          !mediaResult.success
        ) {
        
          throw new Error(
            mediaResult.error ||
            "Unable to add image to Media library."
          );
        
        }

        renderQuestions();


      } catch (error) {

        console.error(error);

        uploadStatus.textContent =
          "Upload failed.";

        alert(
          "The image could not be uploaded."
        );


        confirmUploadButton.disabled =
          false;

        cancelUploadButton.disabled =
          false;

      }

    }
  );


  /*
   * CURRENT IMAGE PREVIEW
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

    removeButton.type =
      "button";

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


  card.appendChild(
    section
  );

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


async function saveQuiz() {

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


  /*
   * Validate questions
   */

  for (
    let i = 0;
    i < questions.length;
    i++
  ) {

    const question = questions[i];
    const questionNumber = i + 1;


    if (
      !question.question ||
      !question.question.trim()
    ) {

      alert(
        "Question " +
        questionNumber +
        " needs question text."
      );

      return;

    }


    if (
      question.pointsPossible === undefined ||
      question.pointsPossible === null ||
      Number.isNaN(
        Number(question.pointsPossible)
      ) ||
      Number(question.pointsPossible) < 0
    ) {

      alert(
        "Question " +
        questionNumber +
        " needs a valid Points Possible value."
      );

      return;

    }


    if (
      question.questionType ===
      "multiple choice"
    ) {

      const choices = [
        question.choiceA,
        question.choiceB,
        question.choiceC,
        question.choiceD
      ];


      for (
        let j = 0;
        j < choices.length;
        j++
      ) {

        if (
          !choices[j] ||
          !choices[j].trim()
        ) {

          alert(
            "Question " +
            questionNumber +
            " needs all four answer choices."
          );

          return;

        }

      }


      if (
        !["A", "B", "C", "D"]
          .includes(
            question.correctAnswer
          )
      ) {

        alert(
          "Question " +
          questionNumber +
          " needs a valid correct answer."
        );

        return;

      }

    }

  }


  const saveMessage =
    document.getElementById(
      "save-message"
    );

  saveMessage.textContent =
    "Saving quiz...";


  try {

    /*
     * First create the quiz record.
     */

    const quizResult =
      await apiPost({

        action: "saveQuiz",

        title: title,

        description: description,

        allowEditing: allowEditing

      });


    if (!quizResult.success) {

      throw new Error(
        quizResult.error ||
        "Unable to save quiz."
      );

    }


    const quizID =
      quizResult.quizID;


    /*
     * Then save all questions
     * using the new QuizID.
     */

    const questionResult =
      await apiPost({

        action: "saveQuestions",

        quizID: quizID,

        questions: questions

      });


    if (!questionResult.success) {

      throw new Error(
        questionResult.error ||
        "Unable to save questions."
      );

    }


    saveMessage.textContent =
      "Quiz saved. QuizID: " +
      quizID;

    const quizLink =
      window.location.origin +
      "/onlinequiz/?quiz=" +
      encodeURIComponent(quizID);
    
    document.getElementById(
      "quiz-link"
    ).value = quizLink;
    
    document.getElementById(
      "quiz-link-area"
    ).style.display = "block";
    
    console.log(
      "Quiz saved:",
      quizID
    );

    console.log(
      "Questions saved:",
      questionResult.count
    );


  } catch (error) {

    console.error(
      "Save quiz error:",
      error
    );


    saveMessage.textContent =
      "Unable to save quiz.";


    alert(
      "Unable to save quiz.\n\n" +
      error.message
    );

  }

}


/*
 * START WITH ONE QUESTION
 */

addQuestion();


async function chooseExistingImage(question) {

  try {

    const response =
      await fetch(
        API_URL +
        "?action=getTeacherMediaImages"
      );

    if (!response.ok) {

      throw new Error(
        "HTTP error " + response.status
      );

    }

    const result =
      await response.json();

    console.log(
      "MEDIA LIBRARY RESULT:",
      result
    );

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

function createYouTubeControls(card, question) {

  const section =
    document.createElement("div");

  section.className =
    "youtube-section";


  const label =
    document.createElement("label");

  label.textContent =
    "YouTube Video";


  const input =
    document.createElement("input");

  input.type =
    "url";

  input.placeholder =
    "Paste a YouTube URL";

  input.value =
    question.youtubeURL || "";


  input.addEventListener(
    "input",
    () => {

      question.youtubeURL =
        input.value.trim();

      updateYouTubePreview(
        section,
        question
      );

    }
  );


  section.appendChild(
    label
  );

  section.appendChild(
    input
  );


  updateYouTubePreview(
    section,
    question
  );


  card.appendChild(
    section
  );

}

function updateYouTubePreview(
  section,
  question
) {

  const oldPreview =
    section.querySelector(
      ".youtube-preview"
    );

  if (oldPreview) {
    oldPreview.remove();
  }


  const videoID =
    getYouTubeVideoID(
      question.youtubeURL
    );

  if (!videoID) {
    return;
  }


  const iframe =
    document.createElement("iframe");

  iframe.className =
    "youtube-preview";

  iframe.src =
    "https://www.youtube.com/embed/" +
    videoID;

  iframe.title =
    "YouTube video";

  iframe.frameBorder =
    "0";

  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

  iframe.allowFullscreen =
    true;


  section.appendChild(
    iframe
  );

}

function getYouTubeVideoID(url) {

  if (!url) {
    return null;
  }

  try {

    const parsed =
      new URL(url);

    if (
      parsed.hostname ===
        "www.youtube.com" ||
      parsed.hostname ===
        "youtube.com"
    ) {

      return parsed.searchParams.get(
        "v"
      );

    }

    if (
      parsed.hostname ===
        "youtu.be"
    ) {

      return parsed.pathname.substring(
        1
      );

    }

  } catch (error) {

    return null;

  }

  return null;

}

function moveQuestion(
  index,
  direction
) {

  const newIndex =
    index + direction;

  if (
    newIndex < 0 ||
    newIndex >= questions.length
  ) {
    return;
  }

  const temp =
    questions[index];

  questions[index] =
    questions[newIndex];

  questions[newIndex] =
    temp;

  renderQuestions();

}

document
  .getElementById("copy-quiz-link")
  .addEventListener("click", async () => {

    const link =
      document.getElementById(
        "quiz-link"
      ).value;

    await navigator.clipboard.writeText(link);

    document.getElementById(
      "copy-quiz-link"
    ).textContent = "Copied!";

    setTimeout(() => {

      document.getElementById(
        "copy-quiz-link"
      ).textContent = "Copy Link";

    }, 1500);

  });

async function loadQuiz() {

  const quizID =
    document
      .getElementById("quiz-id")
      .value
      .trim();

  if (!quizID) {
    alert("Please enter a QuizID.");
    return;
  }

  try {

    const result =
      await apiPost({
        action: "getQuiz",
        quizID: quizID
      });

    if (!result.success) {
      throw new Error(
        result.error ||
        "Unable to load quiz."
      );
    }

    console.log(
      "Loaded quiz:",
      result
    );

  } catch (error) {

    console.error(
      "Load quiz error:",
      error
    );

    alert(
      "Unable to load quiz.\n\n" +
      error.message
    );
  }
}

document
  .getElementById("load-quiz")
  .addEventListener(
    "click",
    loadQuiz
  );
