

function submitSurvey()
{

    let urlBase = "http://157.245.93.19/backend/api";
    let extension = ".php";

    let jsonSurvey = {}

    let surveyId = 1
    let answers = []
    let email = 'email'

    let surveyQuestionsArea = document.getElementById('surveyQuestionsArea')

    let questions = surveyQuestionsArea.childNodes

    console.log(questions.length)

    for( let i = 1; i <= questions.length; i++ )
    {
        let inputBox = $('input[id^="question' + i +'"]')[0]


        if(inputBox.id.split('question' + i)[1].startsWith('Free'))
        {
            // Free Response
            answers.push(inputBox.value)
        }
        else
        {
            answers.push(inputBox.value)

        }
    }

    jsonSurvey['surveyId'] = surveyId
    jsonSurvey['email'] = email
    jsonSurvey['answers'] = answers

    let jsonPayLoad = JSON.stringify({

        email: jsonSurvey['email'],
        surveyId: jsonSurvey['surveyId'],
        answers: jsonSurvey['answers']
       
    });

    let url = urlBase + "/SubmitSurvey" + extension;
    let method = 'POST';

    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try
    {
        xhr.onreadystatechange = function () {

            // If server pinged and a response is sent back
            if (this.readyState == 4 && this.status == 200) {

                console.log( xhr.responseText)

                let jsonObject = JSON.parse(xhr.responseText);

                console.log('JSON Received', jsonObject)

                if(jsonObject.valid == "valid")
                {
                    window.location.href = "./homePage.html"
                }
                else
                {
                    console.log("Error In Survey Submit")
                }
            }
        };

        xhr.send(jsonPayLoad)

    } catch (err) {
        console.log("Unknown Error", err)
    }

    console.log(jsonSurvey)

    return jsonSurvey
}