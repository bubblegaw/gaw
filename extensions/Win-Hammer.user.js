// ==UserScript==
// @name         Win-Hammer
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Mod's buddy in helping bring the hammer down on new-shills.
// @author       Bubble_Bursts
// @match        https://*.win/users*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// ==/UserScript==

const hammer_styles = `
<style>
   .hammer-controls {
       font-size: 75%
   }
   .hide-banned .banned,
   .hamb-hidden {
       display: none; 
   }
</style>
`

const template1 = `
<div class="post" data-type="comment" data-id="12345678" data-author="%USER%">
<div class="details">
<input type="checkbox" id="banlist" value="%USER%"></checkbox>
<span class="since"><a href="/u/%USER%/" class="user-profile">%USER%</a></span>
<a data-action="history" title="user history" href="javascript:void(0);"><svg class="svg-inline--fa fa-user fa-w-14" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg><!-- <i class="fa fa-user"></i> --></a>
<a data-action="ban" title="ban user" href="javascript:void(0);"><svg class="svg-inline--fa fa-gavel fa-w-16" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="gavel" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504.971 199.362l-22.627-22.627c-9.373-9.373-24.569-9.373-33.941 0l-5.657 5.657L329.608 69.255l5.657-5.657c9.373-9.373 9.373-24.569 0-33.941L312.638 7.029c-9.373-9.373-24.569-9.373-33.941 0L154.246 131.48c-9.373 9.373-9.373 24.569 0 33.941l22.627 22.627c9.373 9.373 24.569 9.373 33.941 0l5.657-5.657 39.598 39.598-81.04 81.04-5.657-5.657c-12.497-12.497-32.758-12.497-45.255 0L9.373 412.118c-12.497 12.497-12.497 32.758 0 45.255l45.255 45.255c12.497 12.497 32.758 12.497 45.255 0l114.745-114.745c12.497-12.497 12.497-32.758 0-45.255l-5.657-5.657 81.04-81.04 39.598 39.598-5.657 5.657c-9.373 9.373-9.373 24.569 0 33.941l22.627 22.627c9.373 9.373 24.569 9.373 33.941 0l124.451-124.451c9.372-9.372 9.372-24.568 0-33.941z"></path></svg><!-- <i class="fa fa-gavel"></i> --></a>
<a data-action="notes" title="user notes" href="javascript:void(0);"><svg class="svg-inline--fa fa-clipboard fa-w-12" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="clipboard" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M384 112v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h80c0-35.29 28.71-64 64-64s64 28.71 64 64h80c26.51 0 48 21.49 48 48zM192 40c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24m96 114v-20a6 6 0 0 0-6-6H102a6 6 0 0 0-6 6v20a6 6 0 0 0 6 6h180a6 6 0 0 0 6-6z"></path></svg><!-- <i class="fa fa-clipboard"></i> --></a>
<a data-action="message" title="mod message" href="javascript:void(0);"><svg class="svg-inline--fa fa-reply fa-w-16" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="reply" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z"></path></svg><!-- <i class="fa fa-reply"></i> --></a>
</div><br/>
</div>
`

const display_template = `
<div class="nav-mid" style="padding: 12px; color:white; vertical-align: middle">
    <span><span class="hamb_newregs">0</span> new registrations</span> |
    <span><span class="hamb_dupips">0</span> duplicate IPs</span> |
    Refresh Interval:
    <select name="hamb_interval">
    <option value="1">1 min</option>
    <option value="5">5 mins</option>
    <option value="30">30 mins</option>
    <option value="60">1 hour</option>
    </select>
</div>
`

const status_template = `<div class="hammer-controls"><div id="hamb_status" title="HammerFren ready" style="float:left; height: 40px; width: 20px; background: green">&nbsp;</div> |
Ban message:
<select name="hamb_banmsgs">
<option value="You are now permanently banned">You are now permanently banned</option>
</select>
<a href="#" class="link" id="hamb_addmsg">add</a> |
<a href="#" class="link" id="hamb_delmsg">remove</a> |
<input type=checkbox id="hamb_nuke" name="hamb_nuke" value="on">Nuke</input>
<input type=checkbox id="hamb_ipban" name="hamb_ipban"  value="on">IP Ban</input>
<a id="hamb_turboban" class="link" href="#" style="color:red">Turbo Ban</a> |
<span class="hamb_banned" style="cursor:pointer;color:blue">Hide banned</span>
<br/>
<input type=checkbox id="hamb_all" name="hamb_all" value="off">All users</input>
<span class="hamb_clearall" style="cursor:pointer;color:blue">Clear all</span>

</div>
`
const cookie_interval = "hamb_interval"
const cookie_banmsg = "hamb_banmsg_"

