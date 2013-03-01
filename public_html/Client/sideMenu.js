/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function updateObjectList(){
    
    
    var objectlistDOMObject = document.getElementById("sideMenuObjectList");    
    var user_table=JSON.parse(localStorage.friends);
    
    //first we empty the list
    objectlistDOMObject.innerHTML = '';
    
    for (x in user_table)  {
        if (x !== localStorage.sessionId){
            var li = document.createElement('li');    
            li.innerHTML = x;
            objectlistDOMObject.insertBefore(li,objectlistDOMObject.firstChild);
        }
    }


    
}



