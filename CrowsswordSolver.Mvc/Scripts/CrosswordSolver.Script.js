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
	$CrosswordSolver_Script_$DataContext.$createPattern = function(patterns) {
		var anyCharRegexp = new RegExp(String.fromCharCode($CrosswordSolver_Script_$DataContext.$patternAnyChar), 'g');
		var request = new $CrosswordSolver_Script_PatternRequest();
		var otherPatterns = [];
		for (var $t1 = 0; $t1 < patterns.length; $t1++) {
			var pattern = patterns[$t1];
			var $t2 = new $CrosswordSolver_Script_OtherPattern();
			$t2.Pattern = pattern.pattern().replace(anyCharRegexp, '?');
			$t2.DX = pattern.DX();
			$t2.DY = pattern.DY();
			$t2.Direction = pattern.direction();
			ss.add(otherPatterns, $t2);
		}
		request.OtherPatterns = Array.prototype.slice.call(otherPatterns);
		return request;
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
		return $CrosswordSolver_Script_$DataContext.$ajaxRequest('POST', $CrosswordSolver_Script_$DataContext.$solveUrl(), ss.mkdict(['pattern', $CrosswordSolver_Script_$DataContext.$createPattern(viewModel.patterns()), 'searchAfterWord', searchAfterWord]), null).done(getSucceeded).fail(getFailed);
	};
	$CrosswordSolver_Script_$DataContext.$ajaxRequest = function(type, url, data, dataType) {
		var options = { dataType: ss.coalesce(dataType, 'json'), contentType: 'application/json', cache: false, type: type, data: JSON.stringify(data) };
		var antiForgeryToken = $('#antiForgeryToken').val();
		if (ss.isValue(antiForgeryToken)) {
			//options.Headers = {
			//    'RequestVerificationToken': antiForgeryToken
			//};
		}
		return $.ajax(url, options);
	};
	$CrosswordSolver_Script_$DataContext.$solveUrl = function() {
		return '/solve/post';
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
		ko.bindingHandlers['collapseShow'] = new $CrosswordSolver_Script_CollapseShowBindingHandler();
	};
	global.CrosswordSolver.Script.BindingHandlers = $CrosswordSolver_Script_BindingHandlers;
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.CollapseShowBindingHandler
	var $CrosswordSolver_Script_CollapseShowBindingHandler = function() {
		Object.call(this);
	};
	$CrosswordSolver_Script_CollapseShowBindingHandler.__typeName = 'CrosswordSolver.Script.CollapseShowBindingHandler';
	global.CrosswordSolver.Script.CollapseShowBindingHandler = $CrosswordSolver_Script_CollapseShowBindingHandler;
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.Direction
	var $CrosswordSolver_Script_Direction = function() {
	};
	$CrosswordSolver_Script_Direction.__typeName = 'CrosswordSolver.Script.Direction';
	global.CrosswordSolver.Script.Direction = $CrosswordSolver_Script_Direction;
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.ListViewModel
	var $CrosswordSolver_Script_ListViewModel = function() {
		this.error = ko.observable();
		this.matches = ko.observableArray();
		this.hasSearched = ko.observable(false);
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
		if (ss.referenceEquals(input.value, newVal)) {
			return;
		}
		var selectionStart = input.selectionStart;
		var selectionEnd = input.selectionEnd;
		input.value = newVal;
		if (triggerChange) {
			$(input).change();
		}
		input.setSelectionRange(selectionStart, selectionEnd);
	};
	$CrosswordSolver_Script_NumLetterMaskBindingHandler.$deleteCharacterAtCurrentPosition = function(input, replacementString) {
		var cursorPosition = input.selectionStart;
		if (cursorPosition >= input.maxLength) {
			cursorPosition = input.maxLength - 1;
		}
		$CrosswordSolver_Script_NumLetterMaskBindingHandler.$updateValFixedCursor(input, input.value.substr(0, cursorPosition) + replacementString + input.value.substr(cursorPosition + 1), false);
	};
	$CrosswordSolver_Script_NumLetterMaskBindingHandler.$keyDown = function(ev, inputElement) {
		if (ev.which === 8) {
			ev.preventDefault();
			inputElement.selectionStart--;
			inputElement.selectionEnd = inputElement.selectionStart;
			$CrosswordSolver_Script_NumLetterMaskBindingHandler.$deleteCharacterAtCurrentPosition(inputElement, String.fromCharCode($CrosswordSolver_Script_$DataContext.$patternAnyChar));
		}
	};
	$CrosswordSolver_Script_NumLetterMaskBindingHandler.$keyPress = function(ev, inputElement) {
		var c = String.fromCharCode(ev.which).toUpperCase().charCodeAt(0);
		if (c >= 65 && c <= 90 || c === 197 || c === 196 || c === 214) {
			$CrosswordSolver_Script_NumLetterMaskBindingHandler.$deleteCharacterAtCurrentPosition(inputElement, '');
		}
		else {
			ev.preventDefault();
		}
	};
	$CrosswordSolver_Script_NumLetterMaskBindingHandler.$keyUp = function(inputElement) {
		var toUpperCase = ss.replaceAllString($(inputElement).val(), String.fromCharCode(32), String.fromCharCode($CrosswordSolver_Script_$DataContext.$patternAnyChar)).toUpperCase();
		$CrosswordSolver_Script_NumLetterMaskBindingHandler.$updateValFixedCursor(inputElement, toUpperCase, true);
	};
	global.CrosswordSolver.Script.NumLetterMaskBindingHandler = $CrosswordSolver_Script_NumLetterMaskBindingHandler;
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.OtherPattern
	var $CrosswordSolver_Script_OtherPattern = function() {
		this.Direction = 0;
		this.DX = 0;
		this.DY = 0;
		this.Pattern = null;
	};
	$CrosswordSolver_Script_OtherPattern.__typeName = 'CrosswordSolver.Script.OtherPattern';
	global.CrosswordSolver.Script.OtherPattern = $CrosswordSolver_Script_OtherPattern;
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.PatternRequest
	var $CrosswordSolver_Script_PatternRequest = function() {
		this.Test = 0;
		this.OtherPatterns = null;
		this.Test = 1;
	};
	$CrosswordSolver_Script_PatternRequest.__typeName = 'CrosswordSolver.Script.PatternRequest';
	global.CrosswordSolver.Script.PatternRequest = $CrosswordSolver_Script_PatternRequest;
	////////////////////////////////////////////////////////////////////////////////
	// CrosswordSolver.Script.PatternViewModel
	var $CrosswordSolver_Script_PatternViewModel = function() {
		this.pattern = ko.observable('');
		this.numLetters = ko.observable(1);
		this.direction = ko.observable(0);
		this.DX = ko.observable(0);
		this.DY = ko.observable(0);
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
	ss.initClass($CrosswordSolver_Script_CollapseShowBindingHandler, $asm, {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			if (ss.unbox(ss.cast(valueAccessor(), Boolean))) {
				$(element).collapse(ss.mkdict(['toggle', false]));
				var isFirstCollapse = false;
				if (isFirstCollapse) {
					$(element).addClass('in');
				}
				else {
					window.setTimeout(function() {
						$(element).collapse('show');
					});
				}
			}
			return null;
		}
	}, Object);
	ss.initEnum($CrosswordSolver_Script_Direction, $asm, { right: 0, down: 1 });
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
				this.hasSearched(true);
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
		},
		addPattern: function() {
			this.patterns.push(new $CrosswordSolver_Script_PatternViewModel());
		}
	});
	ss.initClass($CrosswordSolver_Script_MatchViewModel, $asm, {});
	ss.initClass($CrosswordSolver_Script_NumLetterMaskBindingHandler, $asm, {
		init: function(elem, valueAccessor, allBindingsAccessor, viewModel) {
			var inputElement = ss.cast(elem, ss.isValue(elem) && (ss.isInstanceOfType(elem, Element) && elem.tagName === 'INPUT'));
			$(elem).keypress(function(ev) {
				$CrosswordSolver_Script_NumLetterMaskBindingHandler.$keyPress(ev, inputElement);
			});
			$(elem).keyup(function(ev1) {
				$CrosswordSolver_Script_NumLetterMaskBindingHandler.$keyUp(inputElement);
			});
			$(elem).keydown(function(ev2) {
				$CrosswordSolver_Script_NumLetterMaskBindingHandler.$keyDown(ev2, inputElement);
			});
			return null;
		},
		update: function(elem, valueAccessor, allBindingsAccessor, viewModel) {
			var inputElement = ss.cast(elem, ss.isValue(elem) && (ss.isInstanceOfType(elem, Element) && elem.tagName === 'INPUT'));
			var numLetters = ss.unbox(ss.cast(valueAccessor(), ss.Int32));
			$(elem).attr('maxlength', numLetters.toString());
			var pos = inputElement.selectionStart;
			$(elem).val(ss.padRightString($(elem).val(), numLetters, $CrosswordSolver_Script_$DataContext.$patternAnyChar).substr(0, numLetters));
			$(elem).change().focus();
			inputElement.selectionStart = pos;
			inputElement.selectionEnd = pos;
			//inputElement.SetSelectionRange(pos, pos);
		}
	}, Object);
	ss.initClass($CrosswordSolver_Script_OtherPattern, $asm, {});
	ss.initClass($CrosswordSolver_Script_PatternRequest, $asm, {});
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
				if ($(element).is(':visible') && $CrosswordSolver_Script_WhenVisibleBindingHandler.$isScrolledIntoView(element)) {
					ss.cast(valueAccessor(), Function)();
				}
			});
			return null;
		}
	}, Object);
	$CrosswordSolver_Script_$DataContext.$patternAnyChar = 9723;
	$CrosswordSolver_Script_$Program.$main();
})();
