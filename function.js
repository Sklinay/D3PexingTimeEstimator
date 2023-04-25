function xpForNext(curLvl) {
    if (curLvl <= 59)
        return 7200000 + 1440000 * curLvl;
    else if (curLvl <= 69)
        return 95040000 + 2880000 * (curLvl - 60);
    else if (curLvl <= 72)
        return 126000000 + 5040000 * (curLvl - 70);
    else if (curLvl == 73)
        return 139740000;
    else if (curLvl <= 148)
        return 140760000 + 1020000 * (curLvl - 74);
    else if (curLvl <= 249)
        return 218280000 + 2040000 * (curLvl - 149);
    else if (curLvl <= 349)
        return 426360000 + 4080000 * (curLvl - 250);
    else if (curLvl <= 448)
        return 836400000 + 6120000 * (curLvl - 350);
    else if (curLvl <= 499)
        return 1444320000 + 8160000 * (curLvl - 449);
    else if (curLvl <= 549)
        return 1872720000 + 20400000 * (curLvl - 500);
    else if (curLvl <= 599)
        return 2913120000 + 40800000 * (curLvl - 550);
    else if (curLvl <= 649)
        return 4973520000 + 61200000 * (curLvl - 600);
    else if (curLvl <= 699)
        return 8053920000 + 81600000 * (curLvl - 650);
    else if (curLvl <= 749)
        return 12154320000 + 102000000 * (curLvl - 700);
    else if (curLvl <= 2249)
        return 17274720000 + 122400000 * (curLvl - 750);
    else if (curLvl == 2250)
        return 200981922000;
    else if (curLvl >= 2251) {
		var xp = 200981922000;
		for (var i = curLvl - 2250; i > 0; i--)
			xp += 229602000 + 102000 * (i);		
        return xp;
	}
}

function sumPara(currLvl, goalLvl) {
    var sum = 0;
    for (var i = currLvl; i < goalLvl; i++) {
        sum += xpForNext(i);
    }
    return sum;
}

function xpFromClosingGR(grLvl) {
    return Math.round(_xpFromClosingGR(grLvl));
}

function _xpFromClosingGR(grLvl) {
    if (grLvl == 1)
        return 15660001;
    else if (grLvl <= 25)
        return xpFromClosingGR(grLvl - 1) * 1.1270304;
    else if (grLvl <= 70)
        return xpFromClosingGR(grLvl - 1) * 1.08;
    else
        return xpFromClosingGR(grLvl - 1) * 1.05;
}

function computePercentageRatio(everageEliteKill) {
    var baseM = 0.535; // 53.5%
    var baseR = 0.465; // 46.5%

    var step = baseM * (1 - everageEliteKill * 3.5 * 0.0115); //3.5 average orb amount per elite pack; 1.15 progression from orb
    var tot = step + baseR;

    return {
        monsterRatio: step / tot,
        closingRatio: baseR / tot
    };

}

function computeBaseXpReward(grLvl, collectOrb, everageEliteKill) {
    if (collectOrb)
        var ratios = computePercentageRatio(everageEliteKill);
    else
        var ratios = {
            monsterRatio: 0.535,
            closingRatio: 0.465
        }

    var xpFromGr = xpFromClosingGR(grLvl);
    return {
        monster: 1 / ratios.closingRatio * xpFromClosingGR(grLvl) - xpFromGr,
        closing: xpFromGr
    };
}

function addBonusXp(xp, poolClosing, poolMonster, itemBonusXp, nbPlayer) {
    var bonusPlayer = 1 + (nbPlayer - 1) * 0.10;
    var bonusItemXp = 1 + itemBonusXp / nbPlayer;

    return {
        monster: xp.monster * bonusItemXp * bonusPlayer * (poolMonster ? 1.25 : 1),
        closing: xp.closing * (poolClosing ? 1.5625 : 1)
    }
}

function parseTime(time) {
    var tmp = time.split(":");
    return parseInt(tmp[0]) * 60 * 60 + parseInt(tmp[1]) * 60 + (tmp[2] == null ? 0 : parseInt(tmp[2]));
}

function getAverageRiftTime() {
    return parseTime($('#timeRift').val()) / $('#nbRift').val();
}

