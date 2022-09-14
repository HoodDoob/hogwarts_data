"use strict";
const url = "https://petlatkea.dk/2021/hogwarts/students.json";
window.addEventListener("DOMContentLoaded", start);

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
async function start() {
  document.querySelector("#filter").addEventListener("change", filter);
  // console.log("ready");

  await loadJSON();
}
function addButtons(student) {
  // console.log(allStudents);
  document
    .querySelector(`button${student.index}`)
    .addEventListener("click", test1);

  // document.querySelector(`#popup${actor.index}`).classList.toggle("hidden");
}
function test1() {
  console.log("clicked");
}
// MODEL    MODEL     MODEL     MODEL
// MODEL    MODEL     MODEL     MODEL

async function loadJSON() {
  const response = await fetch(url);
  const jsonData = await response.json();
  // when loaded, prepare data objects
  await prepareObjects(jsonData);
  // addButtons(allStudents);
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
  // student.nickName = nickName;
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
  if (filterValue == "boys") {
    console.log("we're filtering boyz");
    let onlyBoys = allStudents.filter(isBoy);
    displayList(onlyBoys);
  } else if (filterValue == "girls") {
    console.log("we're filtering girlz");
    let onlyGirls = allStudents.filter(isGirl);
    displayList(onlyGirls);
  }
  console.log(filterValue);
}

function isGirl(student) {
  if (student.gender === "girl") {
    return true;
  } else {
    return false;
  }
}
function isBoy(student) {
  if (student.gender === "boy") {
    return true;
  } else {
    return false;
  }
}
function capitalize(str) {
  if (str != "") return str[0].toUpperCase() + str.substring(1).toLowerCase();
}

// VIEW     VIEW     VIEW     VIEW
// VIEW     VIEW     VIEW     VIEW

async function displayList(allStudents) {
  // clear the list
  // document.querySelector(".general_students").innerHTML = "";
  // build a new list
  await allStudents.forEach((student) => (student.index = index++));
  await allStudents.forEach(displayStudents);
  allStudents.forEach(addButtons);
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
  clone.querySelector("button").setAttribute("id", `index${student.index}`);
  clone.querySelector(".popup").setAttribute("id", `index${student.index}`);
  // clone
  // append clone to list
  document.querySelector(".general_students").appendChild(clone);
}
