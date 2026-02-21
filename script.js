
let vehicles = [];
let drivers = [];
let trips = [];
let maintenanceLogs = [];
let fuelLogs = [];
let userRole = "";

function login(){
document.getElementById("loginPage").style.display="none";
document.getElementById("systemPage").style.display="block";
userRole = document.getElementById("role").value;
showPage('dashboard');
updateDashboard();
}

function logout(){
location.reload();
}

function showPage(page){
document.querySelectorAll(".page").forEach(p=>p.style.display="none");
document.getElementById(page).style.display="block";
updateDropdowns();
updateDashboard();
}

/* VEHICLES */
function addVehicle(){
let v = {
model:vModel.value,
plate:vPlate.value,
capacity:parseFloat(vCapacity.value),
odometer:parseFloat(vOdo.value),
status:"Idle",
retired:false,
fuel:0,
maintenance:0
};
vehicles.push(v);
renderVehicles();
}

function renderVehicles(){
let html="<tr><th>Plate</th><th>Status</th><th>Retire</th></tr>";
vehicles.forEach((v,i)=>{
html+=`<tr>
<td>${v.plate}</td>
<td class="status-${v.status.replace(" ","").toLowerCase()}">${v.status}</td>
<td><button onclick="toggleRetire(${i})">Toggle</button></td>
</tr>`;
});
vehicleTable.innerHTML=html;
}

/* DRIVERS */
function addDriver(){
drivers.push({
name:dName.value,
expiry:dLicenseExpiry.value,
status:dStatus.value,
completed:0,
total:0
});
renderDrivers();
}

function renderDrivers(){
let html="<tr><th>Name</th><th>Expiry</th><th>Status</th></tr>";
drivers.forEach(d=>{
html+=`<tr><td>${d.name}</td><td>${d.expiry}</td><td>${d.status}</td></tr>`;
});
driverTable.innerHTML=html;
}

/* TRIPS */
function createTrip(){
let v = vehicles[tripVehicle.selectedIndex];
let d = drivers[tripDriver.selectedIndex];
let cargo = parseFloat(cargoWeight.value);

if(new Date(d.expiry) < new Date()){
tripMsg.innerHTML="❌ License expired!";
return;
}

if(cargo > v.capacity){
tripMsg.innerHTML="❌ Cargo exceeds capacity!";
return;
}

v.status="On Trip";
trips.push({vehicle:v.plate, driver:d.name, status:"Dispatched"});
tripMsg.innerHTML="✅ Trip Created!";
updateDashboard();
}

/* MAINTENANCE */
function addMaintenance(){
let v = vehicles[maintVehicle.selectedIndex];
let cost = parseFloat(maintCost.value);
v.status="In Shop";
v.maintenance+=cost;
maintenanceLogs.push({plate:v.plate,cost:cost});
updateDashboard();
}

/* FUEL */
function addFuel(){
let v = vehicles[fuelVehicle.selectedIndex];
let liters=parseFloat(fuelLiters.value);
let cost=parseFloat(fuelCost.value);
v.fuel+=cost;
fuelLogs.push({plate:v.plate,liters:liters,cost:cost});
}

/* DASHBOARD */
function updateDashboard(){
let active = vehicles.filter(v=>v.status=="On Trip").length;
let shop = vehicles.filter(v=>v.status=="In Shop").length;
let total = vehicles.length;
let util = total?((active/total)*100).toFixed(1):0;

activeFleet.innerText=active;
maintenanceCount.innerText=shop;
utilization.innerText=util+"%";
pendingCargo.innerText=trips.filter(t=>t.status=="Draft").length;
}

/* ANALYTICS */
function calculateAnalytics(){
let output="";
vehicles.forEach(v=>{
let totalCost=v.fuel+v.maintenance;
output+=`Vehicle ${v.plate} - Operational Cost: $${totalCost}<br>`;
});
analyticsOutput.innerHTML=output;
}

function updateDropdowns(){
tripVehicle.innerHTML="";
maintVehicle.innerHTML="";
fuelVehicle.innerHTML="";
vehicles.forEach(v=>{
tripVehicle.innerHTML+=`<option>${v.plate}</option>`;
maintVehicle.innerHTML+=`<option>${v.plate}</option>`;
fuelVehicle.innerHTML+=`<option>${v.plate}</option>`;
});
tripDriver.innerHTML="";
drivers.forEach(d=>{
tripDriver.innerHTML+=`<option>${d.name}</option>`;
});
}

