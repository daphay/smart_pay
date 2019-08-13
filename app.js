const supportedCards = {
  visa: "",
   mastercard: ""
};

const countries = [
  {
    code: "US",
    currency: "USD",
    currencyName: '',
    country: 'United States'
  },
  {
    code: "NG",
    currency: "NGN",
    currencyName: '',
    country: 'Nigeria'
  },
  {
    code: 'KE',
    currency: 'KES',
    currencyName: '',
    country: 'Kenya'
  },
  {
    code: 'UG',
    currency: 'UGX',
    currencyName: '',
    country: 'Uganda'
  },
  {
    code: 'RW',
    currency: 'RWF',
    currencyName: '',
    country: 'Rwanda'
  },
  {
    code: 'TZ',
    currency: 'TZS',
    currencyName: '',
    country: 'Tanzania'
  },
  {
    code: 'ZA',
    currency: 'ZAR',
    currencyName: '',
    country: 'South Africa'
  },
  {
    code: 'CM',
    currency: 'XAF',
    currencyName: '',
    country: 'Cameroon'
  },
  {
    code: 'GH',
    currency: 'GHS',
    currencyName: '',
    country: 'Ghana'
  }
];

const billHype = () => {
  const billDisplay = document.querySelector('.mdc-typography--headline4');
  if (!billDisplay) return;

  billDisplay.addEventListener('click', () => {
    const billSpan = document.querySelector("[data-bill]");
    if (billSpan &&
      appState.bill &&
      appState.billFormatted &&
      appState.billFormatted === billSpan.textContent) {
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance(appState.billFormatted)
      );
    }
  });
};

const appState = {};
const formatAsMoney = (amount, buyerCountry) => {
let code = countries[0].code;
let currency = countries[0].currency;
for (let locale of countries ){
if(locale.country === buyerCountry) {
  code = locale.code;
  currency = locale.currency;
}  
}
return amount.toLocaleString(`en-${code}`, {
  style: 'currency',
  currency: currency
});  
};

const flagIfInvalid = (field,isValid) => {
  if(isValid){
field.classList.remove("is-invalid")
} else {
field.classList.add("is-invalid")
}
};

const expiryDateFormatIsValid = (field) => {
let mm = field.value.split("/")[0];
let yy = field.value.split("/")[1];
return /(0?[1-9]|1[012])/.test(mm) && /19|[2-9]\d+/.test(yy);
};

const detectCardType = (first4Digits) => {
  let typeofCard = document.querySelector("div[data-credit-card]");
let cardImage = document.querySelector("img[data-card-type]");
first4Digits = first4Digits.join("")
if(first4Digits.charAt(0) == 4) {
typeofCard.classList.add("is-visa")
typeofCard.classList.remove("is-mastercard");
cardImage.src = supportedCards.visa;
return "is-visa";
} else if(first4Digits.charAt(0) == 5) {
typeofCard.classList.add("is-mastercard")
typeofCard.classList.remove("is-visa");
cardImage.src = supportedCards.mastercard;
return "is-mastercard";
}
};

const validateCardExpiryDate = () => {
 const field = document.querySelector("[data-cc-info]>input:nth-child(2)");
const month = field.value.split("/")[0];
const year = field.value.split("/")[1];
const date = new Date(`0${year}/01/${month}`);
const isValid = expiryDateFormatIsValid(field) && new Date();
if (isValid){
flagIfInvalid(field, true);
return true;
} else{
 flagIfInvalid(field, false)
 return false;
}
};

const validateCardHolderName = () => {
  const field = document.querySelector("[data-cc-info]>input:first-child");
regX= /^([a-zA-Z]{3,})\s([a-zA-Z]{3,})$/.test(field.value);
if(!regX){
flagIfInvalid(field , false)
 return false;
} else{
flagIfInvalid(field , true);
 return true;
}
};

const validateWithLuhn = (digits) => {
 let myDigits = 0;
if (digits && digits.length === 16){
 const reverse = digits.reverse();
 reverse.forEach((item, index) => {
 if (index % 2 > 0) {
   const doubled = item * 2;
     if(doubled > 9) {
   myDigits += doubled - 9;
 } else{
   myDigits += doubled;
 }	
 } else {
   myDigits += item;
 }
 });
return myDigits % 10 === 0; 
} else {
 return false;
}
};
const validateCardNumber = () => {
 let myDigits = document.querySelector("[data-cc-digits]");
appState.cardDigits = appState.cardDigits.flat();
const digits = appState.cardDigits.map(item =>{
return parseInt(item);
});
const valCard = validateWithLuhn(digits);
if(valCard){
myDigits.classList.remove("is-invalid");
 return true;
} else{
myDigits.classList.add("is-invalid");
return false;
}
};

const validatePayment = () => {
validateCardNumber()
validateCardHolderName()
validateCardExpiryDate()
};

const smartCursor = (event, fieldIndex, fields) =>{
 
};

const enableSmartTyping = () => {
   const inputFields = document.querySelectorAll("[data-cc-digits] input")
inputFields.forEach((field,index, fields) => { field.addEventListener("keydown", event =>
 smartInput(event, index, fields))
})
};

const smartInput = (event , fieldIndex, fields) => {
 const nums = /^\d$/;
const chars = /^[a-zA-Z]?$/;
if(fieldIndex <= 3){
 if(chars.test(event.key)){
   event.preventDefault();
 }
 if(nums.test(event.key)){
   if(appState.cardDigits[fieldIndex] === undefined){
  appState.cardDigits[fieldIndex] = [];
appState.cardDigits[fieldIndex].push(event.key);
const first4Digits = appState.cardDigits[0];
detectCardType(first4Digits)		   
   } else{
     appState.cardDigits[fieldIndex].push(event.key);
   }
   console.log(appState.cardDigits)
 if(fieldIndex <= 2){
   let value = event.target.value;
   if(value.length === 0) {
     setTimeout(() => {
       event.target.value = "$"
     }, 500);
   } else if(value.length === 1) {
     setTimeout(() => {
       event.target.value = "$$"
     });
   } else if(value.length === 2) {
     setTimeout(() => {
       event.target.value = "$$$"
     });
   } else if(value.length === 2) {
     setTimeout(() => {
       event.target.value = "$$$$"
     });
   }
 }  
 }
fields[fieldIndex].addEventListener("keyup", event => smartCursor(event,fieldIndex,fields)); 
}
};

const uiCanInteract = () => {
 const field = document.querySelector("[data-cc-digits]>input:nth-child(1)");
   const payBtn = document.querySelector("[data-pay-btn]");
field.focus();
payBtn.addEventListener("click", validatePayment);
 billHype();
enableSmartTyping();
};

const displayCartTotal = ({results}) => {
  const [data] = results;
const {itemsInCart, buyerCountry} = data;

appState.items = itemsInCart;
appState.country = buyerCountry;

appState.bill = itemsInCart.reduce((total,item) => { return total + (item.price*item.qty)},0);
appState.billFormatted = formatAsMoney(appState.bill, appState.country);
let billElement = document.querySelector("[data-bill]")
billElement.textContent = appState.billFormatted;
appState.cardDigits = [];
uiCanInteract();
};

const fetchBill = () => {
  const apiHost = 'https://randomapi.com/api';
const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
const apiEndpoint = `${apiHost}/${apiKey}`;
  fetch(apiEndpoint)
     .then(response =>{ return response.json()})
     .then(data =>{
     displayCartTotal(data)
   }).catch(error => console.log(error))
};

const startApp = () => {
fetchBill();
};

startApp();