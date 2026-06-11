
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
const tomorrow = new Date();

tomorrow.setDate(tomorrow.getDate()+1);

const tomorrowDate =
tomorrow.toISOString().split("T")[0];

setTimeout(()=>{

if(document.getElementById("fromDate")){
document.getElementById("fromDate").value = tomorrowDate;
}

if(document.getElementById("toDate")){
document.getElementById("toDate").value = tomorrowDate;
}

},100);
if(savedUser){

currentUser = savedUser;

document.getElementById("loginPage").classList.add("hidden");
document.getElementById("dashboard").classList.remove("hidden");
setInterval(() => {

if(typeof loadNotice === "function"){
loadNotice();
}

}, 2000);

document.getElementById("welcome").innerText = "Welcome " + currentUser;

if(currentUser === "Admin"){
document.getElementById("mealBox").style.display = "none";
document.getElementById("tableTitle").innerText = "All Member মিলের হিসাব";

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
document.getElementById("tableTitle").innerText = "Your মিলের হিসাব";

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
loadMamaPaymentHistory();
loadDepositRequests();
loadFinancialSummary();

}

};

function login(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

if(users[username] === password){

currentUser = username;
    const paymentSelect = document.getElementById("paymentMember");

if(paymentSelect && username !== "Admin"){

paymentSelect.innerHTML =
`<option value="${username}">${username}</option>`;

}

localStorage.setItem("loggedUser", username);
setTimeout(() => {

const noticeBox = document.getElementById("noticeText");
if(noticeBox){
loadNotice();
}

const mamaBox = document.getElementById("mamaHistoryBox");
if(mamaBox){
loadMamaPaymentHistory();
}

},1000);

document.getElementById("loginPage").classList.add("hidden");
document.getElementById("dashboard").classList.remove("hidden");
setTimeout(async () => {

if(typeof loadNotice === "function"){
await loadNotice();
}

if(typeof loadMamaPaymentHistory === "function"){
await loadMamaPaymentHistory();
}

if(typeof loadNextDayMeals === "function"){
await loadNextDayMeals();
}

},1500);


document.getElementById("welcome").innerText = "Welcome " + username;

if(username === "Admin"){
document.getElementById("mealBox").style.display = "none";
document.getElementById("tableTitle").innerText = "All Member মিলের হিসাব";

if(document.querySelector(".member-cost-card")){
document.querySelector(".member-cost-card").style.display = "block";
}

}else{

document.getElementById("tableTitle").innerText = "Your মিলের হিসাব";

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
loadMamaPaymentHistory();
loadDepositRequests();
loadFinancialSummary();

}else{
alert("ভুল পাসওয়ার্ড");
}

}

async function saveMeal(){

const fromDate = document.getElementById("fromDate").value;
const toDate = document.getElementById("toDate").value;

const today = new Date().toISOString().split("T")[0];

if(currentUser !== "Admin"){

if(fromDate < today || toDate < today){

alert("Previous day meal cannot be changed!");

return;

}

}

if(fromDate === "" || toDate === ""){
alert("তারিখ নির্বাচন করুন");
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

const start = new Date(fromDate);
const end = new Date(toDate);

for(
let d = new Date(start);
d <= end;
d.setDate(d.getDate()+1)
){

const date = d.toISOString().split("T")[0];

await db.collection("meals")
.doc(currentUser + "_" + date)
.set({
user: currentUser,
date,
breakfast,
lunch,
dinner,
totalMeal,
totalCost
});

}

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
${currentUser === "Admin" ? `
<button onclick="deleteMeal('${doc.id}')" class="delete-btn">মুছুন</button>
<button onclick="editMeal('${doc.id}')" class="edit-btn">এডিট</button>
` : ""}
</td>
</tr>
`;

});


// ADMIN next-day stats only
if(currentUser === "Admin"){

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate()+1);

const nextDate = tomorrow.toISOString().split("T")[0];

let nextBreakfast = 0;
let nextLunch = 0;
let nextDinner = 0;

snapshot.forEach((doc)=>{

const item = doc.data();

if(item.date === nextDate){

nextBreakfast += Number(item.breakfast || 0);
nextLunch += Number(item.lunch || 0);
nextDinner += Number(item.dinner || 0);

}

});

document.getElementById("totalBreakfast").innerText = nextBreakfast;
document.getElementById("totalLunch").innerText = nextLunch;
document.getElementById("totalDinner").innerText = nextDinner;

// keep old totals
document.getElementById("totalMeals").innerText = totalMeals;
document.getElementById("totalCost").innerText = totalCost;

}else{

// MEMBER dashboard unchanged
document.getElementById("totalBreakfast").innerText = totalBreakfast;
document.getElementById("totalLunch").innerText = totalLunch;
document.getElementById("totalDinner").innerText = totalDinner;
document.getElementById("totalMeals").innerText = totalMeals;
document.getElementById("totalCost").innerText = totalCost;

}


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

const confirmমুছুন = confirm("মুছুন this meal?");

if(confirmমুছুন){

await db.collection("meals").doc(id).delete();

alert("Meal মুছুনd");

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

const mamaDate = document.getElementById("AliVaiDate").value;
const mamaAmount = parseInt(document.getElementById("AliVaiAmount").value);

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
loadMamaPaymentHistory();
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

document.getElementById("totalAliVaiPayment").innerText = totalMama;
document.getElementById("AliVaiMealCost").innerText = mealCost;
document.getElementById("remainingAliVaiBalance").innerText = totalMama - mealCost;

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
? `
<button onclick="acceptDeposit('${doc.id}')" class="accept-btn">গ্রহণ</button>
<button onclick="declineDeposit('${doc.id}')" class="decline-btn">বাতিল</button>
`
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

alert("Deposit গ্রহণed!");

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

box.innerText=`${time} সেকেন্ড পরে Confirm আসবে`;

clearIntervalId=setInterval(()=>{

time--;

box.innerText=`${time} সেকেন্ড পরে Confirm আসবে`;

if(time<=0){

clearInterval(clearIntervalId);

const finalConfirm = confirm("আপনি কি সত্যিই মাস ক্লিয়ার করবেন?");

if(finalConfirm){

clearAllMonthlyData();

}else{

box.innerText="মাস ক্লিয়ার বাতিল হয়েছে";

}

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

for(const docItem of snap.docs){

await db.collection("backup_"+col).doc(docItem.id).set(docItem.data());

await db.collection(col).doc(docItem.id).delete();

}

}

alert("সব হিসাব ক্লিয়ার হয়েছে এবং Backup Save হয়েছে");

location.reload();

}

async function restoreBackup(){

const ask = confirm("Backup Restore করবেন?");

if(!ask){
return;
}

const collections=["meals","payments","mamaPayments"];

for(const col of collections){

const snap=await db.collection("backup_"+col).get();

for(const docItem of snap.docs){

await db.collection(col).doc(docItem.id).set(docItem.data());

}

}

alert("Backup Restore Complete!");

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

const box=document.getElementById("AliVaiHistoryBox");

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
💰 টাকা: ৳ ${data.amount || 0}<br><br>

${currentUser === "Admin" ? `
<button onclick="editAliVaiPayment('${doc.id}')">✏️ এডিট</button>
<button onclick="deleteAliVaiPayment('${doc.id}')">🗑 মুছুন</button>
` : ""}

</div>

`;

});

}


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


