
const users = {
  Admin:"admin123"
};
// ==============================
// MEMBER MANAGEMENT SYSTEM
// ==============================

const defaultMembers = {
  Farhad:"1234",
  Rakim:"1234",
  HadiandBatman:"1234",
  Rizvi:"1234",
  Rabby:"1234",
  Jahid:"1234"
};


// প্রথমবার Members collection তৈরি
async function initializeMembers(){

  const snap =
    await db.collection("members").limit(1).get();

  // যদি আগে থেকেই member থাকে তাহলে কিছু করবে না
  if(!snap.empty){
    return;
  }


  for(const name in defaultMembers){

    await db.collection("members")
      .doc(name)
      .set({
        name:name,
        password:defaultMembers[name],
        createdAt:Date.now()
      });

  }

}


// সব Member load
async function loadMembers(){

  await initializeMembers();


  const snap =
    await db.collection("members").get();


  const loginSelect =
    document.getElementById("username");

  const paymentSelect =
    document.getElementById("paymentMember");


  // Login list
  if(loginSelect){

    loginSelect.innerHTML =
      `<option value="">Select Account</option>
       <option value="Admin">Admin</option>`;


    snap.forEach((doc)=>{

      const data = doc.data();

      loginSelect.innerHTML +=
        `<option value="${data.name}">
          ${data.name}
        </option>`;

    });

  }


  // Payment list
  if(paymentSelect){

  paymentSelect.innerHTML = "";

  if(currentUser === "Admin"){

    snap.forEach((doc)=>{
      const data = doc.data();

      paymentSelect.innerHTML +=
        `<option value="${data.name}">
          ${data.name}
        </option>`;
    });

  }else if(currentUser !== ""){

    paymentSelect.innerHTML =
      `<option value="${currentUser}">
        ${currentUser}
      </option>`;

  }

}


  // Admin Member Management list
  loadMemberManagementList();

}


// Admin Member List
async function loadMemberManagementList(){

  const box =
    document.getElementById("memberManagementList");


  if(!box){
    return;
  }


  if(currentUser !== "Admin"){

    box.innerHTML = "";

    return;

  }


  const snap =
    await db.collection("members").get();


  box.innerHTML = "";


  snap.forEach((doc)=>{

    const data = doc.data();


    box.innerHTML += `

      <div
        style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:10px;
        margin-bottom:8px;
        border:1px solid #ddd;
        border-radius:8px;
        "
      >

        <div>
          👤 <strong>${data.name}</strong>
        </div>


        <button
          onclick="deleteMember('${doc.id}')"
          style="
          background:#dc2626;
          color:white;
          border:none;
          padding:7px 12px;
          border-radius:6px;
          "
        >
          🗑 Delete
        </button>

      </div>

    `;

  });

}


// নতুন Member Add
async function addMember(){

  if(currentUser !== "Admin"){

    alert("শুধু Admin Member Add করতে পারবে!");

    return;

  }


  const name =
    document.getElementById("newMemberName")
      .value.trim();


  const password =
    document.getElementById("newMemberPassword")
      .value.trim();


  if(name === "" || password === ""){

    alert("Member name এবং password দিন!");

    return;

  }


  if(name === "Admin"){

    alert("Admin নামে Member তৈরি করা যাবে না!");

    return;

  }


  const existing =
    await db.collection("members")
      .doc(name)
      .get();


  if(existing.exists){

    alert("এই Member আগে থেকেই আছে!");

    return;

  }


  await db.collection("members")
    .doc(name)
    .set({

      name:name,

      password:password,

      createdAt:Date.now()

    });


  alert(
    name + " সফলভাবে Add হয়েছে!"
  );


  document.getElementById("newMemberName")
    .value = "";


  document.getElementById("newMemberPassword")
    .value = "";


  await loadMembers();

}


// Member Delete
async function deleteMember(id){

  if(currentUser !== "Admin"){

    alert("শুধু Admin Member Delete করতে পারবে!");

    return;

  }


  const docRef =
    await db.collection("members")
      .doc(id)
      .get();


  if(!docRef.exists){
    return;
  }


  const data =
    docRef.data();


  const confirmDelete =
    confirm(
      data.name +
      " Member-কে Delete করবেন?"
    );


  if(!confirmDelete){
    return;
  }


  await db.collection("members")
    .doc(id)
    .delete();


  alert(
    data.name +
    " Member Delete হয়েছে!"
  );


  await loadMembers();

}

const BREAKFAST_RATE = 20;
const LUNCH_RATE = 50;
const DINNER_RATE = 50;