function formatTime(seconds, formatForValue) {
    var days = Math.trunc(seconds / 86400);
    seconds -= days * 86400;
    var hours = Math.trunc(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.trunc(seconds / 60);
    seconds -= minutes * 60;
    seconds = Math.trunc(seconds);

    if (!formatForValue) {
        var result = "";
        if (days > 0)
            result += days + " day" + (days > 1 ? "s " : " ");
        if (hours > 0)
            result += hours + " hour" + (hours > 1 ? "s" : "");

        result += " and " + minutes + " minute" + (minutes > 1 ? "s" : "");
        return (result == "" ? "Too Few Time" : result);
    } else {
        return (hours.toString().length == 1 ? "0" : "") + hours + ":" + (minutes.toString().length == 1 ? "0" : "") + minutes + ":" + (seconds.toString().length == 1 ? "0" : "") + seconds;
    }
}

$(document).ready(function () {
    var showToolTipXp = false;
    $('#resultXp').on("mouseenter", function (e) {
        if (showToolTipXp) {
            $('#xpDetailTooltip').css({
                left: e.pageX + 10,
                top: e.pageY + 10
            });
            $('#xpDetailTooltip').show();
        }
    });

    $('#resultXp').on("mousemove", function (e) {
        if (showToolTipXp) {
            $('#xpDetailTooltip').css({
                left: e.pageX + 10,
                top: e.pageY + 10
            });
        }
    });

    $('#resultXp').on("mouseleave", function (e) {
        if (showToolTipXp) {
            $('#xpDetailTooltip').hide();
        }
    });


    $('#hintTime').on("click", function (e) {
        $('#hintTimeBox').css({
            left: e.pageX,
            top: e.pageY
        });
        $('#closeFrame').show();
        $('#hintTimeBox').show();
    });

    $('#closeFrame').on("click", function () {
        $('#hintTimeBox').hide();
        $('#closeFrame').hide();
    });

    $('#validateHint').on("click", function () {
        if ($('#hintTimeGR').val() != "" && $('#hintTimeGR').val() != "00:00:00") {
            var averageSeconde = parseTime($('#hintTimeGR').val()) / parseInt($('#hintAmountGR').val());
            $('#timeRift').val(formatTime(averageSeconde, true));
        }
    });

    $('#currentPara').on("keypress change", function (e) {
        if (e.type == "keypress") {
            if (!isFinite(e.key))
                e.preventDefault();
        } else if (e.type == "change") {
            if ($('#currentPara').val() != "") {
                var newValue = parseInt($('#currentPara').val());
                if (newValue >= parseInt($('#goalPara').val()))
                    $('#goalPara').val(newValue + 1);
            } else {
                $('#currentPara').val(0);
            }
        }
    });

    $('#goalPara').on("keypress change", function (e) {
        if (e.type == "keypress") {
            if (!isFinite(e.key))
                e.preventDefault();
        } else if (e.type == "change") {
            if ($('#goalPara').val() != "" && parseInt($('#goalPara').val()) > 1) {
                var newValue = parseInt($('#goalPara').val());
                if (newValue <= parseInt($('#currentPara').val()))
                    $('#currentPara').val(newValue - 1);
            } else {
                $('#goalPara').val(1);
            }
        }
    });

    $('#grLevel,#hintAmountGR').on("keypress change", function (e) {
        if (e.type == "keypress") {
            if (!isFinite(e.key))
                e.preventDefault();
        } else if (e.type == "change") {
            if ($(e.target).val() == "")
                $(e.target).val(0);
        }
    });

    $('#bonusXp').on("keypress change", function (e) {
        if (e.type == "keypress") {
            if (e.key == "-" || e.key == ",")
                e.preventDefault();
        } else if (e.type == "change") {
            if ($('#bonusXp').val() == "")
                $('#bonusXp').val(0);
            else
                $('#bonusXp').val(parseFloat($('#bonusXp').val()));
        }
    });

    $('#xpFromMonster').on("change", function (e) {
        if (!e.target.checked)
            $('#poolMonster, #bonusXp').prop("disabled", "disabled")
        else
            $('#poolMonster, #bonusXp').removeAttr("disabled");
    });

    $('#compute').on("click", function (e) {
        $('#result').show();
        var currentPara = parseInt($('#currentPara').val());
        var goalPara = parseInt($('#goalPara').val());
        var grLevel = parseInt($('#grLevel').val());
        var timeRift = parseTime($('#timeRift').val());
        var numberPlayer = parseInt($('#numberPlayer').val());
        var bonusXp = parseInt($('#bonusXp').val()) / 100;

        var xpFromGR = addBonusXp(computeBaseXpReward(grLevel, true, 9), $('#poolClosing').is(":checked"), $('#poolMonster').is(":checked"), bonusXp, numberPlayer);
        var averageXpFromGR = xpFromGR.closing + ($('#xpFromMonster').is(":checked") ? xpFromGR.monster : 0);
        var xpHour = averageXpFromGR / timeRift * 3600;
        var needXp = sumPara(currentPara, goalPara);
        var grNeeded = Math.ceil(needXp / (averageXpFromGR));
        var totalTime = formatTime(timeRift * grNeeded);

        $('#resultXp').text(Math.round(averageXpFromGR).toLocaleString());
        $('#resultGR').text(grLevel);
        $('#resultCurrentPara').text(currentPara);
        $('#resultGoalPara').text(goalPara);
        $('#resultTime').text(totalTime);
        $('#resultNbGR').text(grNeeded);
        $('#resultXpHour').text(Math.round(xpHour).toLocaleString());

        showToolTipXp = $('#xpFromMonster').is(":checked");
        if (showToolTipXp) {
            $('#resultXp').addClass("underlined");
            $('#resultXpClosing').text(Math.round(xpFromGR.closing).toLocaleString());
            $('#resulXpMonster').text(Math.round(xpFromGR.monster).toLocaleString());
        } else 
            $('#resultXp').removeClass("underlined");
    });

});
