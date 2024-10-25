const inputSlider = document.querySelector("[data-lengthSlider]") ;
const displayPassword = document.querySelector("[data-lengthNumber]") ;
const uppercaseCheck = document.querySelector("#uppercase") ;
const lowercaseCheck = document.querySelector("#lowercase") ;
const numbersCheck = document.querySelector("#numbers") ;
const symbolsCheck = document.querySelector("#symbols") ;
const generateBtn = document.querySelector(".generateButton") ;
const allCheckBox = document.querySelectorAll("input[type=checkbox]") ;
const passwordDisplay = document.querySelector("[data-passwordDisplay]") ;
const copyBtn = document.querySelector("[data-copy]") ;
const copyMsg = document.querySelector("[data-copyMsg]") ;
const indicator = document.querySelector("[data-indicator]") ;
const strengthType = document.querySelector(".strengthType") ;
const clearBtn = document.querySelector(".clearPassword") ;

// For Showing Password length in UI
let checkCount = 0 ;
let passwordLength = 8 ;

handleSlider();
function handleSlider(){
    inputSlider.value = passwordLength ;
    displayPassword.innerText = passwordLength ;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%"
}
inputSlider.addEventListener('input' , (e)=>{
    passwordLength = inputSlider.value ;
    handleSlider() ;
})


// random integer generation
function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max-min))+ min ;
}
// uppercase generation
function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91)) ;
}
// lowercase generation
function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123)) ;
}
// number generation
function generateRandomNumber(){
    return getRandomInteger(0,9) ;
}
// symbols genration
let symbols = '!@#~`$%^&*()-_=+[{]}|:;".<>,?/' ;
function generateSymbol(){
    return symbols.charAt(getRandomInteger(0,symbols.length));
}

function handleCheckChange(){
    checkCount = 0 ;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++ ;
        }
    }) ;
    // special case
    if(passwordLength<checkCount){
        console.log(checkCount) ;
        passwordLength=checkCount ;
        handleSlider() ;
    }
    console.log(checkCount) ;
}

allCheckBox.forEach(function(checkbox){
    checkbox.addEventListener('change',handleCheckChange)
})


// calcStrength
function calcStrength(){
    let hasUpper = false ;
    let hasLower = false ;
    let hasNum = false ;
    let hasSym = false ;
    if(uppercaseCheck.checked) hasUpper=true ;
    if(lowercaseCheck.checked) hasLower=true ;
    if(numbersCheck.checked) hasNum=true ;
    if(symbolsCheck.checked) hasSym=true ;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
        strengthType.innerText = 'Strong' ;
        strengthType.classList.add('active') ;
        strengthType.style.color = 'green' ;
      } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
        strengthType.innerText = 'Medium' ;
        strengthType.classList.add('active') ;
        strengthType.style.color = 'yellow' ;
      } else {
        setIndicator("#f00");
        strengthType.innerText = 'Weak' ;
        strengthType.classList.add('active') ;
        strengthType.style.color = 'red' ;
      }
}

// strength color set to grey
setIndicator('#ccc') ;
// for strength color
function setIndicator(color){
    indicator.style.backgroundColor = color ;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}` ;
}

// for shuffle 
function shufflePassword(array){
    // Fisher Yates Method
    for(let i=array.length-1 ; i>0 ; i--){
        // random index generation for find out using random function
        const j= Math.floor(Math.random() * (i+1)) ;
        // swap number at i index and j index 
        const temp = array[i] ;
        array[i] = array[j] ;
        array[j] = temp ;
    }

    let str = "" ;
    array.forEach((el) => (str += el)) ;
    return str ;
}


// generate button event listener
generateBtn.addEventListener('click' , (e)=>{
    // none of the checkbox selected
    if(checkCount==0){
        alert('Please click atleast one checkbox') ;
        return ; 
    }

    // if input slider password length is less than the checkcount
    if(passwordLength<checkCount) {
        passwordLength=checkCount ;
        handleSlider() ;
    }

    // create new password 

    // remove old password
    password = "" ;
    let funcArr = [] ;

    if(uppercaseCheck.checked) funcArr.push(generateUpperCase) ;
    if(lowercaseCheck.checked) funcArr.push(generateLowerCase) ;
    if(numbersCheck.checked) funcArr.push(generateRandomNumber) ;
    if(symbolsCheck.checked) funcArr.push(generateSymbol) ;
    
    // compulsory addition
    for(let i=0 ; i<funcArr.length ; i++){
        let randIndex = getRandomInteger(0,funcArr.length) ;
        password += funcArr[i]() ;
    }

    // remaining addition
    for(let i=0 ; i<passwordLength-funcArr.length ; i++){
        let randIndex = getRandomInteger(0,funcArr.length) ;
        password += funcArr[randIndex]() ;
    }

    // shuffle password 
    password = shufflePassword(Array.from(password)) ;

    // display password
    passwordDisplay.value = password ;
    
    // calculate strength 
    calcStrength()
})

// copy function
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value) ;
        copyMsg.innerText = "copied" ;
    }
    catch(e){
        copyMsg.innerText = "failed" ;
    }
    // to make copy message span visible
    copyMsg.classList.add('active') ;

    setTimeout(()=>{
        copyMsg.classList.remove('active') ;
    },2000)
}
// copy button event 
copyBtn.addEventListener('click' , (e)=>{
    if(passwordDisplay.value){
        copyContent() ;
    }
})


// clearing password 
clearBtn.addEventListener('click' , (e)=>{
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkbox.checked = 0 ;
        }
    })
    checkCount=0 ;
    passwordLength=8 ;
    password = "" ;
    passwordDisplay.value = password ;
    handleCheckChange() ;
    handleSlider() ;  
})