const gVerbose = false
const BAN_URL="https://greatawakening.win/ban"
const MAX_MSG = 50

/*global $*/

var $main = null
var lastModified = null
var $display = null, $display_regs = null, $display_ipcount = null
var $select_interval = null
var $status = null
var timer = null
var $banmsg_select = null

function ReadCookie(cookie_name, as_integer) {
    var allcookies = document.cookie;
    //console.log(allcookies)

    // Get all the cookies pairs in an array
    var cookiearray = allcookies.split(';');

    // Now take key value pair out of this array
    for(var i=0; i<cookiearray.length; i++) {
        var name = cookiearray[i].split('=')[0];
        name = name.trim()
        //console.log('name', name)
        if (name == cookie_name) {
            var value = cookiearray[i].split('=')[1];
            //console.log('value', value)
            if (as_integer) {
                return parseInt(value)
            } else {
                return decodeURIComponent(value)
            }
        }
    }
}

function WriteCookie(name, val) {
    if (gVerbose) {
        console.log("Write Cookie", name, val)
    }
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(val);
}

function setDisplay(newregs, dupips) {
    if (newregs) {
        $display_regs.html(newregs)
    }

    if (dupips) {
        $display_ipcount.html(dupips)
    }
}

function updateCounts() {
    var $logs = $(".main-content div.log span[ip]")

    var dups = 0;
    $logs.each(function(i, v) {
        var ip = $(v).attr('ip')
        if (ip) {
            var $matches = $(`span[ip="${ip}"]`)
            if ($matches.length > 1) {
                $matches.parent().find("span:last-child").css('background', 'pink').attr('title', $matches.length + " duplicates")
                console.log("Dup ip", ip, "count", $matches.length)
                dups++
            }
        }
    })
    setDisplay($logs.length, dups)
}

function setStatus(color) {
    $status.css('background', color)
    switch (color) {
        case "green":
            $status.attr('title', "Last refreshed at " + new Date())
            break;

        case "orange":
            $status.attr('title', "Loading updates")
            break;

        case "red":
            $status.attr('title', "Network failed. Retrying later.")
            break;
    }
}

function handleNetError(xhr, status, error) {
    console.log("Network Error", status, error)
    setStatus("red")
}

function handleNewData(data, status, xhr) {
    setStatus("green")
    lastModified = xhr.getResponseHeader('date')
    if (gVerbose) {
        console.log(status, lastModified)
    }

    var $data = $(data)
    var $newItems = $("div.log", $data)
    var found = []
    $newItems.each(function(item, value) {
        var $value = $("<div>" + value.outerHTML + "</div>")
        var user = $(value).find("span:first-child").html()
        var ip = $(value).find("span:last-child").html()
        var sel = `[name="${user}"]`
        if (!$(sel).length) {
            modifyLog($value, gVerbose)
            found.push($value)
        }
    })
    if (found.length > 0) {
        var $existing = $(".main-content .log").css("border", "")
        console.log("Existing", $existing.length)
        if (gVerbose) {
            console.log("Adding new stuff")
        }
        for (var i=found.length-1; i>=0; i--) {
            var $f = $(found[i])
            $f.find(".log").css("border", "1px solid blue")
            $main.prepend($f)
        }
        updateCounts()
    }
}

function loadNew() {
    setStatus("orange")
    var url = "https://greatawakening.win/users"
    var request = {url: url,
                   success: handleNewData,
                    error: handleNetError}
    if (lastModified) {
        request.headers = {'If-Modified-Since': lastModified}
    }

    console.log("Loading", url, new Date())
    $.get(request)
}

