// ==UserScript==
// @name         Win-Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Infinite scroll in the search page. Keep 'em results coming
// @author       Bubble_Bursts
// @match        https://*.win/search*
// @match        https://*.win/u/*
// @match        https://*.win/logs*
// @match        https://*.win/p/*
// @match        https://*.win/submit*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// ==/UserScript==

(function() {
    'use strict';
    var thisurl = new URL(window.location.href)
    var page = thisurl.pathname.split('/')[1]
	const AUTOSCROLL_DELAY = 3000
	
    // For /logs page
    var logs_modnames = {}
    var $logs_modsel

    console.log("Page", page)

    function execute_filter() {
        console.log('exec filter')
        setTimeout(filter_fn, 200)
    }

    /* River of posts */
    // Pathname == '/search'
    var marker_tag = "div.more"
    var newnext_tag = "div.more a:contains(Next)"
    var entity_tag = ".post-list .post"
    var get_dataid_fn = function($this) {
        return $this.attr("data-id")
    }
    var get_inserter_fn = function($this) {
        return $this.parent()
    }
    var filter_fn = function() {
        // do nothing
    }
    var init_page = function() {
    }

    if (page == 'u') {
        var urltype = thisurl.searchParams.get("type")

        if (urltype == "post") {
            entity_tag = ".main-content .post-list"
        } else {
            entity_tag = ".main-content .comment-list"
        }
        get_dataid_fn = function($this) {
            return $this.find('[data-id]').attr("data-id")
        }
        get_inserter_fn = function($this) {
            return $this
        }
    } else if (page == 'logs') {
        $logs_modsel = $("<select><option name='all'>All</option></select>")
        $logs_modsel.on('change', execute_filter)

		// Auto load button
        var intervalId = 0
        var $autoload = $("<button>Auto Load</button>")
        $autoload.on('click', function() {
            if (intervalId) {
                clearInterval(intervalId)
                intervalId = 0
                $autoload.html("Auto Load")
            } else {
                $(document).scrollTop($(document).height());
                intervalId = setInterval(function() {
                    $(document).scrollTop($(document).height());
                }, AUTOSCROLL_DELAY)
                $autoload.html("Cancel Auto Load")
            }
        })

        $(".main-content").prepend($autoload)
        $(".main-content").prepend($logs_modsel)

        entity_tag = ".log-list .log"

        get_dataid_fn = function($this) {
            // No data id for logs, duplicate entries might show up
            return "no-data-id"
        }
        get_inserter_fn = function($this) {
            var mod = $($this.find("b span")).html()
            if (mod) {
                $this.attr("modname", mod)
                logs_modnames[mod] = mod
                var $found = $logs_modsel.find(`option[name="${mod}"]`)
                if (!$found.length) {
                    $logs_modsel.append($(`<option name="${mod}">${mod}</option>`))
                }
            }
            return $this
        }

        filter_fn = function() {
            var $posts = $(entity_tag)
            var selmod = $logs_modsel.val()
            if (selmod == "All") {
                return
            }

            console.log(selmod)
            $posts.show()
            $(`.log-list .log[modname!=${selmod}]`).hide()
        }

        init_page = function() {
            var $posts = $(entity_tag)
            $posts.each(function() {
                get_inserter_fn($(this))
            })
        }
    }

    var $marker = $(marker_tag)
    //var $next = $("div.more a")
    function handleSuccess(data, status, xhr) {
        var $data = $(data)
        var $posts = $(entity_tag, $data)
        console.log("New entries", $posts.length)
        $posts.each(function() {
            var $this = $(this)
            var dataid = get_dataid_fn($this)
            var $found = $(`[data-id="${dataid}"]`)
            if ($found.length == 0) {
                var $new = get_inserter_fn($this)
                $marker.before($new)
            }
        })

        execute_filter()
        //$data.remove("div.more a:first-child")
        //console.log($("div.more", $data))
        var $newnext = $(newnext_tag, $data)
        $marker.html("").append($newnext)
    }

    function handleError(xhr, status, error) {
        console.log("Get Error", status, error)
    }

    const mainUrl = window.location.href
    var observer = new IntersectionObserver(function(entries) {
        // isIntersecting is true when element and viewport are overlapping
        // isIntersecting is false when element and viewport don't overlap
        if(entries[0].isIntersecting === true) {
            var nhref = $("a:contains(Next)", entries[0].target).attr('href')
            if (!nhref) {
                return
            }

            var nexturl = new URL(nhref, mainUrl)
            console.log(nexturl.href)

            var request = {url: nexturl.href}
            request['success'] = handleSuccess
            request['error'] = handleError
            $.get(request)
        } else {
            console.log("Not intersecting")
        }
    }, { threshold: [0] });

    if ($marker.length > 0) {
        observer.observe($marker[0]);
    }

    init_page()
})();
