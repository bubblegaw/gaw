// ==UserScript==
// @name      Comment Filter
// @version   1.0
// @author    Smash
// @namespace https://greatawakening.win
// @include   /^https://(.*\.)?greatawakening.win/u/[^\?/]*/?.*$/
// @require   https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant     GM_setClipboard
// ==/UserScript==

/* globals jQuery, $ */

const SETTING_OPEN_NEW_TAB = true;
const SETTINGS_MAX_SEARCH = 1000;

const RULE = {
    1: {
        'title': 'Trump Supporters',
        'text': 'Our community is a high-energy rally for supporters of President Trump.'
    },
    2: {
        'title': 'High Energy',
        'text': 'No forum sliding, consensus cracking, topic dilution, etc.'
    },
    3: {
        'title': 'No Racism',
        'text': 'No racism, including slurs, non-factual content, and general unfounded bigotry.'
    },
    4: {
        'title': 'No Doxing',
        'text': 'No doxxing of yourself or others, including revealing personal info of non-public figures, as well as addresses, phone numbers, etc. of public figures.'
    },
    5: {
        'title': 'Follow the Law',
        'text': 'No posts or comments that violate laws in your jurisdiction or the United States.'
    },
    6: {
        'title': 'No Advertising',
        'text': 'Promoting products, fundraising, or spamming web properties in which you have an interest is not permitted.'
    },
    7: {
        'title': 'Questions and Concerns',
        'text': 'All moderation questions and concerns should be expressed privately to the moderators.'
    },
    8: {
        'title': 'Be Vigilant',
        'text': 'You represent the movement against communism - your posts and comments may become news.'
    }
};

