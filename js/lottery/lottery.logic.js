// after gameconstants.js is loaded
// requires jQuery
Lottery.FlipCardsTable = {};

Lottery.turnAllCards = function(exclude /*array of ids*/, wonReward) {
    var rewards = Lottery.gameConstants.rewards;
    var images = [];
    
    for(var reward in rewards) {
        if(rewards.hasOwnProperty(reward)) {
            if(rewards[reward].name !== wonReward.name) {
                images.push(rewards[reward].image);
            }
        }
    }
    images.shuffle();
    for(var flipCardId in Lottery.FlipCardsTable) {
        if(Lottery.FlipCardsTable.hasOwnProperty(flipCardId)) {
            if(exclude.indexOf(flipCardId) == -1) {
                Lottery.FlipCardsTable[flipCardId].flip(false, images.pop());
            }
        }
    }
};

Lottery.isWinning = function(rewardObject, percent, lastBound) {
    if(typeof(rewardObject.chance) !== "undefined") {
        return percent >= lastBound && percent <= rewardObject.chance + lastBound - 1;
    }
    
    return false;
};

Lottery.hasBooks = function(rewardObject) {
    if(rewardObject.name !== "BOOK") {
        return true;
    } else {
        return Lottery.gameConstants.BOOKS_AVAILABLE;
    }
};

Lottery.percentageSum = (function() {
    var sum = 0;
    var rewards = Lottery.gameConstants.rewards;
    for(reward in rewards) {
        if(rewards.hasOwnProperty(reward) && typeof(rewards[reward]) !== "function") {
            sum += rewards[reward].chance;
        }
    }
    return sum;
})();

Lottery.play = function(entryFeeFunction) {
    if(entryFeeFunction(Lottery.gameConstants.ENTRY_FEE) == false /*not enough team points*/) {
        alert("Not enough team points");
        return false;
    }
    var drawPercent = Lottery.randomBetween(1,Lottery.percentageSum),
    rewards = Lottery.gameConstants.rewards;
    
    console.log(drawPercent);
    
    var bound = 1;
    
    for(var reward in rewards) {
        if(rewards.hasOwnProperty(reward)) {
            if(Lottery.isWinning(rewards[reward], drawPercent, bound) && Lottery.hasBooks(rewards[reward])) {
                return rewards[reward];
            } else {
                bound += rewards[reward].chance;
            }
        }
    }
    return rewards.QUOTE;
};