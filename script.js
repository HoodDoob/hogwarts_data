"use strict";
const url = "https://petlatkea.dk/2021/hogwarts/students.json";
// window.addEventListener("DOMContentLoaded", start);

start();

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
};
let allStudents = [];
let index = 0;
function start() {
  document.querySelector("#logo_image").addEventListener("click", addButtons);
  document.querySelector("#logo_text").addEventListener("click", checkStudents);

  document.querySelector("#filter").addEventListener("change", filter);

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
function checkStudents() {
  console.log(allStudents);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  console.table(allStudents);

  // TODO: This might not be the function we want to call first
  displayList(allStudents);
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

function filter() {
  let filterValue = document.querySelector("#filter").value;
  let list = allStudents.filter(studentFilter);
  function studentFilter(student) {
    if (student.gender == filterValue) {
      return true;
    } else if (student.house == filterValue) {
      return true;
    } else if (filterValue == "all") {
      loadJSON();
    } else {
      return false;
    }
  }
  displayList(list);
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

// VIEW     VIEW     VIEW     VIEW
// VIEW     VIEW     VIEW     VIEW

async function displayList(allStudents) {
  // clear the list
  document.querySelector(".general_students").innerHTML = "";
  // build a new list
  allStudents.forEach((student) => (student.index = index++));
  allStudents.forEach(displayStudents);
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
  if (student.nickName != undefined) {
    clone.querySelector(".student_nickname").innerHTML = "Nickname";
    clone.querySelector("#nickname").textContent = student.nickName;
  }

  clone.querySelector(
    ".student_picture2"
  ).src = `imgStudents/${student.imageName}`;
  // adding unique ID to each template clone
  clone
    .querySelector("#hide_popup")
    .setAttribute("id", `index${student.index}`);
  clone.querySelector(".popup").setAttribute("id", `index${student.index}`);
  clone.querySelector("#house_color").style.backgroundImage = houseToColor(
    student.house
  );

  // clone
  // append clone to list
  document.querySelector(".general_students").appendChild(clone);
}