let currentUser = "";

window.onload = function(){

    loadMembers();

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
function toggleMemberManagement(){

  const box =
    document.getElementById("memberManagementBox");

  if(box.style.display === "none"){

    box.style.display = "block";

    loadMemberManagementList();

  }else{

    box.style.display = "none";

  }

}

async function login(){

  const username =
    document.getElementById("username").value;

  const password =
    document.getElementById("password").value;


  if(username === ""){

    alert("Account নির্বাচন করুন");

    return;

  }


  // Admin login
  if(
    username === "Admin" &&
    password === "admin123"
  ){

    currentUser = "Admin";

  }

  else{

    const memberRef =
      await db.collection("members")
        .doc(username)
        .get();


    if(
      !memberRef.exists ||
      memberRef.data().password !== password
    ){

      alert("ভুল পাসওয়ার্ড");

      return;

    }


    currentUser = username;

  }


  localStorage.setItem(
    "loggedUser",
    currentUser
  );


  // Payment dropdown
  const paymentSelect =
    document.getElementById("paymentMember");


  if(
    paymentSelect &&
    currentUser !== "Admin"
  ){

    paymentSelect.innerHTML =
      `<option value="${currentUser}">
        ${currentUser}
      </option>`;

  }


  document.getElementById("loginPage")
    .classList.add("hidden");


  document.getElementById("dashboard")
    .classList.remove("hidden");


  document.getElementById("welcome")
    .innerText =
      "Welcome " + currentUser;


  if(currentUser === "Admin"){

    document.getElementById("mealBox")
      .style.display = "none";

    document.getElementById("tableTitle")
      .innerText =
        "All Member মিলের হিসাব";


    if(document.querySelector(".member-cost-card")){

      document.querySelector(
        ".member-cost-card"
      ).style.display = "block";

    }


    if(document.getElementById("memberCostList")){

      document.getElementById(
        "memberCostList"
      ).style.display = "block";

    }

  }

  else{

    document.getElementById("tableTitle")
      .innerText =
        "Your মিলের হিসাব";


    if(document.querySelector(".member-cost-card")){

      document.querySelector(
        ".member-cost-card"
      ).style.display = "none";

    }


    if(document.getElementById("memberCostList")){

      document.getElementById(
        "memberCostList"
      ).style.display = "none";

    }

  }


  loadMeals();
  loadPayments();
  loadMamaPayments();
  loadMamaPaymentHistory();
  loadDepositRequests();
  loadFinancialSummary();

}

async function saveMeal(){

  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;

  if(fromDate === "" || toDate === ""){
    alert("তারিখ নির্বাচন করুন");
    return;
  }

  // আজকের তারিখ
  const today = new Date();

  const todayStr =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");


  // Member হলে আগের দিনের meal দেওয়া/পরিবর্তন করা যাবে না
  if(currentUser !== "Admin"){

    if(fromDate < todayStr || toDate < todayStr){

      alert("Previous day meal cannot be changed!");
      return;

    }

  }


  const breakfast =
    parseInt(document.getElementById("breakfast").value) || 0;

  const lunch =
    parseInt(document.getElementById("lunch").value) || 0;

  const dinner =
    parseInt(document.getElementById("dinner").value) || 0;


  const totalMeal =
    breakfast + lunch + dinner;


  const totalCost =
    (breakfast * BREAKFAST_RATE) +
    (lunch * LUNCH_RATE) +
    (dinner * DINNER_RATE);


  const start =
    new Date(fromDate + "T00:00:00");

  const end =
    new Date(toDate + "T00:00:00");


  // একাধিক দিনের জন্য
  for(
    let d = new Date(start);
    d <= end;
    d.setDate(d.getDate() + 1)
  ){

    const date =
      d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");


    // ==============================
    // MEMBER MEAL TIME LIMIT
    // ==============================

    if(currentUser !== "Admin"){

      // আগের দিনের meal একদম পরিবর্তন করা যাবে না
      if(date < todayStr){

        alert(
          date +
          " তারিখের meal পরিবর্তনের সময় শেষ!"
        );

        return;

      }


      // আজকের meal হলে সকাল ৯টার পর আর পরিবর্তন করা যাবে না
      if(date === todayStr){

        const now = new Date();

        const lockTime =
          new Date(date + "T12:00:00");


        if(now >= lockTime){

          alert(
            date +
            " তারিখের meal পরিবর্তনের সময় সকাল ৯টায় শেষ হয়েছে!"
          );

          return;

        }

      }

    }


    const mealRef =
      db.collection("meals")
        .doc(currentUser + "_" + date);


    const existingMeal =
      await mealRef.get();


    // আগে থেকে meal থাকলে তার createdAt রেখে দেওয়া হবে
    let createdTime = Date.now();


    if(existingMeal.exists){

      const oldData =
        existingMeal.data();


      if(oldData.createdAt){

        createdTime =
          Number(oldData.createdAt);

      }

    }


    await mealRef.set({

      user: currentUser,

      date: date,

      breakfast: breakfast,

      lunch: lunch,

      dinner: dinner,

      totalMeal: totalMeal,

      totalCost: totalCost,

      createdAt: createdTime,

      updatedAt: Date.now()

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

  const memberCostList =
    document.getElementById("memberCostList");

  const paymentsSnapshot =
    await db.collection("payments").get();

  const mealsSnapshot =
    await db.collection("meals").get();

  const membersSnapshot =
    await db.collection("members").get();


  const deposits = {};
  const costs = {};
  const openingBalances = {};


  /* =========================
     MEMBER OPENING BALANCE
  ========================= */

  membersSnapshot.forEach((doc)=>{

    const item = doc.data();

    openingBalances[item.name] =
      Number(item.openingBalance || 0);

  });


  /* =========================
     DEPOSIT
  ========================= */

  paymentsSnapshot.forEach((doc)=>{

    const item = doc.data();

    if(item.status === "accepted"){

      if(!deposits[item.user]){
        deposits[item.user] = 0;
      }

      deposits[item.user] +=
        Number(item.amount || 0);

    }

  });


  /* =========================
     MEAL COST
  ========================= */

  mealsSnapshot.forEach((doc)=>{

    const item = doc.data();

    if(!costs[item.user]){
      costs[item.user] = 0;
    }

    costs[item.user] +=
      Number(item.totalCost || 0);

  });


  /* =========================
     USERS
  ========================= */

  const users = new Set([
    ...Object.keys(deposits),
    ...Object.keys(costs),
    ...Object.keys(openingBalances)
  ]);


  let html = "";


  users.forEach((user)=>{

    const opening =
      openingBalances[user] || 0;

    const deposit =
      deposits[user] || 0;

    const cost =
      costs[user] || 0;


    /*
      নতুন Balance:

      আগের মাসের Balance
      + নতুন Deposit
      - নতুন Meal Cost
    */

    const balance =
      opening + deposit - cost;


    html += `
      <div class="member-item">

        <div>

          <strong>${user}</strong><br>

          Previous Balance:
          ৳ ${opening}<br>

          Deposit:
          ৳ ${deposit}<br>

          Meal Cost:
          ৳ ${cost}<br>

          <strong>
            Balance:
            ৳ ${balance}
          </strong>

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

  if(currentUser !== "Admin"){
    alert("শুধু Admin মাসের হিসাব ক্লিয়ার করতে পারবে!");
    return;
  }

  const collections = [
    "meals",
    "payments",
    "mamaPayments"
  ];

  const now = new Date();

  const year = now.getFullYear();

  const month =
    String(now.getMonth() + 1).padStart(2,"0");

  const monthKey =
    year + "-" + month;


  /* =========================
     CREATE ARCHIVE
  ========================= */

  await db.collection("monthlyArchives")
    .doc(monthKey)
    .set({
      month: monthKey,
      createdAt: new Date().toISOString()
    });


  /* =========================
     ARCHIVE CURRENT MONTH
  ========================= */

  for(const col of collections){

    const snap =
      await db.collection(col).get();

    for(const docItem of snap.docs){

      const data =
        docItem.data();

      if(
        data.date &&
        typeof data.date === "string" &&
        data.date.startsWith(monthKey)
      ){

        await db.collection("monthlyArchives")
          .doc(monthKey)
          .collection(col)
          .doc(docItem.id)
          .set(data);

        await db.collection(col)
          .doc(docItem.id)
          .delete();
      }

    }

  }


  /* =========================
     CALCULATE FINAL BALANCE
     BEFORE STARTING NEW MONTH
  ========================= */

  const archiveMealSnap =
    await db.collection("monthlyArchives")
      .doc(monthKey)
      .collection("meals")
      .get();

  const archivePaymentSnap =
    await db.collection("monthlyArchives")
      .doc(monthKey)
      .collection("payments")
      .get();


  const memberData = {};


  /* =========================
     MEAL COST
  ========================= */

  archiveMealSnap.forEach((doc)=>{

    const data =
      doc.data();

    if(!data.user){
      return;
    }

    if(!memberData[data.user]){
      memberData[data.user] = {
        deposit: 0,
        mealCost: 0
      };
    }

    memberData[data.user].mealCost +=
      Number(data.totalCost || 0);

  });


  /* =========================
     ACCEPTED DEPOSIT
  ========================= */

  archivePaymentSnap.forEach((doc)=>{

    const data =
      doc.data();

    if(
      data.user &&
      data.status === "accepted"
    ){

      if(!memberData[data.user]){
        memberData[data.user] = {
          deposit: 0,
          mealCost: 0
        };
      }

      memberData[data.user].deposit +=
        Number(data.amount || 0);

    }

  });


  /* =========================
     SAVE OPENING BALANCE
  ========================= */

  for(const user in memberData){

    const deposit =
      memberData[user].deposit;

    const mealCost =
      memberData[user].mealCost;

    const balance =
      deposit - mealCost;


    await db.collection("members")
      .doc(user)
      .set({

        openingBalance: balance,

        openingBalanceMonth: monthKey

      },{

        merge: true

      });

  }


  /* =========================
     KEEP ONLY 6 ARCHIVES
  ========================= */

  const archiveSnap =
    await db.collection("monthlyArchives")
      .orderBy("month","desc")
      .get();


  const archiveMonths =
    archiveSnap.docs;


  for(
    let i = 6;
    i < archiveMonths.length;
    i++
  ){

    const oldMonth =
      archiveMonths[i].id;

    const oldArchiveRef =
      db.collection("monthlyArchives")
        .doc(oldMonth);


    const subCollections = [
      "meals",
      "payments",
      "mamaPayments"
    ];


    for(const subCol of subCollections){

      const oldSnap =
        await oldArchiveRef
          .collection(subCol)
          .get();


      for(const oldDoc of oldSnap.docs){

        await oldArchiveRef
          .collection(subCol)
          .doc(oldDoc.id)
          .delete();

      }

    }

    await oldArchiveRef.delete();

  }


  alert(
    "এই মাসের হিসাব Archive হয়েছে।\n\n" +
    "আগের মাসের Balance পরের মাসে চলে যাবে।"
  );

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

<div style="
display:flex;
justify-content:space-between;
align-items:center;
gap:8px;
">

<div>
📅 তারিখ: ${data.date || "N/A"}
</div>

${currentUser === "Admin" ? `
<div style="
display:flex;
gap:5px;
flex-shrink:0;
">

<button
onclick="editAliVaiPayment('${doc.id}')"
style="
width:auto;
padding:5px 9px;
font-size:12px;
border:none;
border-radius:6px;
"
>
✏️
</button>

<button
onclick="deleteAliVaiPayment('${doc.id}')"
style="
width:auto;
padding:5px 9px;
font-size:12px;
border:none;
border-radius:6px;
"
>
🗑️
</button>

</div>
` : ""}

</div>

<div style="margin-top:8px;">
💰 টাকা: ৳ ${data.amount || 0}
</div>

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
const messaging = firebase.messaging();

async function enableNotification() {

const permission = await Notification.requestPermission();

if(permission === "granted") {

const token = await messaging.getToken({
vapidKey: "BJD_AlGwhbfdqfgMJAi1wtETt5XAC_ab5Pz2cMx1Y8Y0tAPuN-pgW0250ab4xjMkGrEFlfHpazgZLxWEw4sURLw"
});
db.collection("fcmTokens").doc(currentUser).set({
    token: token,
    user: currentUser,
    updatedAt: new Date().toISOString()
});

console.log("FCM Token:", token);

}

}

enableNotification();
async function loadMonthlyArchives(){

  const box =
    document.getElementById("monthlyArchiveList");

  if(!box){
    return;
  }

  box.innerHTML = "লোড হচ্ছে...";

  const snap =
    await db.collection("monthlyArchives")
      .orderBy("month","desc")
      .get();

  if(snap.empty){

    box.innerHTML =
      "<div>কোনো পুরোনো মাসের হিসাব নেই</div>";

    return;
  }

  box.innerHTML = "";

  snap.forEach((doc)=>{

    const data = doc.data();

    const month = data.month;

    box.innerHTML += `

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:10px;
          margin-bottom:8px;
          background:#f5f5f5;
          border-radius:8px;
        "
      >

        <strong>
          📅 ${month}
        </strong>

        <button
          onclick="openArchivedMonth('${month}')"
          style="
            width:auto;
            padding:6px 10px;
            font-size:12px;
          "
        >
          📊 Full Screen
        </button>

      </div>

    `;

  });

}

async function openArchivedMonth(monthKey){

  const modal =
    document.getElementById("mealFullscreenModal");

  const content =
    document.getElementById("mealFullscreenContent");

  if(!modal || !content){
    return;
  }

  content.innerHTML =
    "<div style='padding:20px;text-align:center;'>লোড হচ্ছে...</div>";

  modal.style.display = "block";

  /* =========================
     ARCHIVED MEALS
  ========================= */

  const mealSnap =
    await db.collection("monthlyArchives")
      .doc(monthKey)
      .collection("meals")
      .get();

  const meals = {};
  const users = new Set();

  mealSnap.forEach((doc)=>{
    const item = doc.data();

    if(!item.date || !item.user){
      return;
    }

    const day =
      parseInt(item.date.split("-")[2]);

    if(!meals[day]){
      meals[day] = {};
    }

    meals[day][item.user] = {
      b: Number(item.breakfast || 0),
      l: Number(item.lunch || 0),
      d: Number(item.dinner || 0)
    };

    users.add(item.user);
  });


  /* =========================
     ARCHIVED MEMBER PAYMENTS
  ========================= */

  const paymentSnap =
    await db.collection("monthlyArchives")
      .doc(monthKey)
      .collection("payments")
      .get();

  const deposits = {};

  paymentSnap.forEach((doc)=>{
    const item = doc.data();

    if(item.status === "accepted" && item.user){

      if(!deposits[item.user]){
        deposits[item.user] = 0;
      }

      deposits[item.user] +=
        Number(item.amount || 0);

      users.add(item.user);
    }
  });


  /* =========================
     ARCHIVED ALI VAI PAYMENTS
  ========================= */

  const mamaSnap =
    await db.collection("monthlyArchives")
      .doc(monthKey)
      .collection("mamaPayments")
      .get();

  const mamaPayments = [];

  let totalMamaPayment = 0;

  mamaSnap.forEach((doc)=>{
    const item = doc.data();

    const amount =
      Number(item.amount || 0);

    totalMamaPayment += amount;

    mamaPayments.push({
      date: item.date || "N/A",
      amount: amount
    });
  });

  /* তারিখ অনুযায়ী সাজানো */
  mamaPayments.sort((a,b)=>{
    return String(a.date).localeCompare(
      String(b.date)
    );
  });


  /* =========================
     USERS
  ========================= */

  const userList =
    Array.from(users).sort();


  /* =========================
     MONTH DAYS
  ========================= */

  const year =
    parseInt(monthKey.split("-")[0]);

  const month =
    parseInt(monthKey.split("-")[1]);

  const daysInMonth =
    new Date(year, month, 0).getDate();


  /* =========================
     TABLE START
  ========================= */

  let html = `

  <div style="overflow:auto;width:100%;height:90vh">

  <h2 style="text-align:center;margin:10px;">
    📊 ${monthKey} Meal Sheet
  </h2>

  <table border="1"
    style="
      border-collapse:collapse;
      width:max-content;
      min-width:100%;
      text-align:center;
    ">

  <thead>

  <tr>
    <th rowspan="2">তারিখ</th>
  `;


  userList.forEach((user)=>{
    html += `
      <th colspan="3">${user}</th>
    `;
  });


  html += `
    <th colspan="3">মোট</th>
  </tr>

  <tr>
  `;


  userList.forEach(()=>{
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
  </tr>

  </thead>

  <tbody>
  `;


  /* =========================
     DAILY MEALS
  ========================= */

  for(let d=1; d<=daysInMonth; d++){

    const day =
      String(d).padStart(2,"0");

    html += `
      <tr>
        <td><b>${day}</b></td>
    `;

    let dayB = 0;
    let dayL = 0;
    let dayD = 0;


    userList.forEach((user)=>{

      const meal =
        meals[d]?.[user];

      if(meal){

        dayB += meal.b;
        dayL += meal.l;
        dayD += meal.d;

      }


      html += `
        <td>${meal ? meal.b : ""}</td>
        <td>${meal ? meal.l : ""}</td>
        <td>${meal ? meal.d : ""}</td>
      `;

    });


    html += `
        <td><b>${dayB}</b></td>
        <td><b>${dayL}</b></td>
        <td><b>${dayD}</b></td>
      </tr>
    `;
  }


  /* =========================
     TOTAL MEALS
  ========================= */

  html += `
    <tr style="
      background:#374151;
      color:white;
      font-weight:bold;
    ">

      <td>T</td>
  `;


  let grandB = 0;
  let grandL = 0;
  let grandD = 0;


  userList.forEach((user)=>{

    let totalB = 0;
    let totalL = 0;
    let totalD = 0;


    for(let d=1; d<=daysInMonth; d++){

      const meal =
        meals[d]?.[user];

      if(meal){

        totalB += meal.b;
        totalL += meal.l;
        totalD += meal.d;

      }
    }


    grandB += totalB;
    grandL += totalL;
    grandD += totalD;


    html += `
      <td>${totalB}</td>
      <td>${totalL}</td>
      <td>${totalD}</td>
    `;

  });


  html += `
      <td><b>${grandB}</b></td>
      <td><b>${grandL}</b></td>
      <td><b>${grandD}</b></td>

    </tr>
  `;


  /* =========================
     MEAL COST
  ========================= */

  html += `
    <tr style="
      background:#374151;
      color:#00ff88;
      font-weight:bold;
    ">

      <td>৳</td>
  `;


  let grandCost = 0;


  userList.forEach((user)=>{

    let totalCost = 0;


    for(let d=1; d<=daysInMonth; d++){

      const meal =
        meals[d]?.[user];

      if(meal){

        totalCost +=
          (meal.b * 20) +
          (meal.l * 50) +
          (meal.d * 50);

      }
    }


    grandCost += totalCost;


    html += `
      <td colspan="3">
        ৳ ${totalCost}
      </td>
    `;

  });


  html += `
      <td colspan="3">
        <b>৳ ${grandCost}</b>
      </td>

    </tr>
  `;


  /* =========================
     DEPOSIT
  ========================= */

  html += `
    <tr style="
      background:#1f2937;
      color:#00e676;
      font-weight:bold;
    ">

      <td>জমা</td>
  `;


  let grandDeposit = 0;


  userList.forEach((user)=>{

    const deposit =
      deposits[user] || 0;

    grandDeposit += deposit;


    html += `
      <td colspan="3">
        ৳ ${deposit}
      </td>
    `;

  });


  html += `
      <td colspan="3">
        ৳ ${grandDeposit}
      </td>

    </tr>
  `;


  /* =========================
     BALANCE
  ========================= */

  html += `
    <tr style="
      background:#0f172a;
      color:#38bdf8;
      font-weight:bold;
    ">

      <td>ব্যালেন্স</td>
  `;


  userList.forEach((user)=>{

    let totalCost = 0;


    for(let d=1; d<=daysInMonth; d++){

      const meal =
        meals[d]?.[user];

      if(meal){

        totalCost +=
          (meal.b * 20) +
          (meal.l * 50) +
          (meal.d * 50);

      }
    }


    const deposit =
      deposits[user] || 0;

    const balance =
      deposit - totalCost;


    html += `
      <td colspan="3">
        ৳ ${balance}
      </td>
    `;

  });


  html += `
      <td colspan="3">-</td>

    </tr>

  </tbody>

  </table>


  <!-- =========================
       ALI VAI PAYMENT HISTORY
  ========================= -->

  <div style="
    margin:20px 5px;
    padding:15px;
    background:#f8fafc;
    border-radius:12px;
    border:1px solid #ddd;
  ">

    <h3 style="
      margin-top:0;
      text-align:center;
    ">
      🤝 আলী ভাইকে দেওয়া টাকা
    </h3>
  `;


  if(mamaPayments.length === 0){

    html += `
      <div style="
        text-align:center;
        padding:10px;
        color:#777;
      ">
        এই মাসে কোনো টাকা দেওয়া হয়নি।
      </div>
    `;

  }else{

    mamaPayments.forEach((item)=>{

      html += `
        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:10px;
          margin-bottom:6px;
          background:white;
          border-radius:8px;
          border:1px solid #e5e7eb;
        ">

          <span>
            📅 ${item.date}
          </span>

          <strong>
            ৳ ${item.amount}
          </strong>

        </div>
      `;

    });


    html += `
      <div style="
        display:flex;
        justify-content:space-between;
        margin-top:10px;
        padding:12px;
        background:#1f2937;
        color:#00e676;
        border-radius:8px;
        font-weight:bold;
      ">

        <span>🤝 মোট আলী ভাইকে দেওয়া</span>

        <span>
          ৳ ${totalMamaPayment}
        </span>

      </div>
    `;

  }


  html += `

  </div>

  </div>

  `;


  content.innerHTML = html;
                   }
