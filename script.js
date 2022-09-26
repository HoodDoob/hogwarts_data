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
// test array
let arraySlytherin = [];
let arrayGryffindor = [];
let arrayHufflepuff = [];
let arrayRavenclaw = [];
let allStudents = [];
let expelledArray = [];
let filteredList = [];
let index = 1;
let sortDir = true;
// start();

function start() {
  document
    .querySelector("#show_expelled")
    .addEventListener("click", showExpelled);
  document.querySelector("#sort").addEventListener("change", sortingFunction);
  document
    .querySelector("#sort_arrow")
    .addEventListener("click", changeSorting);
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
  if (newStudentName == undefined) {
    newStudentName = "undefined";
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

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  // console.table(allStudents);

  // TODO: This might not be the function we want to call first
  filterStudents(allStudents);
}
function showExpelled() {
  displayList(expelledArray);
}
function changeSorting() {
  sortDir = !sortDir;
  if (sortDir == true) {
    document.querySelector("#sort_arrow").textContent = "↑";
  } else {
    document.querySelector("#sort_arrow").textContent = "↓";
  }
  sortingFunction();
}

function sortingFunction() {
  let sortingValue = document.querySelector("#sort").value;
  let sortingDir = document.querySelector("#sort_arrow").dataset;
  console.log(sortingDir);
  if (sortingValue == "firstname") {
    if (sortDir == true) {
      filteredList = filteredList.sort(function (a, b) {
        return a.firstName.localeCompare(b.firstName);
      });
    } else {
      filteredList = filteredList.sort(function (a, b) {
        return b.firstName.localeCompare(a.firstName);
      });
    }
  } else if (sortingValue == "surname") {
    if (sortDir == true) {
      filteredList = filteredList.sort(function (a, b) {
        return a.lastName.localeCompare(b.lastName);
      });
    } else {
      filteredList = filteredList.sort(function (a, b) {
        return b.lastName.localeCompare(a.lastName);
      });
    }
  } else if (sortingValue == "house") {
    if (sortDir == true) {
      filteredList = filteredList.sort(function (a, b) {
        return a.house.localeCompare(b.house);
      });
    } else {
      filteredList = filteredList.sort(function (a, b) {
        return b.house.localeCompare(a.house);
      });
    }
  } else if (sortingValue == "gender") {
    if (sortDir == true) {
      filteredList = filteredList.sort(function (a, b) {
        return a.gender.localeCompare(b.gender);
      });
    } else {
      filteredList = filteredList.sort(function (a, b) {
        return b.gender.localeCompare(a.gender);
      });
    }
  }
  displayList(filteredList);
}

function filterStudents() {
  let filterValue = document.querySelector("#filter").value;

  filteredList = allStudents.filter(studentFilter);

  function studentFilter(student) {
    console.log("we're in filter");
    if (student.expelled == true) {
      return false;
    } else if (student.gender === filterValue) {
      return true;
    } else if (student.house === filterValue) {
      return true;
    } else if (filterValue === "all") {
      return true;
    } else if (filterValue === "prefect") {
      if (student.prefect === true) {
        return true;
      } else {
        return false;
      }
    }
  }
  displayList(filteredList);
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
  let searchValue = document.querySelector("#search_bar").value;
  if (searchValue != "") {
    // let searchValueString = capitalize(searchValue);
    let searchValueString = capitalize(searchValue);
    searchFilter(searchValue, searchValueString);
  } else {
    displayList(filteredList);
  }
}

function searchFilter(searchValue, searchValueString) {
  let searchArray = [];
  filteredList.forEach(testFunction);
  function testFunction(student) {
    if (
      student.firstName.includes(searchValue) ||
      student.lastName.includes(searchValue)
    ) {
      searchArray.push(student);
    } else if (
      student.firstName.includes(searchValueString) ||
      student.lastName.includes(searchValueString)
    ) {
      searchArray.push(student);
    }
    displayList(searchArray);
  }
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
      if (student.house == "Gryffindor") {
        arrayGryffindor.push(student);
        killPrefects(arrayGryffindor);
      } else if (student.house == "Slytherin") {
        arraySlytherin.push(student);
        killPrefects(arraySlytherin);
      } else if (student.house == "Hufflepuff") {
        arrayHufflepuff.push(student);
        killPrefects(arrayHufflepuff);
      } else if (student.house == "Ravenclaw") {
        arrayRavenclaw.push(student);
        killPrefects(arrayRavenclaw);
      }
      document.querySelector(`#index${student.index}  #prefect `).textContent =
        "Yes";
    } else {
      if (student.house == "Gryffindor") {
        arrayGryffindor.splice(student);
      } else if (student.house == "Slytherin") {
        arraySlytherin.splice(student);
      } else if (student.house == "Hufflepuff") {
        arrayHufflepuff.splice(student);
      } else if (student.house == "Ravenclaw") {
        arrayRavenclaw.splice(student);
      }
      document.querySelector(`#index${student.index}  #prefect `).textContent =
        "No";
    }
    console.log(arrayGryffindor);
    console.log(arraySlytherin);
  }
  // if (student.expelled == true) {
  //   // expelledArray.push(student);
  //   removeExpelled2(student);
  // }
  function killPrefects(house) {
    if (house.length == 2) {
      // console.log(arrayGryffindor);
      // let firstFella = arrayGryffindor[0];
      // let secondFella = arrayGryffindor[1];
      if (house[0].gender === house[1].gender) {
        showGenderBlock(house);
      }
    } else if (house.length > 2) {
      showNumberBlock(house);
    }
  }
  function showGenderBlock(house) {
    console.log("gender is a concept");
    house.pop();
    // student.prefect = !student.prefect;
    document.querySelector(`#index${student.index}  #prefect `).textContent =
      "No";
  }
  function showNumberBlock(house) {
    console.log("it's too much :(");
    house.pop();
    // student.prefect = !student.prefect;
    document.querySelector(`#index${student.index}  #prefect `).textContent =
      "No";
  }
  function expellStudent() {
    // i add the expelled aprameter so that i can keep track of whether it's expelled
    student.expelled = true;
    expelledArray.push(student);
    // console.log(expelledArray);
    // console.log(filteredList);
    removeExpelled(student);
  }

  function removeExpelled(student) {
    delete allStudents[student.index - 1];
    console.log(filteredList);
    displayList(allStudents);
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
