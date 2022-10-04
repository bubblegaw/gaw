// ==UserScript==
// @name         Win-Mod-Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Infinite scroll in the modmail. Keep 'em results coming
// @author       Bubble_Bursts
// @match        https://*.win/modmail*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var $marker = $("div.next")

    function handleSuccess(data, status, xhr) {
        console.log("Get Success")
        var $data = $(data)
        var $posts = $(".main .mail", $data)
        console.log($posts.length)
        $posts.each(function() {
            var $this = $(this)
            var dataid = $this.find("div[data-id]").attr("data-id")
            var $found = $(`[data-id="${dataid}"]`)
            if ($found.length == 0) {
                console.log("New Data id", dataid)
                $marker.parent().before($this)
            } else {
                console.log("Existing Data id", dataid)
            }
        })
        //$data.remove("div.more a:first-child")
        //console.log($("div.more", $data))
        var $newnext = $("div.next a:contains(More)", $data)
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
            var nhref = $("a:contains(More)", entries[0].target).attr('href')
            if (!nhref) {
                console.log("Next link not found", entries[0])
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
