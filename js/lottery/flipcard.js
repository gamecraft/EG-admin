/**
 * Requires jQuery to work.
 **/
Lottery.FlipCard = function FlipCard(config) {  
    if(typeof(config) !== "object") {
        throw new TypeError("Config must be an object");
    }
    this.faces = [config["backContent"], config["faceContent"]];
    this.config = config;
                    
    this.getContent = function() {
        var next = this.faces.shift();
        this.faces.push(next);
        return next;
    };
    
    this.isFront = true;
    
    this.flip = function(giveReward /*bool*/, flipContent) {
        var isFront = this.isFront;
        if(isFront && giveReward == true) {
            var reward = Lottery.play(function(){
                return true; // for testing right now
            });
        }
        var content = "";
        var cardId = this.config["flipboxId"];
        
        // determine the content
        if(typeof(flipContent) !== "undefined") {
            content = "<img src={0} />".format(flipContent);
        } else {
            content = (isFront && giveReward) ? "<img src={0} />".format(reward.image) : this.getContent();
        }
        this.isFront = !this.isFront;
        
        $("#{0}".format(cardId)).flip({
            direction:'tb',
            content : content /*turns this.isFront*/,
            speed : 500,
            color : "#FFFFFF",
            onEnd : function() {
                if(typeof(reward) !== "undefined") {
                    Lottery.turnAllCards([cardId], reward)
                }
            }
        })
    };
                    
    var targetObj = this;
    $("#{0}".format(config["flipboxId"])).bind("click", {
        context : targetObj
    },function(event){
        event.data.context.flip(true);
    });
} 


