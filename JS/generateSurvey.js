

function generateSurvey(jsonSurvey)
{
    let survey = {
        title : jsonSurvey.title,
        desc : jsonSurvey.description,
        startD : jsonSurvey.startDate,
        endD : jsonSurvey.endDate,
        numQuestions : jsonSurvey.number_of_questions,
    }

    let questions = jsonSurvey.questions
    let responses = jsonSurvey.responses

    let surveyMetaDataArea = document.getElementById('surveyMetaDataArea')

    surveyMetaDataArea.innerHTML = ('' +
        '<div class="col">' +

            '<div class="row">' +
                '<h1 id="surveyName">' + survey.title + '</h1>' +
            '</div>' +

            '<div class="row">' +
                '<h4 id="surveyDesc">' + survey.desc + '</h4>' +
            '</div>' +

            '<div class="row center">' +
                '<div class="col-auto"><p id="surveyDate">' + survey.startD + ' - ' + survey.endD + '&nbsp;|</p></div>' +
                '<div class="col-auto"><p id="surveyDate"></p></div>' +
                '<div class="col-auto"><p id="numQuestions">&nbsp;' + survey.numQuestions + ' Questions</p></div>'   +                                
            '</div>' +

        '</div>'
    )

    let scaleLabels = [ 'Strong Disagree', 'Disagree', 'Neutral', 'Agree', 'Strong Agree' ]
    let scaleLabelsNum = [ '1', '2', '3', '4', '5' ]

    let surveyQuestionsArea = document.getElementById('surveyQuestionsArea')

    innerHTMLString = ''

    for( let idx = 0; idx < questions.length; idx++ )
    {

        if( questions[ idx ].type == 1)
        {
            // console.log( 'Scale:', questions[idx].type )

            innerHTMLString = innerHTMLString +
                '<div id="question' + questions[idx].order + 'Example" class="row box bd">' +

                    '<div class="col">' +

                        '<div class="row">' +
                            '<div class="col-auto box"><p>' + questions[idx].order + ')</p></div>' +
                            '<div class="col-auto box"><p>' + questions[idx].statement + '</p></div>' +
                        '</div>' +

                        '<div class="row box">' +
                            '<input id="question' + (idx+1) + 'Free" placeholder="Your Answer Goes Here">' +
                        '</div>' +

                    '</div>' +

                '</div>'
        }
        else if( questions[ idx ].type == 2 )
        {
            // console.log( 'Free Response:', questions[idx].type )

            let startStr = '' +
            '<div id="question' + questions[idx].order + 'Example" class="row box bd">' +
                '<div class="col">' +

                    '<div class="row">' +
                        '<div class="col-auto box"><p>' + questions[idx].order + ')</p></div>' +
                        '<div class="col-auto box"><p>' + questions[idx].statement + '</p></div>' +
                    '</div>' +

                    '<div class="row">'
            
            let endStr = '</div></div></div>'

            let midStr = ''

            for( let i = 0; i < 5; i++ )
            {
                
                midStr = midStr +
                    '<div class="col-auto box">' +
                        '<div class="row">' +
                            '<label>' + scaleLabels[i] + '</label>' +
                        '</div>' +
                        '<div class="row">' +
                            '<input id="question' + (idx+1) + 'Scale' + i + '" name="scale' + (idx+1) +'" type="radio" value="' + (i+1) + '">' +
                        '</div>' +
                    '</div>'
            }

            innerHTMLString = innerHTMLString + startStr + midStr + endStr
        }
    }

    surveyQuestionsArea.innerHTML = innerHTMLString
    
    for( let idx = 0; idx < responses.length; idx++ )
    {
        if( responses[idx].value != '')
        {
            if( scaleLabelsNum.includes( responses[idx].value ) )
            {
                scaleValueNum = scaleLabelsNum.indexOf( responses[idx].value )

                let scaleInputElm = document.getElementById('question' + responses[idx].order + 'Scale' + scaleValueNum )
                scaleInputElm.checked = true
            }
            else
            {
                let freeResponseInputElm = document.getElementById('question' + responses[idx].order + 'Free' )
                freeResponseInputElm.value = responses[idx].value
            }
        }
    }

}

function doGetSurveyAPICall()
{
    let flag = false

    let urlBase = "http://157.245.93.19/backend/api";
    let extension = ".php";

    let email = sessionStorage['userEmail']
    let surveyId = sessionStorage['surveyId']

    if( email == undefined )
    {
        console.log('No Email Found');

        window.location.href = "../index.html";
        flag = true
    }

    if( surveyId == undefined )
    {
        console.log('No Survey Id Found');

        window.location.href = "../index.html";
        flag = true
    }

    // Missing either email or password -> return
    if(flag) {return}

    //* Variables for the http request to login with the login api
    let jsonPayLoad = JSON.stringify({
        email: email,
        survey_id: surveyId
    });

    console.log('JSON Package', jsonPayLoad)

    let url = urlBase + "/GetSurvey" + extension;
    let method = "POST";

    //* Opening the connection to the getAllSurveys api file with the email typed in
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function () {

            // If server pinged and a response is sent back
            if (this.readyState == 4 && this.status == 200) {

                // console.log("Response Text : ", xhr.responseText)

                let jsonObject = JSON.parse(xhr.responseText);

                console.log('JSON Received', jsonObject)

                if(jsonObject)
                {
                    generateSurvey(jsonObject)
                }
            }
        };

        xhr.onerror = () =>
        {
            console.log('XHR On Error')
        }

        xhr.send(jsonPayLoad)
    }
    catch (err)
    {
        console.log("Unknown Error", err)
    }
}