const FILTER = {

    'trump': [

		'\\b45\\b',
        ' DJ?T ',
        'CHEETO',
        'DEAR LEADER',
        'DONN(EY|IE)',
        'GEOTUS',
        'GOD EMPEROR',
        'ORANGE (MAN|ONE)',
        'POTUS',
        'PRESIDENT',
        '[TD]RUMPF?T?',
        'VERY STABLE GENIUS',
        'VSG',
        'zion don',

    ],

    'mods': [

        'admins? ',
        ' ban(ned|s)? ',
        'censor(ship)?',
        'free speech',
        'group ?think',
        'mod(s|eration)? ',
        'removed?',
        'this site',
      	'wrong ?think',

    ],

    'pedes': [

        '(2|two) (scoops|terms)',
        '2A |2nd amendment',
        'aloha snakbar',
        'asshoes?',
        'big league',
        'big mike',
        'bill clinton is a rapist',
        'btfo',
        'clown world',
        'corn ?pop',
        'crooked',
        'didn\\\'t kill (him|her)self',
        'deus valt',
        'feels good man',
        ' frens? ',
        'gulags?',
        '(hand|shot)?gun',
        'helicopter rides?',
        '(high|low) energy',
        'honk (fucking )?honk',
        'infowars( ?dot ?|\\.)com',
        'jeb!',
        'john miller',
        ' kag ',
        '(top )?kek',
        'libtards?',
        'lock h(im|er) up',
        'madman',
        'maga',
      	'meme magic',
        'molon labe',
        'no breaks',
        'no refunds',
        'normies?',
        'NPCs?',
        'Pedes?',
        'Pepes?',
      	'pepperidge farms?',
        'prayers?',
        ' rall(y|ies) ',
        'redacted',
        ' ree+s? ',
        'rifles?',
        'salt mining|mining for salt',
        'seth rich',
        'Shariablue',
        'shitpost(ing|s)?',
        'SJWs?',
        'snow ?flakes?',
        'soros',
        'swamp',
        'take (his|her|their) coats?',
        ' T_?D(W|\\.win)? ',
        'the ?donald',
        'the wall',
        'upvotes?',
        '\\.win',
        'winning',
        'yeets?',

    ],

	'vaxx': [
		'clots?',
		'covid',
		'fauci',
		' flu ',
		'heart',
		'j&j',
		'myocarditis',
		'palpitations?',
		'phizer',
		'shot',
		'strokes?',
		'vaccines?',
		'virus',
		'vaxx',
		'wuflu',
	],

    'racism': [

        '"""',
        '👃',
        '[\\(\\{\\[\\"]{2,}|[\\)\\}\\]]{2,}',
        '109',
        '(109|119|190) countries',
        '13 5\\d',
        '3rd world',
        '6 million',
        '88',
        ' adl ',
      	'african?s?',
      	'aipac',
      	'(anti-?)?semitic',
      	'(anti-?)?semites?',
        ' ape ',
        'ashekenazi',
        'baby dicks?',
        'baby penis(es)?',
        'banker',
        'bergs?',
        ' blacks? ',
        'blood[ -]eating',
        'bolsheviks?',
        'brown',
        'burning coal',
        'central bank(ing)',
        'chimp(ing)? out',
        'chimps?',
        'chinks?',
        'chosen people',
        'chosenites',
        'circumcisions?',
        'civnat',
        'coal burner',
        'coin clippers?',
        'coincidence',
        'cohen',
        'colored',
        'coons?',
        'cry out',
        'did nothing wrong',
      	'dindus?',
        'dual citizen',
        'early life',
        ' elf ',
        ' elves ',
        'europa',
        ' ews ',
        '\\bews\\b',
        'ethnic',
        'every.{0,4}\s*(single.{0,4}\s*)?time.{0,4}',
        'final solution',
        'for no reason at all',
        'foreskin',
        'gas chamber',
        'globalists?',
        'globohomo',
        'goblin',
        'gorilla',
        'gorillion',
        'goyim',
        'göyîm',
        '(?!goya)goy(im)?s?',
        'greatest allies',
        'greatest ally',
        'greatest ?story',
        'groid',
        'hadrian',
        'h[be]{3,}',
      	'himey',
        'hitler',
        'holocaust',
        'holodomor',
        'holohaux',
        'holohoax',
        'hook nosed?',
        'hook-nosed?',
        'i\'?m sick of',
        'injuns?',
        'israel',
        'japs?',
        ' jared ',
        'Jemima',
        '(?!jewel.*)[jg]ew.*?\\b',
        'jidf',
        'jigaboos?',
      	'jogger(let)?s?',
        'joos?',
        'jq',
        'juice',
        'kabbal',
        'kalergi',
        'kikes?',
        'knuckle draggers?',
        'koreans?',
        'last name',
        'levin',
        'mandingos?',
        'masters?',
        ' miga ',
        'minority',
        '\\bmoils?\\b',
        'monkeys?',
        'moshe',
        'mossad',
        'name the jew',
        'nationalists?',
        'nazis?',
        'negro(es)?',
        ' nos(es?|ing)',
        'noticing things',
        '(?!night.*)nig.*?\\b',
        '[nf]?[i1o]g+[e3]rs?',
        'n i g e r',
        'n i g g e r',
        'no reason at all',
        ' nogs? ',
        'nignogs?',
        'nsdap',
        'nuggle',
        'n.gg.rs?',
        'y?our masters?',
        ' oven',
        'o[iy]+ ve[iy]+',
        'parasite',
        'pattern',
        'patton',
        'penis[- ]eating',
        'Pharisees?',
        'pilpul',
        ' race',
        ' rabbis? ',
        'hand rubbers?',
        'reich',
        ' riggers? ',
        'rothschild',
        'sabbath',
        'shekels?',
        'shitskin',
        's+h+i+e+t+',
        'shoah',
        'shut it down',
        'shylocks?',
        '(en)?slave(s|ry)?',
        'slopes?',
        'small hats?',
        'smooth brain',
        'soros',
        'spear chucker',
        ' spics? ',
        'steins?',
        'talmud',
        'tel aviv',
        'tiny hats?',
        'tribe',
        'uss liberty',
        'usury',
        'wakandans?',
        'weimar',
      	'wetbacks?',
        '(?!white house) whites? ',
        'who\'?s behind',
        'you know who',
        'you know why',
        'zhid',
        'zion(ists?|ism)?',
        'zipper head',
		' zog ',
		'zyklon',
    ],

	'fighting': [
		'asshat',
		'\\bbot\\b',
		'\\bboy\\b',
		'conspiracy theorists?',
		'cool',
		'deport',
		'\\b(my )dick\\b',
		'dipshit',
		'do some research',
		'eat shit',
		'faggot',
		'fuck off',
		'glowie',
		'idiot',
		'\\blame\\b',
		'larp',
		'lolbertarian',
		'muh',
		'need a link',
		'quit',
		'retard',
		'seethe',
		'shithead',
		'smoke a cock',
		'stop being lazy',
		'stormfag',
		'troll',
		'two weeks',
		'yawn',
		'you are',
		'you\'re',
        'you guys',
        'you people',
	],

	'sexism': [
		'barefoot',
		'bitch',
		'blonde?s?',
		'chauvinis(t|m)',
		'cunts?',
		'daughters?',
		'emotion(al)?',
		'gender quotas?',
		'feminazis?',
		'her place',
		'horo?monal',
		'horo?mones',
		'kitchens?',
		'lesbians?',
		'on her period',
		'positions of power',
		'pregnant',
		'repeal (the )?19(th)?',
		'sears catalogs?',
		'single moms?',
		'stay at home',
		'talk back',
		'time of (the )?month',
		'woman',
        'women',
        'whore',
	],

    'commies': [

        'automation',
        'climate( change)?',
		'dear leader',
		'drump?f?h?.*?\\b',
		'fauxnews',
        'global warming',
        'goalpost',
        'goal post',
        'healthcare',
        '(ad )?hominem',
        'liberals?',
        'medic(are|aid)',
        'new deal',
		'orange (one|man)',
        'poor',
        'pro life',
        'rich',
        'right winger',
        'safe spaces?',
        'science',
        'socialism',
        'strawm(a|e)n',
		'trumpybear',
        ' UBI |Universal Basic Income',
        'vaccine',
        'wages?',
        'xenophob(es?|ic)',

    ],

    'violence': [

		'9mm',
		'action',
        'ammo',
        'ammunition',
        'armed',
        'arson',
        'beat',
        'blood',
        'boo*g',
        'boogalo*',
      	'bullets?',
      	'burn',
      	'dea(d|th)s?',
      	'destroy',
        ' dies?',
        'execute(d|s)?',
      	'executing',
      	'fight',
      	'from (his|your) chair',
      	'gun',
		' h[au]ng',
		'inevitable',
		'liberty tree',
      	'lynch(es)?',
      	' kill(er)?',
        'militia',
      	'(in )?minecraft',
      	'murders?',
      	'neck',
      	'organizes?',
      	'organizing',
      	'rebellions?',
      	'resist',
      	'revolutions?',
      	'rifles?',
      	'rise up',
      	' ropes?',
      	'sho*t',
		'shotguns?',
      	'slit',
      	'staying home',
      	'stern letter',
      	'sternly',
      	'tank',
      	'threat',
      	'tree of liberty',
      	'violence',
      	'violent',
      	'vote harder',
      	' wars?',
      	'weapons?',


    ],

	'voting': [
		'voting',
		'vote',
	],

    'politicians': [

        'AOC',
      	'barry soetoro',
        'bernie',
        'beto',
        'biden',
        'bush',
        'buttigieg',
        'cast',
        'clinton',
        'cortez',
        'cruz',
        'cuomo',
        'desantis',
        'gavin',
        '[hk]illary',
        'jeb\\!?',
        '(sleepy )?joe',
        'kamala',
        'kemp',
        'lion ted',
        'lyin\'? ted',
        'mccain',
        'nancy',
        'nadler',
        'newsom',
        '[o0]b(ama|ongo|ummer)',
        'omar',
        'paul',
        'pelosi',
        'poll',
        'romney',
        'rubio',
        'sanders',
        'schiff',
        'schumer',
        'tlaib',
        'tulsi',
        'vote',
        'voting',
        'yang',

    ]
};

