var trie_object = null;

chrome.runtime.sendMessage(
    {
      type: 'Trie query',
      payload: {
        message: null
      },
    },
    (response) => {
      trie_object = response;
      walk(document.body);
    }
);

function walk(node){       
    var child, next;    
    switch ( node.nodeType )  
    {
        case 1: 
        case 9:  
        case 11: 
            child = node.firstChild;
            while ( child ) 
            {
                next = child.nextSibling; 
                walk(child);
                child = next;
            }
            break;    
        case 3: 
            buildDOMTreeNew(node.textContent, node);
            break;
    }
}

function buildDOMTreeNew(original_text, original_text_node){
    var keyword_start_index = 0;
    var keyword_end_index = 0;
    var text_start_index = 0;
    //Outer loop; by default, increments current index by 1 each iteration
    for (var current_index = 0; current_index < original_text.length; current_index++){
        var current_trie_node = trie_object.trie_object.root;
        keyword_test_result = isPrefixOrKeywordNew(original_text.substring(current_index, current_index + 1), current_trie_node);
        //"if character is prefix"
        if (keyword_test_result != 0 && keyword_test_result != 2){
            keyword_start_index = current_index;
            current_trie_node = keyword_test_result;
            //Internal loop
            for (var internal_index = keyword_start_index + 1; internal_index < original_text.length; internal_index++){
                var internal_keyword_test_result = isPrefixOrKeywordNew(original_text.substring(internal_index, internal_index + 1), current_trie_node);
                //"if keyword detected"
                if (internal_keyword_test_result === 2){
                    keyword_end_index = internal_index + 1;
                    original_text_node.parentNode.insertBefore(document.createTextNode(original_text.substring(text_start_index, keyword_start_index)), original_text_node);
                    const hoverable = document.createElement("span"); //creates a span that will contain the keyword
                    hoverable.textContent = original_text.substring(keyword_start_index, keyword_end_index);
                    hoverable.style.color = "blue";
                    hoverable.className = "hoverable";
                    var keyword = original_text.substring(keyword_start_index, keyword_end_index);
                    const popup = document.createElement("span"); //creates a span that act as a popup (child of the "hoverable")
                    popup.className = "popuptext";
                    hoverable.appendChild(popup);
                    hoverable.addEventListener("mouseenter", function(){hoverEvent(popup, keyword);}); //adds functions for when the mouse enters and exits the keyword and popup
                    hoverable.addEventListener("mouseleave", function(){hoverEvent(popup, keyword);});
                    original_text_node.parentNode.insertBefore(hoverable, original_text_node); //inserts the hoverable into the text
                    text_start_index = keyword_end_index;
                    current_index = keyword_end_index - 1; //sets current_index to the index after the keyword
                    break;
                }else if (internal_keyword_test_result === 0){
                    break;
                }else{
                    current_trie_node = internal_keyword_test_result;
                }
            }
        //"if character is keyword"
        }else if (keyword_test_result === 2){
            keyword_start_index = current_index;
            keyword_end_index = current_index + 1;
            const hoverable = document.createElement("span"); //creates a span that will contain the keyword
            hoverable.textContent = original_text.substring(keyword_start_index, keyword_end_index);
            hoverable.style.color = "blue";
            hoverable.className = "hoverable";
            const popup = document.createElement("span"); //creates a span that act as a popup (child of the "hoverable")
            popup.className = "popuptext";
            hoverable.appendChild(popup);
            hoverable.addEventListener("mouseenter", function(){hoverEvent(popup);}); //adds functions for when the mouse enters and exits the keyword
            hoverable.addEventListener("mouseleave", function(){hoverEvent(popup);});
            original_text_node.parentNode.insertBefore(hoverable, original_text_node); //inserts the hoverable into the text
            text_start_index = keyword_end_index;
            current_index = keyword_end_index - 1; //sets current_index to the index after the keyword
        }

    }
    //inserts a text node with all the text after the last keyword, then removes the original text node
    original_text_node.parentNode.insertBefore(document.createTextNode(original_text.substring(text_start_index, original_text.length)), original_text_node);
    original_text_node.parentNode.removeChild(original_text_node);
}

function isPrefixOrKeywordNew(letter, start_node){
    if(start_node[letter] == undefined){
        return 0;
    }else{
        if (Object.keys(start_node[letter]).length == 0){
            return 2;
        }else{
            return start_node[letter];
        }
    }
}

function hoverEvent(popupElement, keyword){
    popupElement.classList.toggle("show");
    // Communicate with background file by sending a message
    chrome.runtime.sendMessage(
    {
      type: 'Keyword query',
      payload: {
        message: keyword
      },
    },
    (response) => {
      popupElement.innerHTML = response.message;
    }
   );
}