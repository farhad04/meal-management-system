
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

const memberCostCard = document.querySelector(".member-cost-card");
const memberCostList = document.getElementById("memberCostList");

if(memberCostCard){
memberCostCard.style.display = "block";
memberCostCard.style.visibility = "visible";
}

if(memberCostList){
memberCostList.style.display = "block";
memberCostList.style.visibility = "visible";
memberCostList.classList.remove("hidden");
}
}else{
document.getElementById("tableTitle").innerText = "Your Meal History";

const memberCostCard = document.querySelector(".member-cost-card");
const memberCostList = document.getElementById("memberCostList");

if(memberCostCard){
memberCostCard.style.display = "none";
memberCostCard.style.visibility = "hidden";
}

if(memberCostList){
memberCostList.style.display = "none";
memberCostList.style.visibility = "hidden";
}
}

loadMeals();
loadPayments();
loadMamaPayments();
loadDepositRequests();
loadFinancialSummary();

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

if(document.querySelector(".member-cost-card")){
document.querySelector(".member-cost-card").style.display = "block";
}

}else{

document.getElementById("tableTitle").innerText = "Your Meal History";

if(document.querySelector(".member-cost-card")){
document.querySelector(".member-cost-card").style.display = "none";
}

if(document.getElementById("memberCostList")){
document.getElementById("memberCostList").style.display = "none";
}

}

loadMeals();
loadPayments();
loadMamaPayments();
loadDepositRequests();
loadFinancialSummary();

}else{
alert("Wrong Password");
}

}

async function saveMeal(){

const date = document.getElementById("mealDate").value;

const today = new Date().toISOString().split("T")[0];

if(currentUser !== "Admin" && date < today){

alert("Previous day meal cannot be changed!");

return;

}

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

loadFinancialSummary();

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

const memberTotals = {};

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

if(!memberTotals[item.user]){
memberTotals[item.user] = 0;
}

memberTotals[item.user] += item.totalCost;

table.innerHTML += `
<tr>
<td>${item.date}</td>
<td>${item.user}</td>
<td>${item.breakfast}</td>
<td>${item.lunch}</td>
<td>${item.dinner}</td>
<td>${item.totalMeal}</td>
<td>৳ ${item.totalCost}</td>
<td>
${currentUser === "Admin" ? `<button onclick="deleteMeal('${doc.id}')" class="delete-btn">Delete</button>` : ""}
</td>
</tr>
`;

});

document.getElementById("totalBreakfast").innerText = totalBreakfast;
document.getElementById("totalLunch").innerText = totalLunch;
document.getElementById("totalDinner").innerText = totalDinner;
document.getElementById("totalMeals").innerText = totalMeals;
document.getElementById("totalCost").innerText = totalCost;

if(currentUser === "Admin"){

let memberHtml = "";

Object.keys(memberTotals).forEach(member=>{

memberHtml += `
<div class="member-item">
<span>${member}</span>
<span>৳ ${memberTotals[member]}</span>
</div>
`;

});

document.getElementById("memberCostList").innerHTML = memberHtml;
document.getElementById("grandTotalCost").innerText = totalCost;

}

});

}

async function deleteMeal(id){

const confirmDelete = confirm("Delete this meal?");

if(confirmDelete){

await db.collection("meals").doc(id).delete();

alert("Meal Deleted");

loadFinancialSummary();

}

}

function toggleMemberCosts(){

const box = document.getElementById("memberCostList");

box.classList.toggle("hidden");

}

function logout(){

localStorage.removeItem("loggedUser");
location.reload();

}


async function savePayment(){

const paymentDate = document.getElementById("paymentDate").value;
const paymentAmount = parseInt(document.getElementById("paymentAmount").value);

if(paymentDate === "" || !paymentAmount){
alert("Enter payment info");
return;
}

const selectedMember = currentUser === "Admin"
? document.getElementById("paymentMember").value
: currentUser;

await db.collection("payments").add({
user: selectedMember,
date: paymentDate,
amount: paymentAmount,
status:"pending"
});

alert("Payment Saved!");

}