FILTER.everything = [...new Set(Object.values(FILTER).reduce((combined, newArray) => combined.concat(newArray), ['nigger']))];

$('body').append(`
		<style>
			#mod-tools {
					margin-left: 16px;
			}
			.mod-tools {
					font-size: 14px;
					line-height: 20px;
					color: gray;
			}
			.signature {
					font-style: italic;
			}
			#general-info {
					font-weight: bold;
			}
			#my_note_message, .red {
					font-weight: bold;
					color: red;
			}
			.filter, #mark_all {
					cursor:pointer;
			}
			.filter.active {
			    text-decoration:underline;
					font-weight: bold;
					color: red;
			}
			.marked>.comment {
					background-color: #F8F8FF;
			}
			.permalink {
					display: none;
			}
			pre {
 					white-space: pre-wrap;
			}
			.match {
					text-transform: uppercase;
					font-weight: bold;
					color: yellow;
					font-size: 110%;
			}
			.rules {
					text-align: center;
					cursor:pointer;
			}
			.rules, .bans {
					display: none;
					margin-top: 15px;
					color: gray;
			}
			.rules.show {
					display: inline-block;
			}
			.rule.selected {
					color: red;
			}
			div.head.desktop {
					display: inline-block;
					margin-left: 10x;
			}
    </style>
`);



