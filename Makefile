#
# BUILD minified JavaScript
# requires uglifyjs
#

autocomplete:
	uglifyjs -nc ./src/jquery.autocomplete.js > ./src/jquery.autocomplete.min.js
