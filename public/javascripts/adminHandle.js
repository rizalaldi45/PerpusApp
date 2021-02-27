let btnLogin = document.querySelector('.btnMasuk')
let getUsernameInput = document.querySelector('#usernameInput')
let getInputPass = document.querySelector('#passInputUser')


btnLogin.addEventListener("click", ()=>{
    if(getUsernameInput.value === "admin" && getInputPass.value === "admin"){
        window.location.href = "/adminPanel"
    }else{
        alert("Maaf Username Atau Password Tidak Valid !")
    }
})
