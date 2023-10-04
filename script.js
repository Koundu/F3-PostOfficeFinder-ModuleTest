let url = 'https://api.ipify.org?format=json'
let ipAddress="",lat,long,cus_lat,cus_long,code;
const token = '?token=439f8a6fbf7199';
const searchBar = document.querySelector('input[type="text"]');

//Getting IP Address on Page Load and Storing in the Variable
fetch(url)
    .then(response => response.json())
    .then(data => {
        ipAddress += data.ip;
        document.getElementById("ip-address").append(`${data.ip}`)
        console.log(ipAddress);
    }).catch(error => console.log(error))
/*-------------------Updating the Latitude,Longitude and other Details for the IP Address received---------------------------------------------------------------------------*/
fetch('https://ipinfo.io/'+ipAddress+token)
                    .then(res => res.json())
                    .then(data => {
                        document.getElementById("lat").innerHTML += ` ${data.loc.split(",").shift()}`,
                        document.getElementById("log").innerHTML += ` ${data.loc.split(",").pop()}`,
                        document.getElementById("city").innerHTML += `  ${data.city}`,
                        document.getElementById("org").innerHTML += `   ${data.org.split(" ").pop()}`,
                        document.getElementById("reg").innerHTML += `   ${data.region}`;
                        document.getElementById("host").innerHTML += `  ${data.hostname}`;
                        return data;
                    }).catch(error => console.log(error))
/*--------------------Updating the Google Map for USERS Location--------------------------------------------------------------------------------------------------*/
                    .then(data => {
                        document.getElementById("maps").src = "https://maps.google.com/maps?q="+`${data.loc.split(",").shift()}`+","+`${data.loc.split(",").pop()}`+"&z=15&output=embed"
                        console.log("https://maps.google.com/maps?q="+`${data.loc.split(",").shift()}`+","+`${data.loc.split(",").pop()}`+"&z=15&output=embed");
                        return data;
                         }).catch(error => console.log(error))
/*--------------------Updating the Timezone,Date and Time, Pincode for provided IP Address---------------------------------------------------------------------------------------*/
                    .then(data =>{
                        let kolkata_datetime_str = new Date().toLocaleString("en-US", { timeZone: `${data.timezone}`});
                        let date_kolkata = new Date(kolkata_datetime_str);
                        document.getElementById("timeZone").innerHTML += `   ${data.timezone}`;
                        document.getElementById("dateTime").innerHTML += `   ${date_kolkata}`;
                        document.getElementById("pin").innerHTML += `   ${data.postal}`;
                        return data;
                    }).catch(error => console.log(error))
                    .then(data =>{
                        let postal = `${data.postal}`
                        code = postal;
                        console.log(code);
                    }).catch(error => console.log(error))
/*--------------------Updating the Number of post offices available---------------------------------------------------------------------------------------*/
                    .then(data => fetch('https://api.postalpincode.in/pincode/'+code))
                                        .then(res => res.json())
                                        .then(data =>{
                                            document.getElementById("msg").innerHTML += data[0].Message;
                                            console.log(data[0].Message);
                                            console.log(data[0].PostOffice.length);
                                            return data;
                                        }).catch(error => console.log(error))
/*--------------------getting the post offices around the IP and updating the available post offices---------------------------------------------------------------------------------------*/
                                        .then(data =>{
                                            const postOffices = data[0].PostOffice;
                                            console.log(postOffices);
                                            const list = document.getElementsByClassName("cardItems");
                                            postOffices.forEach((postOffice) => {
                                                const item = document.createElement("div");
                                                item.id = "card";
                                                item.innerHTML = `
                                                <p id="name">Name:${postOffice.Name}</p>
                                                <p id="bt">Branch Type:${postOffice.BranchType}</p>
                                                <p id="ds">Delivery Status:${postOffice.DeliveryStatus}</p>
                                                <p id="dst">District:${postOffice.District}</p>
                                                <p id="div">Division:${postOffice.Division}</p>
                                                `;
                                                list[0].appendChild(item);
                                            });
                                        }).catch(error => console.log(error));

/*--------------------Handling Search operating and filtering the Cards---------------------------------------------------------------------------------------*/
searchBar.addEventListener('input',(e)=>{
    const query = e.target.value.toLowerCase();
    const searchItems = document.getElementsByClassName("cardItems")[0];
    var searchArray = searchItems.querySelectorAll("#card");
    Array.from(searchArray).forEach(item => {
        const postOfficeName = item.children[0].textContent.split(":");
        console.log(postOfficeName[1].toLowerCase());
        if(!postOfficeName[1].toLowerCase().includes(query)){
            item.style.display = "none";
            console.log(query);
        }else{
            item.style.display = "block";
            console.log(postOfficeName[1]);
        }
        // console.log(postOfficeName);
    });

})

function afterClicking(){
    window.location.href = "./afterClicking.html";
}



/*
Block
: 
"Vijayawada (Urban)"
BranchType
: 
"Sub Post Office"
Circle
: 
"Andhra Pradesh"
Country
: 
"India"
DeliveryStatus
: 
"Non-Delivery"
Description
: 
null
District
: 
"Krishna"
Division
: 
"Vijayawada"
Name
: 
"Besant Road"
Pincode
: 
"520011"
Region
: 
"Vijayawada"
State
: 
"Andhra Pradesh"
*/