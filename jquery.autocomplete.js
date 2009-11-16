/**
 * jquery.autocomplete.js
 * Version 3.0
 * Copyright (c) Dylan Verheul <dylan.verheul@gmail.com>
 */
(function($) {
	
	var autocompleter = function(options) {

		var ac = {
			dom: {},
			options: {}
		};
		
		var selectClass = 'jquery-autocomplete-selected-item';
		var keyTimeout = false;
		var lastKeyPressed = false;
		var lastValueProcessed = false;
		var active = false;
		var dontBlur = true;
		
		var cache = {
			data: {},
			length: 0
		};
		cache.set = function(index, data) {
			if (ac.options.useCache) {
				if (cache.length >= ac.options.maxCacheLength) {
					cache.flush();
				}
				index = String(index);
				if (cache.data[index] !== undefined) {
					cache.length++;
				}
				return cache.data[index] = data;
			}
			return false;
		}
		cache.get = function(index) {
			var indexLength, searchLength, search, maxPos, pos;
			if (ac.options.useCache) {
				index = String(index);
				indexLength = index.length;
				if (ac.options.matchSubset) {
					searchLength = 1;
				} else {
					searchLength = indexLength;
				}
				while (searchLength <= indexLength) {
					if (ac.options.matchInside) {
						maxPos = indexLength - searchLength;
					} else {
						maxPos = 0;
					}
					pos = 0;
					while (pos <= maxPos) {
						search = index.substr(0, searchLength);
						if (cache.data[search] !== undefined) {
							return cache.data[search];
						}
						pos++;
					}
					searchLength++;
				}				
			}
			return false;
		}
		cache.flush = function() {
			cache.data = {};
			cache.length = 0;
		}
		ac.cache = cache;

        if (typeof options === 'string') {
            options = { url:options };
        }

		// Set options and make sure essential options have valid values
		$.extend(ac.options, $.fn.autocomplete.defaults || {}, options || {});
		ac.options.maxCacheLength = parseInt(ac.options.maxCacheLength);
		if (isNaN(ac.options.maxCacheLength) || ac.options.maxCacheLength < 1) {
			ac.options.maxCacheLength = 1;
		}
		ac.options.minChars = parseInt(ac.options.minChars);
		if (isNaN(ac.options.minChars) || ac.options.minChars < 1) {
			ac.options.minChars = 1;
		}
		
		ac.bind = function(elem) {
			var $elem = $(elem), offset = $elem.offset();
			ac.dom.$elem = $elem;
			if (ac.options.inputClass) {
				ac.dom.$elem.addClass(ac.options.inputClass);
			}
			ac.dom.$results = $('<div></div>').hide();
			if (ac.options.resultsClass) {
				ac.dom.$results.addClass(ac.options.resultsClass);
			}
			ac.dom.$results.css({
				position: 'absolute',
				top: offset.top + $elem.outerHeight(),
				left: offset.left
			});
			$('body').append(ac.dom.$results);
			$elem.data('autocompleter', ac);
			$elem.keydown(function(e) {
				lastKeyPressed = e.keyCode;
				switch(lastKeyPressed) {

					case 38: // up
						e.preventDefault;
						if (ac.active()) {
							ac.focusPrev();
						} else {
							ac.activate();
						}
						return false;							
					break;
					
					case 40: // down
						e.preventDefault;
						if (ac.active()) {
							ac.focusNext();
						} else {
							ac.activate();
						}
						return false;							
					break;
					
					case 9: // tab
					case 13: // return
						if (ac.active()) {
							e.preventDefault;
							ac.selectCurrent();
							return false;							
						}
					break;

					default:
						ac.activate();
						
				}
			});
			$elem.blur(function() {
				if (!dontBlur) {
					setTimeout(ac.finish, 200);					
				}
			});
		};
		
		ac.callHook = function(hook, data) {
			var f = ac.options[hook];
			if (f && $.isFunction(f)) {
				return f(data, ac);
			}
			return false;
		}
		
		ac.activate = function() {
			var delay = parseInt(ac.options.delay);
			if (isNaN(delay) || delay <= 0) {
				delay = 250;
			}
			if (keyTimeout) {
				clearTimeout(keyTimeout);
			}
			keyTimeout = setTimeout(ac.activateNow, delay);
		};

		ac.activateNow = function() {
			var value = ac.dom.$elem.val();
			if (value !== lastValueProcessed && value !== ac.lastSelectedValue()) {
				if (value.length >= ac.options.minChars) {
					active = true;
					lastValueProcessed = value;
					ac.fetchData(value);				
				}							
			}
		}
		
		ac.fetchData = function(value) {
			if (ac.options.data) {
				ac.filterAndShowResults(ac.options.data, value);
			} else {
				ac.fetchRemoteData(value, function(remoteData) {
					ac.filterAndShowResults(remoteData, value);					
				});
			}			
		};

		ac.fetchRemoteData = function(filter, callback) {
			var data = ac.cache.get(filter);
			if (data) {
				callback(data);				
			} else {
				try {
					ac.dom.$elem.addClass(ac.options.loadingClass);
					$.get(ac.makeUrl(filter), function(data) {
						var parsed = ac.parseRemoteData(data);
						ac.cache.set(filter, parsed);
						ac.dom.$elem.removeClass(ac.options.loadingClass);
						callback(parsed);
					});				
				} catch(e) {
					ac.dom.$elem.removeClass(ac.options.loadingClass);
					callback(false);
				}				
			}
		};
		
		ac.makeUrl = function(param) {
			var paramName = ac.options.paramName || 'q';
			var url = ac.options.url;
			var params = $.extend({}, ac.options.extraParams);
			var urlAppend = [];
			params[paramName] = param;
			$.each(params, function(index, value) {
				urlAppend.push(ac.makeUrlParam(index, value));
			});
			url += url.indexOf('?') == -1 ? '?' : '&';
			url += urlAppend.join('&');
			return url;
		};
		
		ac.makeUrlParam = function(name, value) {
			return String(name) + '=' + encodeURIComponent(value);
		}
		
		ac.parseRemoteData = function(remoteData) {
			var results = [];
			var text = String(remoteData).replace('\r\n', '\n');
			var i, j, data, line, lines = text.split('\n');
			var value;
			for (i = 0; i < lines.length; i++) {
				line = lines[i].split('|');
				data = [];
				for (j = 0; j < line.length; j++) {
					data.push(unescape(line[j]));
				}
				value = data.shift();
				results.push({ value: unescape(value), data: data });
			}
			return results;
		};
		
		ac.filterAndShowResults = function(results, filter) {
			ac.showResults(ac.filterResults(results, filter), filter);
		};
		
		ac.filterResults = function(results, filter) {
			var filtered = [];
			var value, data, i, result, type;
			var regex, pattern, attributes = '';
			for (i = 0; i < results.length; i++) {
				result = results[i];
				type = typeof result;
				if (type === 'string') {
					value = result;
					data = {};
				} else if ($.isArray(result)) {
					value = result.shift();
					data = result;
				} else if (type === 'object') {
					value = result.value;
					data = result.data;
				}
				value = String(value);
				// Condition below means we do NOT do empty results
				if (value) {
					if (typeof data !== 'object') {
						data = {};
					}
					pattern = String(filter);
					if (!ac.options.matchInside) {
						pattern = '^' + pattern;
					}
					if (!ac.options.matchCase) {
						attributes = 'i';
					}
					regex = new RegExp(pattern, attributes);
					if (regex.test(value)) {
						filtered.push({ value: value, data: data });
					}					
				}
			}
			if (ac.options.sortResults) {
				return ac.sortResults(filtered);
			}
			return filtered;
		};
		
		ac.sortResults = function(results) {
			if ($.isFunction(ac.options.sortFunction)) {
				sortFunction = ac.options.sortFunction;
			} else {
				sortFunction = function(a, b) {
					a = String(a.value);
					b = String(b.value);
					if (!ac.options.matchCase) {
						a = a.toLowerCase();
						b = b.toLowerCase();
					}
					if (a > b) {
						return 1;
					}
					if (a < b) {
						return -1;
					}
					return 0;
				}
			}
			results.sort(sortFunction);
			return results;
		};
		
		ac.showResults = function(results, filter) {
			var $ul = $('<ul></ul>');
			var i, result, $li, extraWidth, first = false, $first = false;
			var numResults = results.length;
			for (i = 0; i < numResults; i++) {
				result = results[i];
				$li = $('<li>' + result.value + '</li>');
				$li.data('value', result.value);
				$li.data('data', result.data);
				$li.click(function() {
					var $this = $(this);
					ac.selectItem($this);
				}).mousedown(function() {
					dontBlur = true;
				}).mousedown(function() {
					dontBlur = false;
				});
				$ul.append($li);
				if (first === false) {
					first = String(result.value);
					$first = $li;
					$li.addClass('acFirst');
				}
				if (i == numResults - 1) {
					$li.addClass('acLast');
				}
			}
			ac.dom.$results.html($ul).show();
			extraWidth = ac.dom.$results.outerWidth() - ac.dom.$results.width();
			ac.dom.$results.width(ac.dom.$elem.outerWidth() - extraWidth);
			$('li', ac.dom.$results).hover(
				function() { ac.focusItem(this); },
				function() { /* void */ }
			);
			if (ac.autoFill(first, filter)) {
				ac.focusItem($first);
			}
		};
		
		ac.autoFill = function(value, filter) {
			var lcValue, lcFilter, valueLength, filterLength;
			if (ac.options.autoFill && lastKeyPressed != 8) {
				lcValue = String(value).toLowerCase();
				lcFilter = String(filter).toLowerCase();
				valueLength = value.length;
				filterLength = filter.length;
				if (lcValue.substr(0, filterLength) === lcFilter) {
					ac.dom.$elem.val(value);
					ac.selectRange(filterLength, valueLength);
					return true;
				}
			}
			return false;
		};
		
		ac.focusNext = function() {
			ac.focusMove(+1);
		};

		ac.focusPrev = function() {
			ac.focusMove(-1);
		};

		ac.focusMove = function(modifier) {
			var i, $items = $('li', ac.dom.$results);
			modifier = parseInt(modifier);
			for (var i = 0; i < $items.length; i++) {
				if ($($items[i]).hasClass(selectClass)) {
					ac.focusItem(i + modifier);
					return;
				}
			}
			ac.focusItem(0);
		};
		
		ac.focusItem = function(item) {
			var $item, $items = $('li', ac.dom.$results);
			if ($items.length) {
				$items.removeClass(selectClass).removeClass(ac.options.selectClass);
				if (typeof item === 'number') {
					item = parseInt(item);
					if (item < 0) {
						item = 0;
					} else if (item >= $items.length) {
						item = $items.length - 1;
					}
					$item = $($items[item]);
				} else {
					$item = $(item);
				}
				if ($item) {
					$item.addClass(selectClass).addClass(ac.options.selectClass);				
				}				
			}
		};
		
		ac.selectCurrent = function() {
			var $item = $('li.' + selectClass, ac.dom.$results);
			if ($item.length == 1) {
				ac.selectItem($item);				
			} else {
				ac.finish();
			}
		}
		
		ac.selectItem = function($li) {
			var value = $li.data('value');
			var data = $li.data('data');
			var displayValue = ac.displayValue(value, data);
			lastValueProcessed = displayValue;
			ac.lastSelectedValue(displayValue);
			ac.dom.$elem.val(displayValue).focus();
			ac.setCaret(displayValue.length);
			ac.callHook('onItemSelect', { value: value, data: data });
			ac.finish();
		};
		
		ac.lastSelectedValue = function(value) {
			if (arguments.length > 0) {
				ac.dom.$elem.data('acLastMatch', value);				
				return value;
			}
			return ac.dom.$elem.data('acLastMatch');			
		};
		
		ac.displayValue = function(value, data) {
			if ($.isFunction(ac.options.displayValue)) {
				return ac.options.displayValue(value, data);
			} else {
				return value;
			}			
		}
		
		ac.finish = function() {
			if (keyTimeout) {
				clearTimeout(keyTimeout);
			}
			if (ac.dom.$elem.val() !== ac.dom.$elem.data('acLastMatch')) {
				if (ac.options.mustMatch) {
					ac.dom.$elem.val('');					
				}
				ac.callHook('onNoMatch');
			}
			ac.dom.$results.hide();
			lastKeyPressed = false;
			lastValueProcessed = false;
			if (active) {
				ac.callHook('onFinish');
			}
			active = false;			
		};
		
		ac.active = function() {
			return active;
		};
		
		ac.selectRange = function(start, end) {
			var range, input = ac.dom.$elem[0];
			if (input.setSelectionRange) {
				input.focus();
				input.setSelectionRange(start, end);
			} else if (this.createTextRange) {
				range = this.createTextRange();
				range.collapse(true);
				range.moveEnd('character', end);
				range.moveStart('character', start);
				range.select();
			}
		};
		
		ac.setCaret = function(pos) {
			ac.selectRange(pos, pos);
		};
				
		return ac;
	};
	$.autocompleter = autocompleter;
	
	$.fn.autocomplete = function(options) {
		return this.each(function() {
			var autocompleter = $.autocompleter(options);
			autocompleter.bind(this);
		});
	};
	
	$.fn.autocomplete.defaults = {
		minChars: 1,
		loadingClass: 'acLoading',
		resultsClass: 'acResults',
		inputClass: 'acInput',
		selectClass: 'acSelect',
		mustMatch: false,
		matchCase: false,
		matchInside: true,
		matchSubset: true,
		useCache: true,
		maxCacheLength: 10,
		autoFill: false,
		sortResults: true,
		sortFunction: false,
		onItemSelect: false,
		onNoMatch: false,
	};
	
})(jQuery);