function red(match) {
    return '<span class="red">' + match + '</span>'
}
var general_info = $('.sidebar-about').find('p').clone();
$(`

		<div id="mod-tools" class="mod-tools">
				<div id=note style="display: none;">
					<span id="latest_note_message"></span>
					<span id="latest_note_signature" class="signature"></span> <br>
					<span id="my_note_message" style="display: none;"></span>
					<span id="my_note_signature" class="signature" style="display: none;"></span>
				</div>
				<div id=general-info>
					<span id="post_karma">${$(general_info[0]).text().replace(/\d+/,red)}</span>
					<span id="comment_karma"> - ${$(general_info[1]).text().replace(/\d+/,red)}</span>
					<span id="join_date"> - ${$(general_info[4]).text().replace(/\d+/,red)}</span>
				</div>
				<div id="search">
					<input id="search-text" class="mod-tools" onfocus="this.select();" onmouseup="return false;">
					<span id="search_stats"><span id="found_matches"></span><span id=found_comments></span></span>
					<br>
					<div style="display: inline-block">
							<span class="filter">mods</span> |
							<span class="filter">violence</span> |
							<span class="filter">racism</span> |
							<span class="filter">vaxx</span> |
							<span class="filter active">all</span> |
							<span class="filter">trump</span> |
							<span class="filter">fighting</span> |
							<span class="filter">pedes</span> |
							<span class="filter">politicians</span> |
							<span class="filter">voting</span> |
							<span class="filter">sexism</span> |
							<span class="filter">commies</span> <br>
							<span class="filter">custom</span> |
							<span class="filter">everything</span> |
							<span class="filter additional">removed</span> |
							<span class="filter additional">approved</span> |
							<span class="filter additional">negative</span> |
							<span class="filter additional">links</span> |
							<span class="filter">view marked</span> <br>
					</div>
				</div>
		</div>
		<div class="rules">
				<span class="rule" data-rule=1>${RULE[1].title}</span> |
				<span class="rule" data-rule=2>${RULE[2].title}</span> |
				<span class="rule" data-rule=3>${RULE[3].title}</span> <br>
				<span class="rule" data-rule=4>${RULE[4].title}</span> |
				<span class="rule" data-rule=5>${RULE[5].title}</span> |
				<span class="rule" data-rule=6>${RULE[6].title}</span> <br>
				<span class="rule" data-rule=7>${RULE[7].title}</span> |
				<span class="rule" data-rule=8>${RULE[8].title}</span>
		</div>
		<div class="bans"></div>

`).insertAfter('.nav-profile');

add_filters($('.main-content'));

$('.rule').click(function() {
    $(this).toggleClass('selected');
    make_ban_notice();
});

//RULE WE UPDATE TO ONLY SHOW FILTERED CONTENT
$('body').append('<style id="filter">  </style>');


$('.nav-profile').append('  <span id="mark_all">📌</span>');
$('#mark_all').click(function() {
    $('.mark:visible').closest('.comment-list').toggleClass('marked').find('.content').toggleClass('hide_comment');
});
$('div.more').remove();

