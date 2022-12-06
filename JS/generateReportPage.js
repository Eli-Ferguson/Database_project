

function createReportHTML(jsonReport)
{
    let surveyMeta = document.getElementById('surveyMeta')

    surveyMeta.innerHTML = '' +
        '<div class="col">' +

            '<div class="row">' +
                '<h1 id="surveyName">' + jsonReport.title + '</h1>' +
            '</div>' +

            '<div class="row">' +
                '<h4 id="surveyDesc">' + jsonReport.description + '</h4>' +
            '</div>' +

            '<div class="row center">' +
                '<div class="col-auto"><p id="surveyDate">' + jsonReport.startDate + ' - ' + jsonReport.endDate + '&nbsp;|</p></div>' +
                '<div class="col-auto"><p id="surveyDate"></p></div>' +
                '<div class="col-auto"><p id="numQuestions">&nbsp;' + jsonReport.number_of_questions + ' Questions</p></div>'   +                                
            '</div>' +

        '</div>'
    
    let surveyQuestionsArea = document.getElementById('surveyQuestionsArea')

    surveyQuestionsArea.innerHTML = ''

    for( let i = 0; i < jsonReport.number_of_questions; i++)
    {
        if( jsonReport.questions[i].type == 1 )
        {
            surveyQuestionsArea.innerHTML = surveyQuestionsArea.innerHTML +
            '<div class="row space">' +

                '<div id="" class="col space bd">' +
                    '<div id="questionLeft' + i + '" class="row box questionInner' + i + ' bd">' +

                        '<div class="col">' +

                            '<div class="row">' +
                                '<div class="col-auto box"><p>' + jsonReport.questions[i].order + ')</p></div>' +
                            '</div>' +

                            '<div class="row">' +
                                '<div class="col-auto box"><p>' + jsonReport.questions[i].statement + '</p></div>' +
                            '</div>' +

                            '<div class="row">' +
                                '<div class="col-auto box"><p>Free Response</p></div>' +
                            '</div>' +

                        '</div>' +

                    '</div>' +
                '</div>' +

                '<div id="answersRight' + i + '" class="col overflow space bd">' +

                    '<div class="row answersList">' +

                        '<div id="freeResponseAnswers' + i + '" class="col">' +

                        '</div>' +

                    '</div>' +

                '</div>' +

            '</div>'

            let freeResponseAnswers = document.getElementById('freeResponseAnswers' + i)

            for( let j = 0; j < jsonReport.responses[i].length; j++)
            {
                freeResponseAnswers.innerHTML = freeResponseAnswers.innerHTML +
                    '<div id="answer1" class="row box bd">' +
                        '<div class="col-auto box"><p>' + jsonReport.responses[i][j].response + '</p></div>' +
                    '</div>'
            }

        }
        else if( jsonReport.questions[i].type == 2 )
        {

            surveyQuestionsArea.innerHTML = surveyQuestionsArea.innerHTML +
                '<div class="row space">' +
                    '<div id="scaleCol' + i + '" class="col">' +

                        '<div class="row rating">' +

                            '<div id="questionLeft' + i + '" class="col space bd">' +
                                '<div id="" class="row box questionInner' + i + ' bd">' +

                                    '<div class="col">' +
                
                                        '<div class="row">' +
                                            '<div class="col-auto box"><p>' + jsonReport.questions[i].order + ')</p></div>' +
                                        '</div>' +

                                        '<div class="row">' +
                                            '<div class="col-auto box"><p>' + jsonReport.questions[i].statement + '</p></div>' +
                                        '</div>' +

                                        '<div class="row">' +
                                            '<div class="col-auto box"><p>Rating Question</p></div>' +
                                        '</div>' +

                                    '</div>' +

                                '</div>' +
                            '</div>' +

                            '<div id="answersRight' + i + '" class="col overflow space bd">' +

                                '<div class="row answersList">' +

                                    '<div class="col">' +

                                        '<div id="scaleAnswers' + i + '" class="row box">' +
                                        '</div>' +

                                    '</div>' +

                                '</div>' +

                            '</div>' +

                        '</div>' +

                    '</div>' +
                    
                '</div>'

            let scaleAnswers = document.getElementById('scaleAnswers' + i)

            for( let j = 0; j < jsonReport.responses[i].length; j++)
            {
                scaleAnswers.innerHTML = scaleAnswers.innerHTML +
                    '<div class="col-auto box bd"><p class="box">' + jsonReport.responses[i][j].response + '</p></div>'

            }

            let scaleArray = []

            for( let i = 0; i < jsonReport.number_of_questions; i++)
            {
                if(jsonReport.questions[i].type == 2)
                {
                    jsonReport.responses[i].forEach( (response) => {scaleArray.push(response.response)})
                }
            }

            const calculateMean = (values) => {
                const mean = (values.reduce((sum, current) => sum + current)) / values.length;
                return mean;
            };
            
            const calculateVariance = (values) => {
                const average = calculateMean(values);
                const squareDiffs = values.map((value) => {
                    const diff = value - average;
                    return diff * diff;
                });
                const variance = calculateMean(squareDiffs);
                return variance;
            };

            let scaleArrayMean = calculateMean(scaleArray)
            let scaleArrayVar = calculateVariance(scaleArray)

            // console.log(scaleArrayMean, scaleArrayVar)

            let scaleCol = document.getElementById( 'scaleCol' + i )

            scaleCol.innerHTML = scaleCol.innerHTML +
                '<div class="row report">' +

                    '<div class="col">' +
                        '<div class="row center">Mean</div>' +
                        '<div id="question' + i + 'Mean" class="row center">' + scaleArrayMean + '</div>' +
                    '</div>' +
                    '<div class="col">' +
                        '<div class="row center">Variance</div>' +
                        '<div id="question' + i + 'Variance" class="row center">' + scaleArrayVar + '</div>' +
                    '</div>' +

                '</div>'

        }

    }
}

function doGetReport()
{
    let urlBase = "http://157.245.93.19/backend/api";
    let extension = ".php";

    let surveyId = sessionStorage['surveyId']

    if(surveyId == undefined){console.log('No SurveyId');return;}

    //* Variables for the http request to login with the login api
    let jsonPayLoad = JSON.stringify({
        surveyId: surveyId,
    });

    console.log('JSON Package', jsonPayLoad)

    let url = urlBase + "/GetReport" + extension;
    let method = "POST";

    //* Opening the connection to the login api file with the login & password typed in
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {

            // If server pinged and a response is sent back
            if (this.readyState == 4 && this.status == 200) {

                console.log('Received', xhr.responseText)

                let jsonObject = JSON.parse(xhr.responseText);

                console.log('JSON Received', jsonObject)

                /*####################################### Add Next Line after API works #######################################*/
                // createReportHTML(jsonObject)
            }
        };

        xhr.send(jsonPayLoad)

    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }

    /*####################################### Remove Next Line after API works #######################################*/
    let jsonReport = {
        title:"Title",
        description:"Desc",
        startDate:"2022/12/01",
        endDate:"2022/12/01",
        number_of_questions:2,
        questions:[
            {type:1,statement:"Question 1",order:1},
            {type:2,statement:"Question 2",order:2}
        ],
        responses:[
            [{response:"answer1",order:1}, {response:"answer2",order:1}],
            [{response:1,order:1}, {response:2,order:2}]
        ],
    }
    createReportHTML(jsonReport)
}