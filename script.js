
const users = {
Admin:"admin123",
Farhad:"1234",
Rakim:"1234",
HadiandBatman:"1234",
Rizvi:"1234",
Mehedi:"1234",
Jahid:"1234"
};

const BREAKFAST_RATE = 20;
const LUNCH_RATE = 50;
const DINNER_RATE = 50;

let currentUser = "";

// Auto Login
window.onload = function(){

const savedUser = localStorage.getItem("loggedUser");

if(savedUser){

currentUser = savedUser;

document.getElementById("loginPage").classList.add("hidden");
document.getElementById("dashboard").classList.remove("hidden");

document.getElementById("welcome").innerText = "Welcome " + currentUser;

if(currentUser === "Admin"){
document.getElementById("mealBox").style.display = "none";
document.getElementById("tableTitle").innerText = "All Member Meal History";
}else{
document.getElementById("tableTitle").innerText = "Your Meal History";
}

loadMeals();

}

};

function login(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

if(users[username] === password){

currentUser = username;

localStorage.setItem("loggedUser", username);

document.getElementById("loginPage").classList.add("hidden");
document.getElementById("dashboard").classList.remove("hidden");

document.getElementById("welcome").innerText = "Welcome " + username;

if(username === "Admin"){
document.getElementById("mealBox").style.display = "none";
document.getElementById("tableTitle").innerText = "All Member Meal History";
}else{
document.getElementById("tableTitle").innerText = "Your Meal History";
}

loadMeals();

}else{
alert("Wrong Password");
}

}

async function saveMeal(){

const date = document.getElementById("mealDate").value;

if(date === ""){
alert("Select Date");
return;
}

const breakfast = parseInt(document.getElementById("breakfast").value);
const lunch = parseInt(document.getElementById("lunch").value);
const dinner = parseInt(document.getElementById("dinner").value);

const totalMeal = breakfast + lunch + dinner;

const totalCost =
(breakfast * BREAKFAST_RATE) +
(lunch * LUNCH_RATE) +
(dinner * DINNER_RATE);

await db.collection("meals").doc(currentUser + "_" + date).set({
user: currentUser,
date,
breakfast,
lunch,
dinner,
totalMeal,
totalCost
});

alert("Meal Saved!");

}

function loadMeals(){

db.collection("meals").onSnapshot((snapshot)=>{

const table = document.getElementById("tableBody");

table.innerHTML = "";

let totalBreakfast = 0;
let totalLunch = 0;
let totalDinner = 0;
let totalMeals = 0;
let totalCost = 0;

snapshot.forEach((doc)=>{

const item = doc.data();

if(currentUser !== "Admin" && item.user !== currentUser){
return;
}

totalBreakfast += item.breakfast;
totalLunch += item.lunch;
totalDinner += item.dinner;
totalMeals += item.totalMeal;
totalCost += item.totalCost;

table.innerHTML += `
<tr>
<td>${item.date}</td>
<td>${item.user}</td>
<td>${item.breakfast}</td>
<td>${item.lunch}</td>
<td>${item.dinner}</td>
<td>${item.totalMeal}</td>
<td>৳ ${item.totalCost}</td>
</tr>
`;

});

document.getElementById("totalBreakfast").innerText = totalBreakfast;
document.getElementById("totalLunch").innerText = totalLunch;
document.getElementById("totalDinner").innerText = totalDinner;
document.getElementById("totalMeals").innerText = totalMeals;
document.getElementById("totalCost").innerText = totalCost;

});

}

function logout(){

localStorage.removeItem("loggedUser");
location.reload();

}
