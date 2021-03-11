async function buildListForDropdown() {
    // get list of currencie codes with names
    const dropDownList = await fetch("https://openexchangerates.org/api/currencies.json")
    .then(response => response.json())
    .then(fullList => {
        // get list of rates, for which we only want the currency codes
        return fetch("https://api.exchangeratesapi.io/latest?base=USD")
            .then(response => response.json())
            .then(data => Object.keys(data.rates))
            .then(shortList => 
                // create a list of objects containing the currencyCode and currencyName
                shortList.map(function(key){
                    return { currencyCode: key, currencyName: fullList[key] }
                })
            )
            .catch(error => {
                return [];
            });
    })
    .catch(error => {
        return [];
    });
    return dropDownList;
}


document.addEventListener('DOMContentLoaded', function() {
    buildListForDropdown().then((data) => {
        const fromSelector = document.getElementById("fromCurrency");
        const toSelector = document.getElementById("toCurrency");
        data.sort((a,b) => a.currencyCode.localeCompare(b.currencyCode)).map((item) => {
            const option = document.createElement("option");
            option.text = `${item.currencyCode} - ${item.currencyName}`;
            option.value = item.currencyCode;
            fromSelector.add(option.cloneNode(true));
            toSelector.add(option.cloneNode(true));
        });
    });
               
    document.querySelector('form').onsubmit = function() {
        const fromCurrency = document.getElementById("fromCurrency").value;
        fetch(`https://api.exchangeratesapi.io/latest?base=${fromCurrency}`)
        .then(response => response.json())
        .then(data => {
            const toCurrency = document.querySelector('#toCurrency').value;
            const amount = document.getElementById("amount").value;
            const rate = data.rates[toCurrency];
            if (rate !== undefined) {
                document.querySelector('#result').innerHTML = `${amount} ${fromCurrency} is equal to ${(amount * rate).toFixed(2)} ${toCurrency}`;
                document.querySelector('#reverseResult').innerHTML = `${amount} ${toCurrency} is equal to ${(amount / rate).toFixed(2)} ${fromCurrency}`;
            } else {
                document.querySelector('#result').innerHTML = 'Invalid currency.';
            }
        })
        .catch(error => {
            console.log('Error:', error);
            document.querySelector('#result').innerHTML = 'An unexpected error has occurred';
        });
        return false;
    }

});