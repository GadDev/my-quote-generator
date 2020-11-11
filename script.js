'use strict';
const quoteContainer = document.getElementById('quote-gen-wrapper');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const previousQuoteBtn = document.getElementById('previous-quote');
const loader = document.getElementById('loader');
let quoteObj;
let errorCounter = 0;
// Get quote from APi
async function getQuote() {
	showLoadingSpinner();
	const proxyUrl = 'https://mysterious-retreat-29857.herokuapp.com/';
	const apiURL =
		'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en';
	try {
		const response = await fetch(proxyUrl + apiURL);
		const data = await response.json();
		const localQuote = getQuoteFromLocalStorage();
		implementTextData(data);
		if (localQuote.quoteText === '') {
			saveQuoteOnLocalStorage(quoteText.innerText, authorText.innerText);
		}

		removeLoadingSpinner();
	} catch (error) {
		console.log(error);
		errorCounter += 1;
		console.log(errorCounter);
		if (errorCounter <= 10) {
			getQuote();
		} else {
			console.log(error);
			throw new Error('We cannot retrieve the quote for now, sorry!!');
		}
	}
}

function implementTextData(data) {
	// if author empty string addin fallback string

	//Reduce long size for long quote
	data.quoteAuthor === ''
		? (authorText.innerText = 'Unknown')
		: (authorText.innerText = data.quoteAuthor);
	//Reduce long size for long quote
	data.quoteText.length > 120
		? quoteText.classList.add('long-quote')
		: quoteText.classList.remove('long-quote');
	quoteText.innerText = data.quoteText;
}

function tweetQuote() {
	const quote = quoteText.innerText;
	const author = authorText.innerText;
	const twitterURL = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
	window.open(twitterURL, '_blank');
}

function saveQuoteOnLocalStorage(text, author) {
	const quoteObj = {
		quoteText: text,
		quoteAuthor: author,
	};
	// Put the object into storage
	return localStorage.setItem('quote', JSON.stringify(quoteObj));
}

function removeQuoteOnLocalStorage() {
	return localStorage.removeItem('quote');
}

function getQuoteFromLocalStorage() {
	return JSON.parse(localStorage.getItem('quote'));
}

function removeLoadingSpinner() {
	if (!loader.hidden) {
		quoteContainer.hidden = false;
		loader.hidden = true;
	}
}

function showLoadingSpinner() {
	loader.hidden = false;
	quoteContainer.hidden = true;
}

//Event listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);
previousQuoteBtn.addEventListener('click', function () {
	const prevQuote = getQuoteFromLocalStorage();
	implementTextData(prevQuote);
	removeQuoteOnLocalStorage();
});
// on load
getQuote();
