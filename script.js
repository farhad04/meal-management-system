
const users = {
Admin:"admin123",
Farhad:"1234",
Rakim:"1234",
Hadi:"1234",
Rizvi:"1234",
Mehedi:"1234",
Shafi:"1234"
};

const BREAKFAST_RATE = 20;
const LUNCH_RATE = 50;
const DINNER_RATE = 50;

let currentUser = "";

if(!localStorage.getItem("mealDropdownHistory")){
localStorage.setItem("mealDropdownHistory", JSON.stringify([]));
}

function login(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

if(users[username] === password){

currentUser = username;

document.getElementById("loginPage").classList.add("hidden");
document.getElementById("dashboard").classList.remove("hidden");

document.getElementById("welcome").innerText = "Welcome " + username;

if(username === "Admin"){
document.getElementById("mealBox").style.display = "none";
document.getElementById("tableTitle").innerText = "All Member Meal History";
}else{
document.getElementById("tableTitle").innerText = "Your Meal History";
}

renderTable();

}else{
alert("Wrong Password");
}
}

function saveMeal(){

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

const data = JSON.parse(localStorage.getItem("mealDropdownHistory"));

const existing = data.find(item => item.user === currentUser && item.date === date);

if(existing){

existing.breakfast = breakfast;
existing.lunch = lunch;
existing.dinner = dinner;
existing.totalMeal = totalMeal;
existing.totalCost = totalCost;

}else{

data.push({
user: currentUser,
date,
breakfast,
lunch,
dinner,
totalMeal,
totalCost
});

}

localStorage.setItem("mealDropdownHistory", JSON.stringify(data));

renderTable();

alert("Meal Saved!");

}

function renderTable(){

const data = JSON.parse(localStorage.getItem("mealDropdownHistory"));

const table = document.getElementById("tableBody");

table.innerHTML = "";

let totalBreakfast = 0;
let totalLunch = 0;
let totalDinner = 0;
let totalMeals = 0;
let totalCost = 0;

let filteredData = [];

if(currentUser === "Admin"){
filteredData = data;
}else{
filteredData = data.filter(item => item.user === currentUser);
}

filteredData.sort((a,b)=> new Date(b.date)-new Date(a.date));

filteredData.forEach(item=>{

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

}

function logout(){
location.reload();
}
