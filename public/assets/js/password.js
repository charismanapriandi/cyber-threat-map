function checkPass()
{
    //Store the password field objects into variables ...
    var newpass = document.getElementById('newpass');
    var renewpass = document.getElementById('renewpass');
    //Store the Confimation Message Object ...
    var message = document.getElementById('confirmMessage');
    //Set the colors we will be using ...
    var goodColor = "#66cc66";
    var badColor = "#ff6666";
    //Compare the values in the password field
    //and the confirmation field
    if(newpass.value == renewpass.value){
        //The passwords match.
        //Set the color to the good color and inform
        //the user that they have entered the correct password
        renewpass.style.backgroundColor = goodColor;
        message.style.color = goodColor;
        message.innerHTML = "Passwords Match!"
    }else{
        //The passwords do not match.
        //Set the color to the bad color and
        //notify the user.
        renewpass.style.backgroundColor = badColor;
        message.style.color = badColor;
        message.innerHTML = "Passwords Not Match!"
    }
}