function make_ban_notice() {
    var banText = ""
    $('.rule.selected').each(function() {
        banText += RULE[$(this).data('rule')].title + '\n\n' + RULE[$(this).data('rule')].text + '\n\n';
    });
    banText += '---------------\n\n';
    $('.marked').find('.permalink').each(function() {
        banText += $(this).text() + '\n\n';
    });
  	banText += 'Account: /u/' + $('.user-profile').data('author') + ' ';
    GM_setClipboard(banText);
}

$('.filter').click(function() {

    //MARK ACTIVE FILTER
    if (!($(this).hasClass('additional'))) {
        $('.active:not(.additional)').removeClass('active');
        $(this).addClass('active');
    } else $(this).toggleClass('active');
    $('.rules').removeClass('show');

    //RESET CUSTOM FILTER
    $('.custom').removeClass('custom');

    //HANDLE SPECIAL RULES
    var active_filter = $('.active:not(.additional)').text();
    switch (active_filter) {

        case 'view marked':
            active_filter = 'marked';
            $('.rules').addClass('show');
            make_ban_notice();
            break;

        case 'custom':
            FILTER['custom'] = [$('#search-text').val()];
            add_filters($('.main-content'), 'custom');
            break;

    }

    //ADD CSS
    var css = active_filter == 'all' ? "" : `.comment-list:not(.${active_filter}) {display:none;} `;
    $('.additional.active').each(function() {
        var additional = $(this).text();
        if (additional == 'approved') additional = 'okd';
        css += `.comment-list:not(.${additional}) {display:none;} `
    });
    $('#filter').html(css);

    //UPDATE COUNTS
    var matches = $('.comment-list:visible').length;
    var comments = $('div.comment-list').length;
    $('#found_matches').text(`${matches} match${matches == 1 ? '' : 'es'}`);
    $('#found_comments').text(` out of ${comments} comment${comments == 1 ? '' : 's'}`);

    //RETURN IF THIS IS ADDITIONAL FILTER
    if ($(this).hasClass('additional')) return;

    //CLEAR OLD HIGHLIGHTS
    $('.match').each(function(index) {
        $(this).replaceWith($(this).text());
    });

    //MAKE NEW HIGHLIGHTS
    highlight($('.main-content'));

});
$('.filter:contains(all)').click();


$('#search-text').keypress(function(e) {
    if (e.which == 13) {
        $('.filter:contains(custom)').click();
        return false;
    }
});


async function highlight(DOM) {
    var this_filter = $('.active').not('.additional').text();
    if (!(this_filter in FILTER))
        return;
    if (this_filter == 'custom' && $('#search-text').val() == "")
        return;

    function return_match(match) {
        var leading = match.charAt(0);
        var ending = match.charAt(match.length - 1);
        return (leading.match(/[^A-Za-z0-9]/) ? leading + '<span class="match">' : '<span class="match">' + leading) +
            match.slice(1, -1) +
            (ending.match(/[^A-Za-z0-9]/) ? '</span>' + ending : ending + '</span>');
    };


    DOM.find('.' + this_filter).each(function() {

        var comment = $(this).find('.rendered');
        var search = new RegExp('(' + FILTER[this_filter].join('|').replace(/ /g, '[^A-Za-z]') + ')', 'ig');

        //CONVERT ANCHOR TO SPAN
        var links = [];
        comment.find('a').each(function(i, e) {
            links.push(e);
            $(e).replaceWith(`<span class="link">${$(e).text()}</span>`);
        });

        //MAKE HIGHLIGHTS
        comment.html(comment.html().replace(search, return_match));

        //CONVERT SPAN BACK TO ANCHOR
        if (links.length) {
            comment.find('span.link').each(function(i, e) {

                $(links[i]).html($(this).html());
                $(this).replaceWith($(links[i]));

            });
        };

    });
}


