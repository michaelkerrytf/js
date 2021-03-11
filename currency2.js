async function buildListForDropdown() {
    // get list of rates, for which we only want the currency codes
    const dropDownList = await fetch("https://api.exchangeratesapi.io/latest?base=USD")
            .then(response => response.json())
            .then(data => Object.keys(data.rates))
            .catch(error => {
                return [];
            });
   
    return dropDownList;
}


document.addEventListener('DOMContentLoaded', function() {
    buildListForDropdown().then((data) => {
        const toSelector = document.getElementById("toCurrency");
        data.sort((a,b) => a.localeCompare(b)).map((item) => {
            const option = document.createElement("option");
            option.text = item;
            option.value = item;
            toSelector.add(option);
        });
    });
               
    document.querySelector('#toCurrency').onchange = function() {
        fetch(`https://api.exchangeratesapi.io/latest?base=USD`)
        .then(response => response.json())
        .then(data => {
            const toCurrency = document.querySelector('#toCurrency').value;
            const rate = data.rates[toCurrency];
            if (rate !== undefined) {
                document.querySelector('#result').innerHTML = `1 USD is equal to ${(rate).toFixed(3)} ${toCurrency}`;
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