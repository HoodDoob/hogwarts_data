"use strict";
const url = "https://petlatkea.dk/2021/hogwarts/students.json";
window.addEventListener("DOMContentLoaded", start);

const Student = {
  index: "",
  firstName: "-default name",
  lastName: "-no description",
  middleName: "-unknown-",
  nickName: "",
  photo: "",
  house: "",
  gender: "",
  imageName: "",
  prefect: false,
  expelled: false,
  squad: false,
};
let allStudents = [];
let expelledArray = [];
let filteredList = [];
let index = 1;

// start();

function start() {
  document.querySelector("#logo").addEventListener("click", consoleLogg);

  document.querySelector("#filter").addEventListener("change", filterStudents);
  document
    .querySelector("#search_bar")
    .addEventListener("keyup", searchFunction);

  // console.log("ready");

  loadJSON();
}
// MODEL    MODEL     MODEL     MODEL
// MODEL    MODEL     MODEL     MODEL

async function loadJSON() {
  const response = await fetch(url);
  const jsonData = await response.json();
  // when loaded, prepare data objects
  prepareObjects(jsonData);
  // addButtons(allStudents);
}
function consoleLogg() {
  console.log(filteredList);
}

function prepareObject(jsonObject) {
  const student = Object.create(Student);
  // extrat data from json Object
  let gender = jsonObject.gender.trim();
  let fullName = jsonObject.fullname.trim();
  let studentName = fullName.substring("", fullName.indexOf(" "));
  let house = jsonObject.house.trim();
  let studentLastName = fullName.substring(fullName.lastIndexOf(" ")).trim();
  let middleName = fullName
    .substring(fullName.indexOf(" "), fullName.lastIndexOf(" "))
    .trim();

  if (middleName.includes(`"`)) {
    student.nickName = fullName
      .substring(fullName.indexOf(" "), fullName.lastIndexOf(" "))
      .replaceAll(`"`, "")
      .trim();
    middleName = "";
  } else {
    student.nickName = undefined;
  }
  studentLastName = capitalize(studentLastName);
  house = capitalize(house);
  let newStudentName = capitalize(studentName);
  middleName = capitalize(middleName);
  let imageName;

  if (studentLastName == "Patil") {
    imageName = `${studentLastName.toLowerCase()}_${studentName.toLowerCase()}.png`;
  } else if (studentLastName.includes("-")) {
    imageName = "fletchley_j.png";
  } else {
    imageName = `${studentLastName.toLowerCase()}_${studentName[0]}.png`;
  }

  // !here the blood status will be added

  // put cleaned data into newly created object
  student.firstName = newStudentName;
  student.gender = gender;
  student.lastName = studentLastName;
  student.middleName = middleName;
  student.house = house;
  student.imageName = imageName;
  student.index = index++;
  return student;
}
// CONTROLLER    CONTROLLER     CONTROLLER     CONTROLLER
// CONTROLLER    CONTROLLER     CONTROLLER     CONTROLLER

function popUp() {
  console.log("pop up");
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  // console.table(allStudents);

  // TODO: This might not be the function we want to call first
  filterStudents(allStudents);
}

function filterStudents() {
  let filterValue = document.querySelector("#filter").value;

  filteredList = allStudents.filter(studentFilter);

  function studentFilter(student) {
    console.log("we're in filter");
    if (student.gender === filterValue) {
      return true;
    } else if (student.house === filterValue) {
      return true;
    } else if (filterValue === "all") {
      if (student.expelled == true) {
        return false;
      } else {
        return true;
      }
    } else if (filterValue === "prefect") {
      if (student.prefect === true) {
        return true;
      } else {
        return false;
      }
    }
  }
  if (filterValue === "expelled") {
    // console.log(expelledArray);
    displayList(expelledArray);
  } else {
    // console.log(filteredList);
    displayList(filteredList);
  }
}
function capitalize(str) {
  if (str != "") return str[0].toUpperCase() + str.substring(1).toLowerCase();
}
function addButtons() {
  console.log("działamy");
  allStudents.forEach((student) =>
    document
      .querySelector(`button#index${student.index}`)
      .addEventListener("click", () => {
        document
          .querySelector(`.popup#index${student.index}`)
          .classList.toggle("hidden");
      })
  );

  // document.querySelector(`#popup${actor.index}`).classList.toggle("hidden");
}
// ! search bar teraz działamy jazda
function searchFunction() {
  console.log("searching");
  // przelot przez filtered list
}