async function editMeal(id){

if(currentUser !== "Admin"){
return;
}

const breakfast = prompt("সকাল");
const lunch = prompt("দুপুর");
const dinner = prompt("রাত");

await db.collection("meals").doc(id).update({
breakfast:Number(breakfast || 0),
lunch:Number(lunch || 0),
dinner:Number(dinner || 0),
totalMeal:Number(breakfast || 0)+Number(lunch || 0)+Number(dinner || 0),
totalCost:(Number(breakfast || 0)*20)+(Number(lunch || 0)*50)+(Number(dinner || 0)*50)
});

alert("Meal Updated");
location.reload();

}


// MEMBER PAYMENT DROPDOWN FIX
setTimeout(()=>{

const paymentSelect = document.getElementById("paymentMember");

if(paymentSelect && currentUser !== "Admin"){

paymentSelect.innerHTML = `<option value="${currentUser}">${currentUser}</option>`;

}

},500);



async function declineDeposit(id){

const confirmবাতিল = confirm("বাতিল this deposit request?");

if(!confirmবাতিল){
return;
}

await db.collection("payments").doc(id).delete();

alert("Deposit বাতিলd!");

loadDepositRequests();

}




async function editAliVaiPayment(id){

const docRef = await db.collection("mamaPayments").doc(id).get();

if(!docRef.exists) return;

const data = docRef.data();

const newDate = prompt("নতুন তারিখ", data.date || "");
const newAmount = prompt("নতুন টাকার পরিমাণ", data.amount || 0);

if(newDate===null || newAmount===null) return;

await db.collection("mamaPayments").doc(id).update({
date:newDate,
amount:Number(newAmount)
});

alert("পেমেন্ট আপডেট হয়েছে");
loadMamaPaymentHistory();
loadMamaPayments();

}