function modifyLog(data, verbose, callback) {
    var $logs = $("div.log span:first-child", data)
    if (verbose) {
        if (gVerbose) {
            console.log("ML",$logs)
        }
    }
    /*
    $("div.log span:first-child", data).each(function(index, value) {
    */
    for (var i=0; i<$logs.length; i++) {
        var $this = $($logs[i])
        if (verbose) {
            console.log("Modifying", $this)
        }
        var $ip = $($logs[i].parentElement).find("span:last-child")
        var ip = $ip.html()
        var user = $this.html()
        if (verbose) {
            console.log("ML", user,ip)
        }
        var $html = $(template1.replace(/%USER%/g, user))
        $this.html($html).attr('name', user).attr('ip', ip)
        //console.log("ip", ip, "html", $this[0].outerHTML)
    }
}

function updateBans() {
}

function MarkBan($logdiv) {
    $logdiv.css('border', '').css('text-decoration','line-through').attr("title", "This user is now banned").addClass("banned")
}

function TurboBan(e) {
    e.preventDefault()
    var flag_ipban = $("input#hamb_ipban").is(':checked')
    var flag_nuke = $("input#hamb_nuke").is(':checked')

    var $checkbox = $('.main-content input[type=checkbox]:checked')
    var idlist = []
    $checkbox.each(function() {
        var user = $(this).val()
        //$(`span[name="${user}"]`).parent().css('border', '1px solid red')
        idlist.push(user)
    })

    console.log(idlist)
    function banUser(i) {
        if (i >= idlist.length) {
            return
        }

        var user = idlist[i]
        var $user = $(`span[name="${user}"]`).parent().css('border', '1px solid orange')
        function handleBanSuccess(data, status, xhr) {
            console.log("Ban Success", i, user, data, status)
            MarkBan($user)
            banUser(i+1)
            updateBans()
        }

        function handleBanError(xhr, status, error) {
            console.log("Ban failed", i, user, error, status)
            $user.css('border', '1px solid red').attr('title', "Request failed, try again")
            banUser(i+1)
        }

        console.log("Banning user", user, $user)
        var request = {url: BAN_URL}
        request['success'] = handleBanSuccess
        request['error'] = handleBanError

        var data={community: "GreatAwakening", submit: "Save"}
        data['days'] = 0
        data['reason'] = $banmsg_select.val()
        data['target'] = user
        if (flag_nuke) {
            data['nuke'] = 'on'
        }

        if (flag_ipban) {
            data['ip'] = 'on'
        }

        request['data'] = data
        if (gVerbose) {
            console.log(request)
        }
        $.post(request)
        //setTimeout(handleBanSuccess, 1000)
    }

    banUser(0)
    return false;
}

function saveBanMessages($select) {
    var $options = $select.find("option")
    var i=0
    for (i=0; i<$options.length; i++){
        WriteCookie(cookie_banmsg + i, $($options[i]).val())
    }
    WriteCookie(cookie_banmsg + i,"")
}

function loadBanMessages($select) {
    if (!ReadCookie(cookie_banmsg + '0')) {
        return
    }
    $select.html('')
    for (var i=0; i<20; i++) {
        var msg = ReadCookie(cookie_banmsg + i)
        if (!msg) {
            break
        }

        $select.append(`<option value="${msg}">${msg}</option>`)
    }
}

function ToggleShowBanned() {
    if ($(".hamb_banned").text() == "Hide banned") {
        $(".hamb_banned").html("Show banned")
        $main.addClass("hide-banned")
    } else {
        $(".hamb_banned").html("Hide banned")
        $main.removeClass("hide-banned")
    }
}

function add_styles() {
    $(hammer_styles).appendTo('head')
}

function init_load_save() {
    var $inp = $("<input type='file' accept='text/plain'>")
    var $but = $('<button>Save users to file</button>')
    $("body").prepend($but.click(
        function(event) {
            download_save_file("saved-users.txt", export_users())
        }))


    $("body").prepend($inp.change(
        function (event) {
            var input = event.target;

            var reader = new FileReader();
            reader.onload = function(){
                var text = reader.result;
                load_saved_users(text)
            };
            reader.readAsText(input.files[0]);
        }))
}

const log_template = null

