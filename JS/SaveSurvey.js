function download(filename) {
 // gets the number of questions
 let numQuestions = document.getElementById("numQuestions").textContent;
 // gets survey title and start and end date
 let title = document.getElementById("surveyName").textContent;
 let dates = document.getElementById("surveyDate").textContent;
 let Participantscount = document.getElementById("activeParticipantsCount").textContent;
 // sets up Temp string
 var tmp = "";
 var tmp2 = "";
 var itr = parseInt(numQuestions,8);
 filename = title +"_Survey.txt";
 
    //Creating one big text string
    const text = [title+dates+numQuestions+Participantscount];

    for(let i = 0; i <= itr; i++)
    {
           
        // gets mean and adds it to document
        tmp = document.getElementById("question" + i + "Mean");
        if(tmp != null)
        {
            tmp = document.getElementById("question" + i + "Mean").textContent;
            tmp2 = document.getElementById("question"+ i +"Variance").textContent;
            text.push("\nQuestion"+ (i+1) + "Mean: " + tmp + "  Question"+ (i+1) + "Variance: " + tmp2);
        }
    }
    
       

    for(let i = 0; i < itr; i++)
    {
        
        tmp = document.getElementById("questionLeft" + i);
        if(tmp != null)
        {
            tmp = document.getElementById("questionLeft" + i).textContent;
            text.push("\n"+tmp);
        }

        tmp2 = document.getElementById("answersRight" + i);
        if(tmp2 != null)
        {
            tmp2 = document.getElementById("answersRight" + i).textContent;
            text.push("\n"+tmp2);
        }
    }
    // Saving of the document
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}