async function loadPayments(){

const snapshot = await db.collection("payments").get();

let totalDeposit = 0;

snapshot.forEach((doc)=>{

const item = doc.data();

if(currentUser !== "Admin" && item.user !== currentUser){
return;
}

if(item.status === "accepted"){
totalDeposit += item.amount;
}

});

const usedCost = parseInt(document.getElementById("totalCost").innerText) || 0;

document.getElementById("totalDeposit").innerText = totalDeposit;

document.getElementById("usedCost").innerText = usedCost;

document.getElementById("currentBalance").innerText = totalDeposit - usedCost;

}


async function saveMamaPayment(){

const mamaDate = document.getElementById("mamaDate").value;
const mamaAmount = parseInt(document.getElementById("mamaAmount").value);

if(currentUser !== "Admin"){
return;
}

if(mamaDate === "" || !mamaAmount){
alert("Enter mama payment info");
return;
}

await db.collection("mamaPayments").add({
date:mamaDate,
amount:mamaAmount
});

alert("Mama Payment Saved!");

loadMamaPayments();
loadDepositRequests();
loadFinancialSummary();

}

async function loadMamaPayments(){

if(currentUser !== "Admin"){

if(document.getElementById("mamaPaymentBox")){
document.getElementById("mamaPaymentBox").style.display="none";
}

return;
}

const snapshot = await db.collection("mamaPayments").get();

let totalMama = 0;

snapshot.forEach((doc)=>{

const item = doc.data();

totalMama += item.amount;

});

const mealCost = parseInt(document.getElementById("totalCost").innerText) || 0;

document.getElementById("totalMamaPayment").innerText = totalMama;
document.getElementById("mamaMealCost").innerText = mealCost;
document.getElementById("remainingMamaBalance").innerText = totalMama - mealCost;

}


async function loadDepositRequests(){

const panel = document.getElementById("adminDepositPanel");

if(currentUser !== "Admin"){

if(panel){
panel.style.display = "none";
}

return;
}

if(panel){
panel.style.display = "block";
}

const table = document.getElementById("depositTableBody");

table.innerHTML = "";

const snapshot = await db.collection("payments").get();

snapshot.forEach((doc)=>{

const item = doc.data();

table.innerHTML += `
<tr>
<td>${item.user}</td>
<td>${item.date}</td>
<td>৳ ${item.amount}</td>
<td class="${item.status === "accepted" ? "accepted" : "pending"}">
${item.status}
</td>
<td>
${item.status !== "accepted"
? `<button onclick="acceptDeposit('${doc.id}')" class="accept-btn">Accept</button>`
: "Done"}
</td>
</tr>
`;

});

}

async function acceptDeposit(id){

await db.collection("payments").doc(id).update({
status:"accepted"
});

alert("Deposit Accepted!");

loadFinancialSummary();

loadDepositRequests();
loadFinancialSummary();

}


async function loadFinancialSummary(){

if(currentUser !== "Admin"){
return;
}

const memberCostList = document.getElementById("memberCostList");

const paymentsSnapshot = await db.collection("payments").get();
const mealsSnapshot = await db.collection("meals").get();

const deposits = {};
const costs = {};

paymentsSnapshot.forEach((doc)=>{

const item = doc.data();

if(item.status === "accepted"){

if(!deposits[item.user]){
deposits[item.user] = 0;
}

deposits[item.user] += item.amount;

}

});

mealsSnapshot.forEach((doc)=>{

const item = doc.data();

if(!costs[item.user]){
costs[item.user] = 0;
}

costs[item.user] += item.totalCost;

});

let html = "";

const users = new Set([
...Object.keys(deposits),
...Object.keys(costs)
]);

users.forEach((user)=>{

const deposit = deposits[user] || 0;
const cost = costs[user] || 0;
const balance = deposit - cost;

html += `
<div class="member-item">
<div>
<strong>${user}</strong><br>
Deposit: ৳ ${deposit}<br>
Meal Cost: ৳ ${cost}<br>
Balance: ৳ ${balance}
</div>
</div>
`;

});

memberCostList.innerHTML = html;

}


