/// <reference types='lunr' />

declare namespace typedoc.search
{
    interface IDocument {
        id:number;
        kind:number;
        name:string;
        url:string;
        classes:string;
        parent?:string;
    }

    interface IData {
        kinds:{[kind:number]:string};
        rows:IDocument[];
    }

    var data:IData;
}


namespace typedoc.search
{
    /**
     * Loading state definitions.
     */
    enum SearchLoadingState
    {
        Idle, Loading, Ready, Failure
    }


    /**
     * The element holding the search widget and results.
     */
    var $el:JQuery = $('#tsd-search');

    /**
     * The input field of the search widget.
     */
    var $field:JQuery = $('#tsd-search-field');

    /**
     * The result list wrapper.
     */
    var $results:JQuery = $('.results');

    /**
     * The base url that must be prepended to the indexed urls.
     */
    var base:string = $el.attr('data-base') + '/';

    /**
     * The current query string.
     */
    var query:string = '';

    /**
     * The state the search is currently in.
     */
    var loadingState:SearchLoadingState = SearchLoadingState.Idle;

    /**
     * Is the input field focused?
     */
    var hasFocus:boolean = false;

    /**
     * Should the next key press be prevents?
     */
    var preventPress:boolean = false;

    /**
     * The lunr index used to search the documentation.
     */
    var index:lunr.Index;

    /**
     * Has a search result been clicked?
     * Used to stop the results hiding before a user can fully click on a result.
     */
    var resultClicked:boolean = false;


    /**
     * Instantiate the lunr index.
     */
    function createIndex() {
        var builder = new lunr.Builder();
        builder.pipeline.add(
            lunr.trimmer
        );

        builder.field('name', {boost:10});
        builder.field('parent');
        builder.ref('id');

        var rows   = data.rows;
        var pos    = 0;
        var length = rows.length;
        function batch() {
            var cycles = 0;
            while (cycles++ < 100) {
                builder.add(rows[pos]);
                if (++pos == length) {
                    index = builder.build();
                    return setLoadingState(SearchLoadingState.Ready);
                }
            }
            setTimeout(batch, 10);
        }

        batch();
    }


    /**
     * Lazy load the search index and parse it.
     */
    function loadIndex() {
        if (loadingState != SearchLoadingState.Idle) return;
        setTimeout(() => {
            if (loadingState == SearchLoadingState.Idle) {
                setLoadingState(SearchLoadingState.Loading);
            }
        }, 500);

        if (typeof data != 'undefined') {
            createIndex();
        } else {
            $.get($el.attr('data-index'))
                .done((source:string) => {
                    eval(source);
                    createIndex();
                }).fail(() => {
                    setLoadingState(SearchLoadingState.Failure);
                });
        }
    }


    /**
     * Update the visible state of the search control.
     */
    function updateResults() {
        $results.empty();
        if (loadingState != SearchLoadingState.Ready || !query) return;

        // Perform a wildcard search
        var res = index.search(`*${query}*`);

        // If still no results, try a fuzzy match search
        if(res.length === 0) {
            res = index.search(`*${query}~1*`);
        }

        for (var i = 0, c = Math.min(10, res.length); i < c; i++) {
            var row = data.rows[Number(res[i].ref)];

            // Bold the matched part of the query in the search results
            var name = row.name.replace(new RegExp(query, 'i'), (match: string) => `<b>${match}</b>`);
            var parent = row.parent || '';
            parent = parent.replace(new RegExp(query, 'i'), (match: string) => `<b>${match}</b>`);

            if (parent) name = '<span class="parent">' + parent + '.</span>' + name;
            $results.append('<li class="' + row.classes + '"><a href="' + base + row.url + '" class="tsd-kind-icon">' + name + '</li>');
        }
    }


    /**
     * Set the loading state and update the visual state accordingly.
     */
    function setLoadingState(value:SearchLoadingState) {
        if (loadingState == value) return;

        $el.removeClass(SearchLoadingState[loadingState].toLowerCase());
        loadingState = value;
        $el.addClass(SearchLoadingState[loadingState].toLowerCase());

        if (value == SearchLoadingState.Ready) {
            updateResults();
        }
    }


    /**
     * Set the focus state and update the visual state accordingly.
     */
    function setHasFocus(value:boolean) {
        if (hasFocus == value) return;
        hasFocus = value;
        $el.toggleClass('has-focus');

        if (!value) {
            $field.val(query);
        } else {
            setQuery('');
            $field.val('');
        }
    }


    /**
     * Set the query string and update the results.
     */
    function setQuery(value:string) {
        query = $.trim(value);
        updateResults();
    }


    /**
     * Move the highlight within the result set.
     */
    function setCurrentResult(dir:number) {
        var $current = $results.find('.current');
        if ($current.length == 0) {
            $results.find(dir == 1 ? 'li:first-child' : 'li:last-child').addClass('current');
        } else {
            var $rel = dir == 1 ? $current.next('li') : $current.prev('li');
            if ($rel.length > 0) {
                $current.removeClass('current');
                $rel.addClass('current');
            }
        }
    }


    /**
     * Navigate to the highlighted result.
     */
    function gotoCurrentResult() {
        var $current = $results.find('.current');

        if ($current.length == 0) {
            $current = $results.find('li:first-child');
        }

        if ($current.length > 0) {
            window.location.href = $current.find('a').prop('href');
            $field.blur();
        }
    }

    /**
     * Intercept mousedown and mouseup events so we can correctly
     * handle clicking on search results
     */
    $results
    .on('mousedown', () => {
        resultClicked = true;
    })
    .on('mouseup', () => {
        resultClicked = false;
        setHasFocus(false);
    });


    /**
     * Bind all required events on the input field.
     */
    $field.on('focusin', () => {
        setHasFocus(true);
        loadIndex();
    }).on('focusout', () => {
        // If the user just clicked on a search result, then
        // don't lose the focus straight away, as this prevents
        // them from clicking the result and following the link
        if(resultClicked) {
            resultClicked = false;
            return;
        }

        setTimeout(() => setHasFocus(false), 100);
    }).on('input', () => {
        setQuery($.trim(($field.val() || '').toString()));
    }).on('keydown', (e:JQueryKeyEventObject) => {
        if (e.keyCode == 13 || e.keyCode == 27 || e.keyCode == 38 || e.keyCode == 40) {
            preventPress = true;
            e.preventDefault();

            if (e.keyCode == 13) {
                gotoCurrentResult();
            } else if (e.keyCode == 27) {
                $field.blur();
            } else if (e.keyCode == 38) {
                setCurrentResult(-1);
            } else if (e.keyCode == 40) {
                setCurrentResult(1);
            }
        } else {
            preventPress = false;
        }
    }).on('keypress', (e) => {
        if (preventPress) e.preventDefault();
    });


    /**
     * Start searching by pressing a key on the body.
     */
    $('body').on('keydown', (e:JQueryKeyEventObject) => {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        if (!hasFocus && e.keyCode > 47 && e.keyCode < 112) {
            $field.focus();
        }
    });
}
