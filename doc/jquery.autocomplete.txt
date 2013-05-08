Autocomplete - a jQuery plugin :
================================


Usage :
=======

$("selector").autocomplete(url [, options]);


Restriction :
=============

Selector should select one input element. Anything else will cause Autocomplete to exit with an error message.


Example :
=========

$("#input_box").autocomplete("my_autocomplete_backend.php");

In the above example, Autocomplete expects an input element with the id "input_box" to exist.

When a user starts typing in the input box, the autocompleter will request my_autocomplete_backend.php
with a GET parameter named q that contains the current value of the input box. Let's assume that the user
has typed "foo"(without quotes). Autocomplete will then request my_autocomplete_backend.php?q=foo.

The backend should output possible values for the autocompleter, each on a single line.
Output cannot contain the pipe symbol "|", since that is considered a separator (more on that later).

An appropiate simple output would be:

foo
fool
foot
footloose
foo fighters
food fight

Note that the autocompleter will present the options in the order the backend sends them.


Advanced options :
==================

You can pass advanced options as a JavaScript object, notation { name:value, ..., name: value }

Example: $("#input_box").autocomplete("my_autocomplete_backend.php", { minChars:3 });

These options are available:

inputClass (default value: "acInput")
	This class will be added to the input box.

loadingClass = (default value: "acLoading")
	The class for the input box while results are being fetched from the server.

resultsClass (default value: "acResults")
	The class for the UL that will contain the result items (result items are LI elements).

selectClass = (default value: "acSelect")
	The class for the list row when row is selected by keyboard or hovered.

queryParamName = (default value: "q")
	The url parameter used to request the autocomplete list. The value used is what the user entered.

extraParams (default value: {})
	Extra parameters for the backend. If you were to specify { bar:4 }, the autocompleter would
	call my_autocomplete_backend.php?q=foo&bar=4 (assuming the input box contains "foo").

remoteDataType  (default value: false)
	If this is set to 'json', the autocompleter expects a JSON array from the server. Any other
	settings, it defaults to the native text format using lineSeparator and Cellseparator (see below).

lineSeparator = (default value: "\n")
	The character that separates lines in the results from the backend.

cellSeparator (default value: "|")
	The character that separates cells in the results from the backend.

minChars (default value: 2)
	The minimum number of characters a user has to type before the autocompleter activates.

maxItemsToShow (default value: 10)
	Set the maximum number of items to show. If set to 0, all items will be shown. This is for
	display purposes only, if you need to limit the values retrieved form the server, use extraParams.
	Warning: limiting the number of items to retrieve from the server can cause unexpected problems if
	you use caching.

delay (default value: 400)
	The delay in milliseconds the autocompleter waits after a keystroke to activate itself.

useCache (default value: true)
	Set to true if caching is wanted.

maxCacheLength (default value: 10)
	The number of backend query results to store in cache. If set to 1 (the current result), no
	caching will happen. Do not set below 1.

matchSubset (default value: true)
	Whether or not the autocompleter can use a cache for more specific queries. This means that
	all matches of "foot" are a subset of all matches for "foo". Usually this is true, and using
	this options decreases server load and increases performance. Remember to set cacheLength to a
	bigger number, like 10.

matchCase (default value: false)
	Whether or not the comparison is case sensitive. Only important if you use caching.

matchInside (default value: true)
	Whether or not the comparison looks inside (i.e. does "ba" match "foo bar") the search results.
	Only important if you use caching.

mustMatch (default value: false)
	If set to true, the autocompleter will only allow results that are presented by the backend.
	Note that illegal values result in an empty input box. In the example at the beginning of this
	documentation, typing "footer" would result in an empty input box.

selectFirst (default value: false)
	If this is set to true, the first autocomplete value will be automatically selected, and highlighted.

selectOnly (default value: false)
	If this is set to true, and there is only one autocomplete when the user hits tab/return,
	it will be selected even if it has not been handpicked by keyboard or mouse action.
	This overrides selectFirst.

showResult (default value: null)
	A JavaScript function that can provide advanced markup for an item. For each row of results,
	this function will be called. The returned value will be displayed inside an LI element in the
	results list. Autocompleter will provide the value and the data.

onItemSelect (default value: null)
	A JavaScript function that will be called when an item is selected. The autocompleter will
	specify a single argument, being the LI element selected. This LI element will have an
	attribute "extra" that contains an array of all cells that the backend specified. See the
	source code of http://www.dyve.net/jquery?autocomplete for an example.

autoFill (default value: false)
	If this is set to true, the autocompleter will automatically fill the search box with the
	first entry in the results.

filter (default value: true)
	If this is set to false, the autocompleter will consider every result a valid response.
	If this is set to a function, the autocompleter will call that function for each result object
	and expect a true/false (include / leave out) response.
	At any other setting (including true), the autocompleter will filter the results using its
	standard filter.

filterResults (default value: true)
	DEPRECATED; use filter instead
	If this is set to true, the autocompleter will filter the results presented by the server,
	selecting only those that begin with the user input.
	If this is set to false, the autocompleter will consider every result from the server a
	valid response.

sortResults (default value: true)
	If this is set to true, the autocompleter will sort the results presented in alphanumeric
	order, see sortFunction for custom sort.

sortFunction (default value: null)
	Use this sort function to sort results if set instead of the built-in alphanumeric sort
	function. Sorting will only happen if sortResults is set to true.

onNoMatch  (default value: null)
	A JavaScript function that will be called if there are no matches.

onFinish  (default value: null)
	A JavaScript function that will be called when finishing the autocompleter (only called if active).

preventDefaultReturn  (default value: 1)
	Whether or not to prevent the default behavior of the Return key.
	Return will usually submit the form.
	Any value that evaluates to false will allow the default behaviour.
	Any value that evaluates to 2 (integer) will always prevent the default behaviour.
	Any other value that evaluates to true will prevent the default behavior only when the autocompleter
	is active.

preventDefaultTab  (default value: false)
	Whether or not to prevent the default behavior of the Tab key when this is used to select an item.
	Tab will usually jump to the next input field of the form.

matchStringConverter  (default value: null)
	A javascript function which is used to convert the input value and the results before comparing them.
	Can be used to implement accent folding. Only used when filterResults is set to true.

beforeUseConverter  (default value: null)
	A JavaScript function which is used to convert the input value before sending it to the backend.

autoWidth  (default value: "min-width")
	The CSS property to set the width of the results list to. Leave empty to stop jquery-autocomplete
	from interfering with your results width. Other sensible values are "min-width" (default) and "width".

useDelimiter  (default value: false)
    Whether or not to delimit separate autocomplete strings within the same input field with a
    comma.  For example, you may want to allow the user to enter a comma separated list of values--and
    each value will autocomplete without erasing the other delimited values in the input field.

processData  (default value: null)
    This function will process all incoming data before anything else. Use this to alter incoming data.

onError  (default value: null)
  A JavaScript function that will be called if there is an error in the AJAX request to a remote
  source. The standard jQuery paramaters are supplied (jqXHR, textStatus, errorThrown).

More advanced options :
=======================

If you want to do more with your autocompleter, you can change some options on the fly.
The autocompleter is accessed as an attribute of the input box.

Example:

    $("#input_box").autocomplete({ url: "my_autocomplete_backend.php" }); // Set the autocompleter
    var ac = $("#input_box").data('autocompleter'); // A handle to our autocompleter

There are currently 2 functions that can be called to influence the behaviour at run-time:

flushCache()
	This flushes the cache.

setExtraParam(key, value)
	This sets the extra parameter of the autocompleter.

It's often wise to flush the cache after calling setExtraParam.
