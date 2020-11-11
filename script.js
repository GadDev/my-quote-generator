'use strict';
// Get quote from APi

async function getQuote() {
	const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
	const apiURL =
		'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en';
	try {
		const response = await fetch(proxyUrl + apiURL);
		const data = await response.json();
		console.log(data);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// on load
getQuote();
