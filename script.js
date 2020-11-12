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
		implementTextData(data);
		saveQuoteOnLocalStorage(
			quoteText.innerText,
			authorText.innerText,
			'currentQuote'
		);

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

function saveQuoteOnLocalStorage(text, author, item) {
	const quoteObj = {
		quoteText: text,
		quoteAuthor: author,
	};
	// Put the object into storage
	return localStorage.setItem(item, JSON.stringify(quoteObj));
}

function removeQuoteOnLocalStorage(item) {
	return localStorage.removeItem(item);
}

function getQuoteFromLocalStorage(item) {
	return JSON.parse(localStorage.getItem(item));
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
newQuoteBtn.addEventListener('click', function () {
	const currentQuote = getQuoteFromLocalStorage('currentQuote');
	saveQuoteOnLocalStorage(
		currentQuote.quoteText,
		currentQuote.quoteAuthor,
		'previousQuote'
	);
	getQuote();
});
twitterBtn.addEventListener('click', tweetQuote);
previousQuoteBtn.addEventListener('click', function () {
	const prevQuote = getQuoteFromLocalStorage('previousQuote');
	return prevQuote ? implementTextData(prevQuote) : false;
});
// on load
getQuote();