async function deleteAliVaiPayment(id){

const ok = confirm("এই পেমেন্ট মুছে ফেলবেন?");

if(!ok) return;

await db.collection("mamaPayments").doc(id).delete();

alert("পেমেন্ট মুছে ফেলা হয়েছে");
loadMamaPaymentHistory();
loadMamaPayments();

}



async function openMealFullscreen(){

const modal = document.getElementById("mealFullscreenModal");
const content = document.getElementById("mealFullscreenContent");

const snap = await db.collection("meals").get();

const users = [];
const mealMap = {};

snap.forEach((doc)=>{

const item = doc.data();

if(!users.includes(item.user)){
users.push(item.user);
}

const day = item.date.split("-")[2];

if(!mealMap[day]){
mealMap[day] = {};
}

mealMap[day][item.user] = {
b:item.breakfast || 0,
l:item.lunch || 0,
d:item.dinner || 0
};

});

users.sort();

let html = `
<div style="overflow:auto;width:100%;height:90vh">
<table border="1" style="border-collapse:collapse;width:max-content;min-width:100%;text-align:center;">
<thead>
<tr>
<th rowspan="2">তারিখ</th>
`;

users.forEach(user=>{
html += `<th colspan="3">${user}</th>`;
});
    html += `<th colspan="3">মোট</th>`;

html += `</tr><tr>`;

users.forEach(()=>{
html += `
<th>🌅</th>
<th>☀️</th>
<th>🌙</th>
`;
});
    html += `
<th>🌅</th>
<th>☀️</th>
<th>🌙</th>
`;

html += `</tr></thead><tbody>`;

for(let d=1; d<=31; d++){

const day = String(d).padStart(2,"0");

html += `<tr><td><b>${day}</b></td>`;
    

users.forEach(user=>{

const meal = mealMap[day]?.[user];

html += `
<td>${meal ? meal.b : ""}</td>
<td>${meal ? meal.l : ""}</td>
<td>${meal ? meal.d : ""}</td>
`;

});
    let dayB = 0;
let dayL = 0;
let dayD = 0;

users.forEach(user=>{

const meal = mealMap[day]?.[user];

if(meal){
dayB += Number(meal.b || 0);
dayL += Number(meal.l || 0);
dayD += Number(meal.d || 0);
}

});

html += `
<td><b>${dayB}</b></td>
<td><b>${dayL}</b></td>
<td><b>${dayD}</b></td>
`;

html += `</tr>`;
}
    html += `<tr style="background:#374151;color:white;font-weight:bold;">
<td>T</td>`;

users.forEach(user=>{

let totalB = 0;
let totalL = 0;
let totalD = 0;

for(let d=1; d<=31; d++){

const day = String(d).padStart(2,"0");
const meal = mealMap[day]?.[user];

if(meal){
totalB += Number(meal.b || 0);
totalL += Number(meal.l || 0);
totalD += Number(meal.d || 0);
}

}

html += `
<td>${totalB}</td>
<td>${totalL}</td>
<td>${totalD}</td>
`;

});
    let grandB = 0;
let grandL = 0;
let grandD = 0;

users.forEach(user=>{

for(let d=1; d<=31; d++){

const day = String(d).padStart(2,"0");
const meal = mealMap[day]?.[user];

if(meal){
grandB += Number(meal.b || 0);
grandL += Number(meal.l || 0);
grandD += Number(meal.d || 0);
}

}

});

html += `
<td><b>${grandB}</b></td>
<td><b>${grandL}</b></td>
<td><b>${grandD}</b></td>
`;

html += `</tr>`;
    html += `<tr style="background:#374151;color:#00ff88;font-weight:bold;">
<td>৳</td>`;

users.forEach(user=>{

let totalCost = 0;

for(let d=1; d<=31; d++){

const day = String(d).padStart(2,"0");
const meal = mealMap[day]?.[user];

if(meal){

totalCost +=
(Number(meal.b || 0) * 20) +
(Number(meal.l || 0) * 50) +
(Number(meal.d || 0) * 50);

}

}

html += `
<td colspan="3">৳ ${totalCost}</td>
`;

});
    let grandCost = 0;

users.forEach(user=>{

for(let d=1; d<=31; d++){

const day = String(d).padStart(2,"0");
const meal = mealMap[day]?.[user];

if(meal){

grandCost +=
(Number(meal.b || 0) * 20) +
(Number(meal.l || 0) * 50) +
(Number(meal.d || 0) * 50);

}

}

});

html += `
<td colspan="3"><b>৳ ${grandCost}</b></td>
`;

html += `</tr>`;
    html += `<tr style="background:#1f2937;color:#00e676;font-weight:bold;">
<td>জমা</td>`;

const paymentSnap = await db.collection("payments").get();

users.forEach(user=>{

let totalDeposit = 0;

paymentSnap.forEach(doc=>{

const pay = doc.data();

if(pay.user === user && pay.status === "accepted"){
totalDeposit += Number(pay.amount || 0);
}

});

html += `<td colspan="3">৳ ${totalDeposit}</td>`;

});

html += `<td colspan="3">-</td>`;
html += `</tr>`;
    html += `<tr style="background:#0f172a;color:#38bdf8;font-weight:bold;">
<td>ব্যালেন্স</td>`;

const paymentSnap2 = await db.collection("payments").get();

users.forEach(user=>{

let totalDeposit = 0;
let totalCost = 0;

paymentSnap2.forEach(doc=>{

const pay = doc.data();

if(pay.user === user && pay.status === "accepted"){
totalDeposit += Number(pay.amount || 0);
}

});

for(let d=1; d<=31; d++){

const day = String(d).padStart(2,"0");
const meal = mealMap[day]?.[user];

if(meal){

totalCost +=
(Number(meal.b || 0) * 20) +
(Number(meal.l || 0) * 50) +
(Number(meal.d || 0) * 50);

}

}

html += `<td colspan="3">৳ ${totalDeposit - totalCost}</td>`;

});

html += `<td colspan="3">-</td>`;
html += `</tr>`;

html += `</tbody></table></div>`;

content.innerHTML = html;
modal.style.display = "block";

}

function closeMealFullscreen(){
const modal=document.getElementById("mealFullscreenModal");
if(modal) modal.style.display="none";
}


async function openMonthlyMealSheet(){
alert("মাসিক মিল শিট ভিউ পরবর্তী আপডেটে যোগ করা হয়েছে।");
}
async function downloadMealSheetImage(){

const target = document.getElementById("mealFullscreenContent");

const canvas = await html2canvas(target,{scale:2});

const link = document.createElement("a");

link.download = "Meal-Sheet.png";
link.href = canvas.toDataURL("image/png");

link.click();

}

function printMealSheet(){

const content =
document.getElementById("mealFullscreenContent").innerHTML;

const printWindow =
window.open("","","width=1200,height=800");

printWindow.document.write(`
<html>
<head>
<title>Meal Sheet</title>
<style>
table{
border-collapse:collapse;
width:100%;
}
th,td{
border:1px solid black;
padding:4px;
text-align:center;
}
</style>
</head>
<body>
${content}
</body>
</html>
`);

printWindow.document.close();
printWindow.print();

}
