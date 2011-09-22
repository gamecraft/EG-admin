<?php
header("Content-Type: text/html; charset=utf-8");
?>
<html>
    <head>
        <title>Лотарията</title>
        <script type="text/javascript" src="js/additional_prototypes.js"></script>
        <script src="http://code.jquery.com/jquery-latest.js"></script>
        <script src="js/jquery-ui-1.8.16.custom.min.js" type="text/javascript"></script>
        <script src="js/jquery.flip.min.js" type="text/javascript"></script>
        <script src="js/lottery/main.js" type="text/javascript"></script>
        <script src="js/lottery/gameconstants.js" type="text/javascript"></script>
        <script src="js/lottery/lottery.logic.js" type="text/javascript"></script>
        <script src="js/lottery/flipcard.js" type="text/javascript"></script>

        <script type="text/javascript">
            $(document).ready(function(){
             
                $("#cards").children().each(function(index, item) {
                    var card = new Lottery.FlipCard({
                        flipboxId : item.id,
                        backContent : '<img src="images/back.png" />',
                        faceContent : '<img src="images/back.png" />'
                    });
                    Lottery.FlipCardsTable[item.id] = card;
                });
            });
        </script>

        <style>

            .flipbox {
                width: 193px;
                height: 248px;
                float: right;
                margin : 10px;
            }
        </style>
    </head>
    <body>
        <div id="cards">

            <div class="flipbox" id="flipbox">
                <img src="images/back.png" />
            </div>
            <div class="flipbox" id="flipbox2">
                <img src="images/back.png" />
            </div>
            <div class="flipbox" id="flipbox3">
                <img src="images/back.png" />
            </div>
            <div class="flipbox" id="flipbox4">
                <img src="images/back.png" />
            </div>
            <div class="flipbox" id="flipbox5">
                <img src="images/back.png" />
            </div>
            <div class="flipbox" id="flipbox6">
                <img src="images/back.png" />
            </div>
            <div class="flipbox" id="flipbox7">
                <img src="images/back.png" />
            </div>
        </div>
    </body>
</html> 