async function update_comments(DOM) {

    DOM.find('.details').append('<a class="mark" data-action="mark" title="mark" href="javascript:void(0);">📌</a>')
    DOM.find('.mark').click(function() {

        $(this).closest('.comment-list').toggleClass('marked').find('.content').toggleClass('hide_comment');

    });

    if (SETTING_OPEN_NEW_TAB) {
        DOM.find('span.title>a').attr('target', '_blank');
        DOM.find('.actions>a:contains(context)').attr('target', '_blank');
        DOM.find('.actions>a:contains(permalink)').attr('target', '_blank');
        DOM.find('.actions>a:contains(all comments)').attr('target', '_blank');
    }

    DOM.find('.rendered').has('a').closest('.comment-list').addClass('links');
    DOM.find('.removed').closest('.comment-list').addClass('removed');
    DOM.find('.approved').closest('.comment-list').addClass('okd');
    DOM.find('.points > .count').filter(function() {
        return $(this).text() < 1
    }).closest('.comment-list').addClass('negative');

    DOM.find('.comment').each(function() {

        var permalink = location.protocol + '//' + location.host + $(this).find('a:contains(permalink)').attr('href');
        $(this).find('.body').append(`<div class="actions permalink"><br><a href="${permalink}">${permalink}</a></div>`);

    });

}
update_comments($('.main-content'));


async function add_filters(DOM, custom = false) {

    var comments = DOM.find('.rendered');

    comments.each(function() {

        //QUICKLY SEARCH AND NOTE ANY MATCHES
        var text = $(this).text();

        var keys;
        if (custom) keys = ['custom']
        else keys = Object.keys(FILTER);

        for (const key of keys) {
            var regex = new RegExp('(' + FILTER[key].join('|').replace(/ /g, '[^A-Za-z]') + ')', 'i');
            if (text.match(regex)) {
                $(this).closest('.comment-list').addClass(key)
            };
        }

    });

}


async function get_note() {
    var parent = $('.user-profile');
    $.ajax({
        url: '/get_note',
        type: 'GET',
        context: this,
        data: {
            target: parent.data('author'),
			community: $("meta[name='community']").attr("content")
        },
        success: function(results) {
            var user = $('div.nav-user>div.inner>a:first').text();
            if (results.length) {
                $('#note').show();
                var r = results[0];
                $('#latest_note_message').text(r.note);
                $('#latest_note_signature').text(` -${r.moderator} (${r.time} ago)`);

                if (r.moderator == user) {
                    $('#latest_note_message').addClass('red');
                    return;
                } else if (results.length > 1) {
                    $(results.slice(1, )).each(function() {
                        if (this.moderator == user) {
                            $('[id^=my_note]').show();
                            $('#my_note_message').text(this.note);
                            $('#my_note_signature').text(` -${this.moderator} (${this.time} ago)`);
                            return false;
                        };
                    });
                }
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }

    });

}
get_note();


var seen = {};
var page = 1;
async function get_more() {

    var found = 0;
    $.ajax({

        type: 'get',

        url: location.protocol + '//' + location.host + location.pathname + '?type=comment&page=' + ++page,

        success: function(result) {
            var next_page = jQuery(result);
            if (next_page.find('div.empty').length > 0)
                return;

 						next_page.find('script').remove();

            next_page = next_page.find('.main-content');
            found = next_page.find('.comment-list').length;

            //CHECK FOR DUPLICATES
            next_page.find('.comment').each(function() {
                var id = $(this).data('id');
                if (seen[id])
                    $(this).closest('.comment-list').remove();
                else
                    seen[id] = true;
            });

            update_comments(next_page);
            add_filters(next_page);
            highlight(next_page);

            $('div.main-content').append(`<div page="${page}" style="display: none">${page}</div>`);
            $('div.main-content').append(next_page.find('div.comment-list:has(".rendered")'));

            let matches = $('.comment-list:visible').length;
            let comments = $('div.comment-list').length;
            $('#found_matches').text(`${matches} match${matches == 1 ? '' : 'es'}`);
            $('#found_comments').text(` out of ${comments} comment${comments == 1 ? '' : 's'}`);

            if (found && $('div.comment-list').length < SETTINGS_MAX_SEARCH)
                get_more();

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }

    });

};
get_more();

function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
}
