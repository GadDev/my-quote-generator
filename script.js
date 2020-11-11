'use strict';
const quoteContainer = document.getElementById('quote-gen-wrapper');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
// Get quote from APi
async function getQuote() {
	const proxyUrl = 'https://mysterious-retreat-29857.herokuapp.com/';
	const apiURL =
		'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en';
	try {
		const response = await fetch(proxyUrl + apiURL);
		const data = await response.json();
		authorText.innerText = data.quoteAuthor;
		quoteText.innerText = data.quoteText;
	} catch (error) {
		getQuotes();
		console.log(error);
		throw error;
	}
}

// on load
getQuote();
