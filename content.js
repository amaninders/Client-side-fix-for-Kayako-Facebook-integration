chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg === 'url-update') {

        $(document).ready(validateChannel);

        function validateChannel() {  // this function validates the channel for a case
            var domain = window.location.host.split(".")[0];
            var url = document.location.href.split("/");
            var index = url[url.length - 1];
            const request = new XMLHttpRequest();
            var url= "https://" + domain + ".kayako.com/api/v1/cases/" + index + "?fields=last_public_channel(type)&include=*"; 
            request.open("GET", url);
            request.send();

            request.onreadystatechange = function() {
                if(this.readyState==4 && this.status==200){
                    var obj = JSON.parse(request.responseText);
                    if (obj.data.last_public_channel.type == "FACEBOOK") { //continue if the channel is Facebook
                        checkEditor(); //call the checkEditor
                    };
                };
            };
        }; 

        function checkEditor() { //this function cheks the visibility of editor
            var $editor = $('div.fr-element.fr-view');
            if( $editor.is(':visible') ){ //if the container is visible on the page and ready for plugin
                modifyEditor($editor);
            } else {
                setTimeout(checkEditor, 500); //wait 50 ms and try again
            }
        };

        function modifyEditor(editor){ //this function modifies the editor    
            var $sendButton = $('div.ko-case-content__editor-footer-right_11x6m5');
            var $cleanButton = $('<input id="cleanfbtext" type="button" value="Clean Text" class="channel-type--facebook ko-button__primary-with-options_ka3fcv" />');
            var $macroButton = $('div.ko-case_macro-selector__container_ltxhiw');
            $macroButton.before($cleanButton); //add a custom button
            $sendButton.toggle(); //hide the send button
            $cleanButton.click(function(){
                var preHTML = editor.html();
                var postHTML = preHTML.replaceAll( /\\/g, "\\\\").replaceAll(/\"/g, '\\"');
                editor.html(postHTML);
                $('#cleanfbtext').hide();
                $sendButton.show();     
                editor.focus();
                placeCaretAtEnd( editor.get(0) );
                $sendButton.click(function(){
                    $sendButton.hide(); //hides the send button again
                    $('#cleanfbtext').show();
                });
            });            
        }

        function placeCaretAtEnd(el) { //this function places the caret at the end of the current text
            el.focus();
            if (typeof window.getSelection != "undefined"
                    && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        }        
    };
});