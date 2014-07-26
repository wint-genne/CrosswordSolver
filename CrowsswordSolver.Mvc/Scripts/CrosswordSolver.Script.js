(function() {
	'use strict';
	var $asm = {};
	global.CrosswordSolver = global.CrosswordSolver || {};
	global.CrosswordSolver.Script = global.CrosswordSolver.Script || {};
	ss.initAssembly($asm, 'CrosswordSolver.Script');
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.DataContext
	var $CrosswordSolver_Script_$DataContext = function() {
	};
	$CrosswordSolver_Script_$DataContext.__typeName = 'CrosswordSolver.Script.$DataContext';
	$CrosswordSolver_Script_$DataContext.$createPattern = function(pattern) {
		var oldText = new RegExp(String.fromCharCode($CrosswordSolver_Script_$DataContext.$patternAnyChar));
		return pattern.replace(oldText, '?');
	};
	$CrosswordSolver_Script_$DataContext.$search = function(viewModel, reset) {
		var getSucceeded = function(data) {
			var mappedMatches = Enumerable.from(ss.safeCast(data, Array)).select(function(match) {
				return new $CrosswordSolver_Script_MatchViewModel(match);
			}).toArray();
			if (reset) {
				viewModel.matches.removeAll();
			}
			for (var $t1 = 0; $t1 < mappedMatches.length; $t1++) {
				var m = mappedMatches[$t1];
				viewModel.matches.push(m);
			}
			viewModel.hasMore(mappedMatches.length === 10);
			viewModel.error(null);
		};
		var getFailed = function() {
			viewModel.error('Error retrieving todo lists.');
		};
		var searchAfterWord = null;
		if (!reset) {
			searchAfterWord = Enumerable.from(viewModel.matches()).last().word;
		}
		return $CrosswordSolver_Script_$DataContext.$ajaxRequest('get', $CrosswordSolver_Script_$DataContext.$solveUrl(), ss.mkdict(['pattern', $CrosswordSolver_Script_$DataContext.$createPattern(viewModel.patterns()[0].pattern()), 'searchAfterWord', searchAfterWord]), null).done(getSucceeded).fail(getFailed);
	};
	$CrosswordSolver_Script_$DataContext.$ajaxRequest = function(type, url, data, dataType) {
		var options = { dataType: ss.coalesce(dataType, 'json'), contentType: 'application/json', cache: false, type: type, data: data };
		var antiForgeryToken = $('#antiForgeryToken').val();
		if (ss.isValue(antiForgeryToken)) {
			//options.Headers = {
			//    'RequestVerificationToken': antiForgeryToken
			//};
		}
		return $.ajax(url, options);
	};
	$CrosswordSolver_Script_$DataContext.$solveUrl = function() {
		return '/api/solve';
	};
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.Program
	var $CrosswordSolver_Script_$Program = function() {
	};
	$CrosswordSolver_Script_$Program.__typeName = 'CrosswordSolver.Script.$Program';
	$CrosswordSolver_Script_$Program.$main = function() {
		$CrosswordSolver_Script_BindingHandlers.setup();
		ko.applyBindings(new $CrosswordSolver_Script_ListViewModel());
	};
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.BindingHandlers
	var $CrosswordSolver_Script_BindingHandlers = function() {
	};
	$CrosswordSolver_Script_BindingHandlers.__typeName = 'CrosswordSolver.Script.BindingHandlers';
	$CrosswordSolver_Script_BindingHandlers.setup = function() {
		ko.bindingHandlers['scrollTo'] = new $CrosswordSolver_Script_ScrollToBindingHandler();
		ko.bindingHandlers['whenVisible'] = new $CrosswordSolver_Script_WhenVisibleBindingHandler();
		ko.bindingHandlers['numLetterMask'] = new $CrosswordSolver_Script_NumLetterMaskBindingHandler();
	};
	global.CrosswordSolver.Script.BindingHandlers = $CrosswordSolver_Script_BindingHandlers;
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.ListViewModel
	var $CrosswordSolver_Script_ListViewModel = function() {
		this.error = ko.observable();
		this.matches = ko.observableArray();
		this.shortcuts = ko.observableArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
		this.previousPatterns = ko.observableArray($CrosswordSolver_Script_ListViewModel.$readPreviousPatterns());
		this.patterns = ko.observableArray([new $CrosswordSolver_Script_PatternViewModel()]);
		this.searched = ko.observable(false);
		this.hasMore = ko.observable(false);
	};
	$CrosswordSolver_Script_ListViewModel.__typeName = 'CrosswordSolver.Script.ListViewModel';
	$CrosswordSolver_Script_ListViewModel.$readPreviousPatterns = function() {
		var patternsString = ss.coalesce(window.localStorage.getItem('previousPatterns'), '');
		return ((patternsString !== '') ? patternsString.split(',') : []);
	};
	global.CrosswordSolver.Script.ListViewModel = $CrosswordSolver_Script_ListViewModel;
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.MatchViewModel
	var $CrosswordSolver_Script_MatchViewModel = function(match) {
		this.word = null;
		this.googleUrl = null;
		this.wikipediaUrl = null;
		this.word = ss.cast(match, String);
		this.googleUrl = 'https://www.google.se/search?q=' + this.word;
		this.wikipediaUrl = 'http://sv.wikipedia.org/wiki/' + this.word;
	};
	$CrosswordSolver_Script_MatchViewModel.__typeName = 'CrosswordSolver.Script.MatchViewModel';
	global.CrosswordSolver.Script.MatchViewModel = $CrosswordSolver_Script_MatchViewModel;
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.NumLetterMaskBindingHandler
	var $CrosswordSolver_Script_NumLetterMaskBindingHandler = function() {
		Object.call(this);
	};
	$CrosswordSolver_Script_NumLetterMaskBindingHandler.__typeName = 'CrosswordSolver.Script.NumLetterMaskBindingHandler';
	$CrosswordSolver_Script_NumLetterMaskBindingHandler.$updateValFixedCursor = function(input, newVal, triggerChange) {
		var cursorPosition = input.selectionStart;
		input.value = newVal;
		if (triggerChange) {
			$(input).change();
		}
		input.setSelectionRange(cursorPosition, cursorPosition);
	};
	$CrosswordSolver_Script_NumLetterMaskBindingHandler.$deleteCharacterAtCurrentPosition = function(input) {
		var cursorPosition = input.selectionStart;
		$CrosswordSolver_Script_NumLetterMaskBindingHandler.$updateValFixedCursor(input, input.value.substr(0, cursorPosition) + input.value.substr(cursorPosition + 1), false);
	};
	global.CrosswordSolver.Script.NumLetterMaskBindingHandler = $CrosswordSolver_Script_NumLetterMaskBindingHandler;
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.PatternViewModel
	var $CrosswordSolver_Script_PatternViewModel = function() {
		this.pattern = ko.observable('');
		this.numLetters = ko.observable(1);
	};
	$CrosswordSolver_Script_PatternViewModel.__typeName = 'CrosswordSolver.Script.PatternViewModel';
	global.CrosswordSolver.Script.PatternViewModel = $CrosswordSolver_Script_PatternViewModel;
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.ScrollToBindingHandler
	var $CrosswordSolver_Script_ScrollToBindingHandler = function() {
		Object.call(this);
	};
	$CrosswordSolver_Script_ScrollToBindingHandler.__typeName = 'CrosswordSolver.Script.ScrollToBindingHandler';
	global.CrosswordSolver.Script.ScrollToBindingHandler = $CrosswordSolver_Script_ScrollToBindingHandler;
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.StringUtils
	var $CrosswordSolver_Script_StringUtils = function() {
	};
	$CrosswordSolver_Script_StringUtils.__typeName = 'CrosswordSolver.Script.StringUtils';
	$CrosswordSolver_Script_StringUtils.padRight = function(str, num, chr) {
		if (str.length > num) {
			return str.substr(0, num);
		}
		for (var i = str.length; i < num; i++) {
			str += String.fromCharCode(chr);
		}
		return str;
	};
	global.CrosswordSolver.Script.StringUtils = $CrosswordSolver_Script_StringUtils;
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.WhenVisibleBindingHandler
	var $CrosswordSolver_Script_WhenVisibleBindingHandler = function() {
		Object.call(this);
	};
	$CrosswordSolver_Script_WhenVisibleBindingHandler.__typeName = 'CrosswordSolver.Script.WhenVisibleBindingHandler';
	$CrosswordSolver_Script_WhenVisibleBindingHandler.$isScrolledIntoView = function(elem) {
		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();
		var elemTop = $(elem).offset().top;
		var elemBottom = elemTop + $(elem).height();
		return elemBottom >= docViewTop && elemTop <= docViewBottom && elemBottom <= docViewBottom && elemTop >= docViewTop;
	};
	global.CrosswordSolver.Script.WhenVisibleBindingHandler = $CrosswordSolver_Script_WhenVisibleBindingHandler;
	ss.initClass($CrosswordSolver_Script_$DataContext, $asm, {});
	ss.initClass($CrosswordSolver_Script_$Program, $asm, {});
	ss.initClass($CrosswordSolver_Script_BindingHandlers, $asm, {});
	ss.initClass($CrosswordSolver_Script_ListViewModel, $asm, {
		$addToPreviousPattern: function() {
			var patternVal = ss.arrayFromEnumerable(Enumerable.from(this.patterns()).select(function(p) {
				return p.pattern();
			})).join(' ');
			if (patternVal === '') {
				return;
			}
			var patterns = ss.arrayClone($CrosswordSolver_Script_ListViewModel.$readPreviousPatterns());
			if (ss.indexOf(patterns, patternVal) !== -1) {
				return;
			}
			ss.add(patterns, patternVal);
			while (patterns.length > 16) {
				ss.removeAt(patterns, 16);
			}
			this.previousPatterns(Array.prototype.slice.call(patterns));
			window.localStorage.setItem('previousPatterns', ss.arrayFromEnumerable(patterns).join(','));
		},
		search: function() {
			this.$addToPreviousPattern();
			var addSucceeded = ss.mkdel(this, function() {
				this.searched(true);
				this.searched(false);
			});
			var addFailed = ss.mkdel(this, function() {
				this.error('Något gick fel...');
			});
			$CrosswordSolver_Script_$DataContext.$search(this, true).done(addSucceeded).fail(addFailed);
		},
		loadMore: function() {
			this.hasMore(false);
			$CrosswordSolver_Script_$DataContext.$search(this, false).fail(ss.mkdel(this, function() {
				this.error('Något gick fel...');
				null;
			}));
		}
	});
	ss.initClass($CrosswordSolver_Script_MatchViewModel, $asm, {});
	ss.initClass($CrosswordSolver_Script_NumLetterMaskBindingHandler, $asm, {
		update: function(elem, valueAccessor, allBindingsAccessor, viewModel) {
			var inputElement = ss.cast(elem, ss.isValue(elem) && (ss.isInstanceOfType(elem, Element) && elem.tagName === 'INPUT'));
			$(elem).unbind('keypress').bind('keypress', function(ev) {
				$CrosswordSolver_Script_NumLetterMaskBindingHandler.$deleteCharacterAtCurrentPosition(inputElement);
			});
			$(elem).unbind('keyup').bind('keyup', function(ev1) {
				var toUpperCase = ss.replaceAllString($(elem).val(), String.fromCharCode(32), String.fromCharCode($CrosswordSolver_Script_$DataContext.$patternAnyChar)).toUpperCase();
				$CrosswordSolver_Script_NumLetterMaskBindingHandler.$updateValFixedCursor(inputElement, toUpperCase, true);
			});
			var val = ss.unbox(ss.cast(valueAccessor(), ss.Int32));
			$(elem).attr('maxlength', val.toString());
			var pos = inputElement.selectionStart;
			$(elem).val(ss.padRightString($(elem).val(), val, $CrosswordSolver_Script_$DataContext.$patternAnyChar));
			$(elem).change().focus();
			inputElement.setSelectionRange(pos, pos);
		}
	}, Object);
	ss.initClass($CrosswordSolver_Script_PatternViewModel, $asm, {
		clearPattern: function() {
			this.pattern('');
		}
	});
	ss.initClass($CrosswordSolver_Script_ScrollToBindingHandler, $asm, {
		update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			if (ss.unbox(ss.cast(valueAccessor(), Boolean))) {
				$('html, body').animate(ss.mkdict(['scrollTop', $(element).offset().top]));
			}
		}
	}, Object);
	ss.initClass($CrosswordSolver_Script_StringUtils, $asm, {});
	ss.initClass($CrosswordSolver_Script_WhenVisibleBindingHandler, $asm, {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			$(window).scroll(function(event) {
				if ($CrosswordSolver_Script_WhenVisibleBindingHandler.$isScrolledIntoView(element)) {
					ss.cast(valueAccessor(), Function)();
				}
			});
			return null;
		}
	}, Object);
	$CrosswordSolver_Script_$DataContext.$patternAnyChar = 9723;
	$CrosswordSolver_Script_$Program.$main();
})();
