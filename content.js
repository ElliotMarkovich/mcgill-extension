/*//Setting up Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmDr0Md_-uk75-1VQ89wi6K7VhiCJ4R9I",
  authDomain: "mcgill-extension-database.firebaseapp.com",
  projectId: "mcgill-extension-database",
  storageBucket: "mcgill-extension-database.appspot.com",
  messagingSenderId: "401565708495",
  appId: "1:401565708495:web:e9a8dc3cd73b8d7b8447ba",
  measurementId: "G-3T2RJ80XTB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/

console.log("The script is running");

const keyword_array = ["extension", "MATH 133", "MATH 222", "COMP 250", "COMP 303"];

console.log("Before major walk");
walk(document.body);

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
            buildDOMTree(node.textContent, node);
            break;
    }
}

function buildDOMTree(original_text, original_text_node){
    var keyword_start_index = 0;
    var keyword_end_index = 0;
    var text_start_index = 0;
    //Outer loop; by default, increments current index by 1 each iteration
    for (var current_index = 0; current_index < original_text.length; current_index++){
        //console.log(current_index);
        keyword_test_result = isPrefixOrKeyword(original_text.substring(current_index, current_index + 1));
        //"if character is prefix"
        if (keyword_test_result === 1){
            keyword_start_index = current_index;
            //Internal loop
            for (var internal_index = keyword_start_index; internal_index <= original_text.length; internal_index++){
                //"if keyword detected"
                if (isPrefixOrKeyword(original_text.substring(keyword_start_index, internal_index)) === 2){
                    keyword_end_index = internal_index;
                    original_text_node.parentNode.insertBefore(document.createTextNode(original_text.substring(text_start_index, keyword_start_index)), original_text_node);
                    const hoverable = document.createElement("span"); //creates a span that will contain the keyword
                    hoverable.textContent = original_text.substring(keyword_start_index, keyword_end_index);
                    hoverable.style.color = "blue";
                    hoverable.className = "hoverable";
                    var keyword = original_text.substring(keyword_start_index, keyword_end_index);
                    const popup = document.createElement("span"); //creates a span that act as a popup (child of the "hoverable")
                    popup.textContent = "Hello " + hoverable.textContent;
                    popup.className = "popuptext";
                    hoverable.appendChild(popup);
                    hoverable.addEventListener("mouseover", function(){hoverEvent(popup, keyword);}); //adds functions for when the mouse enters and exits the keyword
                    hoverable.addEventListener("mouseout", function(){hoverEvent(popup, keyword);});
                    original_text_node.parentNode.insertBefore(hoverable, original_text_node); //inserts the hoverable into the text
                    text_start_index = keyword_end_index;
                    current_index = keyword_end_index - 1; //sets current_index to the index after the keyword
                    break;
                }else if (isPrefixOrKeyword(original_text.substring(keyword_start_index, internal_index)) === 0){
                    break;
                }
            }
        //"if character is prefix"
        }else if (keyword_test_result === 2){
            keyword_start_index = current_index;
            keyword_end_index = current_index + 1;
            const hoverable = document.createElement("span"); //creates a span that will contain the keyword
            hoverable.textContent = original_text.substring(keyword_start_index, keyword_end_index);
            hoverable.style.color = "blue";
            hoverable.className = "hoverable";
            const popup = document.createElement("span"); //creates a span that act as a popup (child of the "hoverable")
            popup.textContent = "Hello " + hoverable.textContent;
            popup.className = "popuptext";
            hoverable.appendChild(popup);
            hoverable.addEventListener("mouseover", function(){hoverEvent(popup);}); //adds functions for when the mouse enters and exits the keyword
            hoverable.addEventListener("mouseout", function(){hoverEvent(popup);});
            original_text_node.parentNode.insertBefore(hoverable, original_text_node); //inserts the hoverable into the text
            text_start_index = keyword_end_index;
            current_index = keyword_end_index - 1; //sets current_index to the index after the keyword
        }

    }
    //inserts a text node with all the text after the last keyword, then removes the original text node
    original_text_node.parentNode.insertBefore(document.createTextNode(original_text.substring(text_start_index, original_text.length)), original_text_node);
    original_text_node.parentNode.removeChild(original_text_node);
}

function isPrefixOrKeyword(text){
    var best_result = 0;
    for (var i = 0; i < keyword_array.length; i++){
        if (keyword_array[i] === text){
            return 2;
        }
        if (keyword_array[i].substring(0,text.length) === text){
            best_result = 1;
        }
    }
    return best_result;
}

function hoverEvent(popupElement, keyword){
    popupElement.classList.toggle("show");
    // Communicate with background file by sending a message
    chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: keyword
      },
    },
    (response) => {
      popupElement.textContent = response.message;
    }
  );
}