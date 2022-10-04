// ==UserScript==
// @name         Win-Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Infinite scroll in the search page. Keep 'em results coming
// @author       Bubble_Bursts
// @match        https://*.win/search*
// @match        https://*.win/u/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var thisurl = new URL(window.location.href)

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
    if (thisurl.pathname.substring(0,2) == '/u') {
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
                $marker.before(get_inserter_fn($this))
            }
        })
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
        }
    }, { threshold: [0] });

    if ($marker.length > 0) {
        observer.observe($marker[0]);
    }
})();