function load_saved_users(text) {
    var count=0, bcount=0, nfound=0
    var $data = $(text)
    var $logs = $data.find(".main-content .log");
    console.log($logs)
    $logs.each(function() {
        var name = $(this).find("span[name]:first-child").attr('name')
        var ipaddr = $(this).find("span[name]:first-child").attr('ip')
        var banned = $(this).attr('title') == "This user is now banned"
        var $found = $(`div.main-content div.log span[name="${name}"]`)

        count++
        if (banned) {
            bcount++
        }
        if ($found.length> 0) {
            if (banned) {
                MarkBan($found.parent())
            }

            nfound++
            console.log(name, "already found")
        } else {
            // Add the user to the list
            var $template = $(`<div><div class="log">
<span>${name}</span> <span>imported from save file</span>, with address <span>${ipaddr}</span>
</div></div>`)
            modifyLog($template, true)
            $template = $template.find("div.log")
            if (banned) {
                MarkBan($template)
            }
            $main.append($template)
        }
        //console.log(name, banned)
    })
    updateCounts()
    console.log(`Count ${count} Banned ${bcount}`)
}

function export_users() {
    return $("main.main")[0].outerHTML;
}

function download_save_file(name, contents, mime_type) {
    mime_type = mime_type || "text/plain";

    var blob = new Blob([contents], {type: mime_type});

    var dlink = document.createElement('a');
    dlink.download = name;
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function(e) {
        // revokeObjectURL needs a delay to work properly
        var that = this;
        setTimeout(function() {
            window.URL.revokeObjectURL(that.href);
        }, 1500);
    };

    dlink.click();
    dlink.remove();
}

function main(){
    init_load_save()
    $main = $(".main-content")
    add_styles()
    console.log("Users Ban-hammer ready ;)", window.$)
    //$display = $("<div>Shill-hammer script ready!</div>").on('click', loadNew)
    $(".nav-main .inner").html("")
    var $status_controls = $(status_template)
    $("header.header").after($status_controls)
    $("a#hamb_turboban").on('click', TurboBan)
    $(".hamb_banned").on('click', ToggleShowBanned)
	$(".hamb_clearall").click(function() {
		$(".log").addClass("hamb-hidden")
		$(".hamb-hidden input[type=checkbox]#banlist").remove()
	})
    $status = $("div#hamb_status")
    $("#hamb_all").change(function() {
        $(".log input[type=checkbox]").prop('checked', this.checked)
    })
    var $bansel = $banmsg_select = $("select[name=hamb_banmsgs]")
    loadBanMessages($bansel)

/*
    $bansel.on('change', function(e) {
        alert($bansel.val())
    })
*/

    $("a#hamb_addmsg").on('click', function(e) {
        e.preventDefault()
        var msg = prompt(`Message (max ${MAX_MSG} characters):`)
        if (msg.length > MAX_MSG) {
            msg = msg.substr(0, MAX_MSG)
        }

        $bansel.prepend(`<option val="${msg}">${msg}</option>`).val(msg)
        saveBanMessages($bansel)
        return false
    })
    $("a#hamb_delmsg").on('click', function(e) {
        e.preventDefault()
        $("option:selected", $bansel).remove()
        saveBanMessages($bansel)
        return false
    })

    $display = $(display_template)
        // For debugging:
        //.on('click', loadNew)

    $display_regs = $("span.hamb_newregs", $display)
    $display_ipcount = $("span.hamb_dupips", $display)
    $select_interval = $("select", $display).on('change', function() {
        clearInterval(timer)
        var interval = $select_interval.val()
        timer = setInterval(loadNew, parseInt(interval) * 60000)
        WriteCookie(cookie_interval, interval)
        console.log("Changing refresh interval to", interval, "mins")
        loadNew()
    })
    var interval = ReadCookie(cookie_interval, true)
    if (interval) {
        console.log("Refresh Interval", interval)
        $select_interval.val(interval)
    }
    $(".header .nav-main").after($display)

    // For debugging:
    //$("div.log:first-child span:first-child").html("bubble_test3")
    modifyLog(window.document)
    updateCounts()
    timer = setInterval(loadNew, parseInt($select_interval.val()) * 60000)
}

(function() {
    'use strict';

    main()
})();
