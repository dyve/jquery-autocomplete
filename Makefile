#
# BUILD minified JavaScript
# requires uglifyjs
#

autocomplete:
	uglifyjs ./src/jquery.autocomplete.js > ./src/jquery.autocomplete.min.js --comments
