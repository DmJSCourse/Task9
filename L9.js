var savedCountries = null;

function buildTable(countries) {
    let htmlCode = '<table class="table"><thead><tr id="header"><th>#</th><th>название страны</th><th>столица</th><th>населениe</th><th>площадь</th><th>валюты</th><th>языки</th><th>флаг</th><th>граничит с</th></tr></thead><tbody>';
    for (let index in countries) {
        let element = countries[index];
        let idString = element.name.split(" ").join("_");
        htmlCode += `<tr id="${idString}"><td>${+index+1}</td><td>${element.name}</td><td>${element.capital}</td><td>${element.population}</td><td>${element.area}</td><td>`;
        let currencies = element.currencies.map((item) => {
            return item.name;
        });
        htmlCode += `${currencies.join(', ')}</td><td>`;

        let languages = element.languages.map((item) => {
            return item.name;
        });
        htmlCode += `${languages.join(', ')}</td><td><img src="${element.flag}"></td><td>`;
        let borderNames = [];
        for (let borderItem of element.borders) {
            for (let searchArray in savedCountries) {
                if (savedCountries[searchArray].alpha3Code === borderItem) {
                    borderNames.push(savedCountries[searchArray].name);
                }
            }
        }

        htmlCode += `${borderNames.join(', ')}</td></tr>`;
    }
    htmlCode += '</tbody></table>';


    let countriesNames = savedCountries.map((el) => {
        return el.name;
    });

    $( "#tags" ).autocomplete({
        source: countriesNames,
        select: function (click, selectedCountry) {
            let shownCountry = $.grep(savedCountries, function (itemOfArray) {
                return itemOfArray.name === selectedCountry.item.value;
            });
            buildTable(savedCountries);
            deleteOtherCountries (shownCountry);
        }
    });



    $('.htmlTable').html(htmlCode);
    $('.btn').hide();
}

$(document).ready(() => {
    $('.ui-widget').hide();

    $('.btn').click(() => {
        $.ajax({
            url: "https://restcountries.eu/rest/v2/all"
        }).done((data) => {
            $('.ui-widget').show();
            savedCountries = data;
            buildTable(data);           
        });
    })
});

function deleteOtherCountries (shownCountry){
    let displayed = shownCountry[0].name;
    displayed = displayed.split(" ").join("_");
    $("tr[id!="+displayed+"]").not('#header').remove();
}