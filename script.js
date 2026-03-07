let selectedPlace="";

function login(){

let user=document.getElementById("username").value
let pass=document.getElementById("password").value

if(user!="" && pass!=""){

document.getElementById("loginPage").style.display="none"
document.getElementById("mainSite").style.display="block"

}
else{
alert("Please enter login details")
}

}

function adminLogin(){

let admin=prompt("Enter Admin Password")

if(admin=="admin123"){
alert("Admin Login Successful")
}
else{
alert("Wrong Password")
}

}

function searchPlaces(){

let input=document.getElementById("searchInput").value.toLowerCase()
let cards=document.getElementsByClassName("place-card")

for(let i=0;i<cards.length;i++){

let title=cards[i].getElementsByTagName("h3")[0].innerText.toLowerCase()

if(title.includes(input)){
cards[i].style.display="block"
}
else{
cards[i].style.display="none"
}

}

}

function bookPlace(place){

selectedPlace=place
document.getElementById("bookingPopup").style.display="block"

}

function closeBooking(){
document.getElementById("bookingPopup").style.display="none"
}

function proceedPayment(){

let checkin=document.getElementById("checkin").value
let checkout=document.getElementById("checkout").value
let guests=document.getElementById("guests").value
let room=document.getElementById("roomType").value

if(checkin=="" || checkout==""){
alert("Please select Check-in and Check-out dates")
return
}

let payment=confirm("Proceed to payment for "+selectedPlace+" ?")

if(payment){

let card=prompt("Enter Card Number")

if(card){

alert("Payment Successful!\n\nBooking Confirmed\n\nPlace: "+selectedPlace+"\nGuests: "+guests+"\nRoom Type: "+room+"\nCheck-in: "+checkin+"\nCheck-out: "+checkout)

document.getElementById("bookingPopup").style.display="none"

}

}

}