// VIEW     VIEW     VIEW     VIEW
// VIEW     VIEW     VIEW     VIEW

function displayList(students) {
  // clear the list
  document.querySelector(".general_students").innerHTML = "";
  // build a new list
  students.forEach(displayStudents);
  // addButtons(allStudents);
}
function houseToColor(house) {
  if (house == "Gryffindor") {
    return "var(--color-Gryffindor)";
  } else if (house == "Slytherin") {
    return "var(--color-Slytherin)";
  } else if (house == "Hufflepuff") {
    return "var(--color-Hufflepuff)";
  } else {
    return "var(--color-Ravenclaw)";
  }
}

function displayStudents(student) {
  // create clone
  const clone = document.querySelector("template").content.cloneNode(true);
  // set clone data
  if (student.middleName != undefined) {
    clone.querySelector(
      "#name"
    ).textContent = `${student.firstName} ${student.middleName}`;
  } else {
    clone.querySelector("#name").textContent = `${student.firstName}`;
  }

  clone.querySelector("#surname").textContent = student.lastName;
  clone.querySelector("#house").textContent = student.house;

  if (student.nickName != undefined) {
    clone.querySelector(".student_nickname").innerHTML = "Nickname";
    clone.querySelector("#nickname").textContent = student.nickName;
  }
  clone.querySelector(".hide_popup").addEventListener("click", setPopup);
  // clone.querySelector(".btPrefect").addEventListener("click", setPrefect);

  // ! partially stole code from Lucas

  if (student.prefect === false) {
    clone.querySelector("#prefect").innerHTML = "No";
  } else {
    clone.querySelector("#prefect").innerHTML = "Yes";
  }

  clone.querySelector(".btPrefect").addEventListener("click", addPrefect);
  clone.querySelector(".btExpell").addEventListener("click", expellStudent);

  function addPrefect() {
    student.prefect = !student.prefect;
    if (student.prefect) {
      document.querySelector(`#index${student.index}  #prefect `).textContent =
        "Yes";
    } else {
      document.querySelector(`#index${student.index}  #prefect `).textContent =
        "No";
    }
  }
  // if (student.expelled == true) {
  //   // expelledArray.push(student);
  //   removeExpelled2(student);
  // }
  function expellStudent() {
    // i add the expelled aprameter so that i can keep track of whether it's expelled
    student.expelled = true;
    expelledArray.push(student);
    console.log(expelledArray);
    console.log(filteredList);
    removeExpelled(student);
  }

  function removeExpelled(student) {
    delete filteredList[student.index - 1];
    console.log(filteredList);
    displayList(filteredList);
  }

  // ! end of stolen code from Lucas
  // ?adding id to a template
  clone.querySelector(".template").setAttribute("id", `index${student.index}`);

  // ? adding id to all buttons
  clone
    .querySelector(".hide_popup")
    .setAttribute("id", `index${student.index}`);
  clone.querySelector(".btPrefect").setAttribute("id", `index${student.index}`);
  clone.querySelector(".btExpell").setAttribute("id", `index${student.index}`);
  clone.querySelector(".btSquad").setAttribute("id", `index${student.index}`);

  clone.querySelector(
    ".student_picture2"
  ).src = `imgStudents/${student.imageName}`;
  // adding unique ID to each template clone

  clone.querySelector("#house_color").style.backgroundImage = houseToColor(
    student.house
  );

  //     // clone
  //     // append clone to list
  document.querySelector(".general_students").appendChild(clone);
  //   });

  // ? previous prefect function
}

function setPopup(event) {
  let testIndex = event.target.id;
  document.querySelector(`#${testIndex}  .popup `).classList.toggle("hidden");

  // let testIndex = filteredList;
  // console.log(testIndex);
}

// function expel() {
//   let expelledStudent = allStudents.find(hasID);

//   function hasID(object) {
//       if (object.studentId === foundStudent.studentId) {
//           return object.studentId;
//       }
//   }
//   addExpelled(expelledStudent);
// }

// function addExpelled(student) {
//   expelledStudents.push(student);
//   removeExpelled(student);
// }

// function removeExpelled(student) {
//   let removeMe = student.studentId - 1;
//   allStudents.splice(removeMe, 1);
//   displayList(allStudents);
// }
