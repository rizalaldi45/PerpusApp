let inputSearch = document.querySelector('#searchBook')
let btnSearch = document.querySelector('.btnCariBuku')
let groupCardBook = document.querySelector('.groupCardBook')
let spinner = document.querySelector('.spinner-border')
let getHamburgerBar = document.querySelector('#hamburger_menu')
let hamburgerClass = document.querySelector('.mobileBar')
let getCloseIcon = document.querySelector('#closeIcon')

getHamburgerBar.addEventListener('click', (e)=>{
    hamburgerClass.style.display = "block"
    getCloseIcon.addEventListener('click', ()=>{
        hamburgerClass.style.display = "none"
    })
})
btnSearch.addEventListener('click', ()=>{
    getDataFromServer(inputSearch.value)
    spinner.style.visibility = "visible"
    groupCardBook.innerHTML = ""
    formReset()
})

const formReset = ()=>{
    let form1 = document.querySelector('#form1')
    form1.reset()
}

const getDataFromServer = async (keyword)=>{
    try{
        const response = await fetch(`/getContent?buku=${keyword}`)
        const parseData = await response.json()
        if(parseData.totalItems === 0){
            groupCardBook.innerHTML += `<div class="groupNotFound" style="text-align: center;">
            <img src="/images/notFound.png" alt="" width="500" height="380">
            <p>Buku Tidak Ditemukan, Coba Cari Buku Lain :(</p>
                </div>`
                spinner.style.visibility = "hidden"
            }else{
                parseData.items.forEach((i,l)=>{
                    groupCardBook.innerHTML += `<div class="card" style="width: 12rem;">
                    <img src="${i.volumeInfo.imageLinks.thumbnail}" class="card-img-top" alt="..." height="260">
                    <div class="card-body">
                    <h5 class="card-title" maxlength="2"></h5>
                    <a href="${i.volumeInfo.previewLink}" target="_blank">Baca</a>
                    </div>
                    </div>`
                })
                spinner.style.visibility = "hidden"
            }
        }catch(e){
            console.log(e)
        }
}