function toggleNotice(){

const p=document.getElementById("noticePopup");

if(p.style.display==="block"){
p.style.display="none";
}else{
p.style.display="block";
loadNotice();
}

}

async function saveNotice(){

const txt=document.getElementById("noticeInput").value;

await db.collection("system").doc("notice").set({
text:txt
});

alert("নোটিশ সেভ হয়েছে");

}

async function loadNotice(){

const doc=await db.collection("system").doc("notice").get();

if(doc.exists){
document.getElementById("noticeText").innerText=doc.data().text;
}

}

let clearIntervalId;

function startClear(){

let time=10;

document.getElementById("cancelClearBtn").style.display="block";

const box=document.getElementById("countdownBox");

box.innerText=`${time} সেকেন্ড পরে সব হিসাব ক্লিয়ার হবে`;

clearIntervalId=setInterval(()=>{

time--;

box.innerText=`${time} সেকেন্ড পরে সব হিসাব ক্লিয়ার হবে`;

if(time<=0){

clearInterval(clearIntervalId);

clearAllMonthlyData();

}

},1000);

}

function cancelClear(){

clearInterval(clearIntervalId);

document.getElementById("countdownBox").innerText="ক্লিয়ার বাতিল করা হয়েছে";

document.getElementById("cancelClearBtn").style.display="none";

}

async function clearAllMonthlyData(){

const collections=["meals","payments","mamaPayments"];

for(const col of collections){

const snap=await db.collection(col).get();

snap.forEach(async(doc)=>{

await db.collection(col).doc(doc.id).delete();

});

}

alert("সব হিসাব ক্লিয়ার হয়েছে");

location.reload();

}


setTimeout(()=>{

if(typeof currentUser !== "undefined" && currentUser==="Admin"){

const panel=document.getElementById("adminPanelTools");

if(panel){
panel.style.display="block";
}

}

},1000);


async function loadMamaPaymentHistory(){

const box=document.getElementById("mamaHistoryBox");

if(!box) return;

box.innerHTML="";

const snap=await db.collection("mamaPayments")
.orderBy("date","desc")
.get();

snap.forEach((doc)=>{

const data=doc.data();

box.innerHTML += `

<div class="mama-history-item">
📅 তারিখ: ${data.date || "N/A"}<br>
💰 টাকা: ৳ ${data.amount || 0}
</div>

`;

});

}

setTimeout(()=>{

if(typeof currentUser !== "undefined" && currentUser==="Admin"){

loadMamaPaymentHistory();

}

},1500);


function toggleNextMeals(){

const popup=document.getElementById("nextMealPopup");

if(popup.style.display==="block"){
popup.style.display="none";
}else{
popup.style.display="block";
loadNextDayMeals();
}

}

async function loadNextDayMeals(){

const list=document.getElementById("nextMealList");

list.innerHTML="";

const tomorrow=new Date();

tomorrow.setDate(tomorrow.getDate()+1);

const nextDate=tomorrow.toISOString().split("T")[0];

const snap=await db.collection("meals")
.where("date","==",nextDate)
.get();

if(snap.empty){

list.innerHTML='<div class="nextMealItem">কোনো মিল এন্ট্রি নেই</div>';

return;

}

snap.forEach((doc)=>{

const data=doc.data();

list.innerHTML += `

<div class="nextMealItem">
👤 ${data.user}<br>
🌅 সকাল: ${data.breakfast || 0}<br>
☀️ দুপুর: ${data.lunch || 0}<br>
🌙 রাত: ${data.dinner || 0}<br>
📅 ${data.date}
</div>

`;

});

}
