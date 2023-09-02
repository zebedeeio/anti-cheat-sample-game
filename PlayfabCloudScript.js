var MAX_EARN_SCORE = 3;

handlers.GetEarnModeScore = function(args, context)
{
    return { earnModeScore: MAX_EARN_SCORE };
};

handlers.getPoints = function(args, context) {
    
    var inventory = server.GetUserInventory({
        PlayFabId: currentPlayerId
    });

    var points = Number(inventory.VirtualCurrency["OB"]);

   return {
        type: "getPoints",
        data: points
    };
};
function addPoints(points) {
    var addResult = server.AddUserVirtualCurrency({
        PlayFabId: currentPlayerId,
        VirtualCurrency: "OB",
        Amount: points
    });

    return addResult;
}

handlers.avoidobstacles = function(args, context) {

    var addResult = addPoints(1);
    var request = {
        PlayFabId: currentPlayerId,
        Statistics: [{
            StatisticName: "PlayerHighScore",
            Value: 1
        }]
    };

    var result = server.UpdatePlayerStatistics(request);

    return {
        type: "avoidobstacles",
        success: true,
        data: addResult.Balance
    };
};







handlers.updateAndRetrieveScore = function (args, context) {
    var increaseAmount = 1; // Increase score by 1 for each obstacle avoided

    // Retrieve the player's current score from the internal data
    var internalDataResult = server.GetUserInternalData({
        PlayFabId: currentPlayerId,
        Keys: ["Score", "HighScore"]
    });

    var currentScore = 0;
    if (internalDataResult.Data && internalDataResult.Data.Score) {
        currentScore = parseInt(internalDataResult.Data.Score.Value);
    }

    // Increase the score by one
    currentScore += increaseAmount;

    var currentHighScore = currentScore;
    if (internalDataResult.Data && internalDataResult.Data.HighScore) {
        var storedHighScore = parseInt(internalDataResult.Data.HighScore.Value);
        if (currentScore > storedHighScore) {
            currentHighScore = currentScore;
        } else {
            currentHighScore = storedHighScore;
        }
    }

    // Update the player's score statistic
    var updateStatResult = server.UpdatePlayerStatistics({
        PlayFabId: currentPlayerId,
        Statistics: [
            {
                StatisticName: "Score",
                Value: currentScore
            },
            {
                StatisticName: "HighScore",
                Value: currentHighScore
            }
        ]
    });

    // Update the player's internal data with the new score and high score
    server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
            Score: currentScore.toString(),
            HighScore: currentHighScore.toString()
        }
    });

    // Return the updated score and high score to Unity
    return { score: currentScore, highScore: currentHighScore };
};

handlers.resetScore = function (args, context) {
    var updateStatResult = server.UpdatePlayerStatistics({
        PlayFabId: currentPlayerId,
        Statistics: [
            {
                StatisticName: "Score",
                Value: 0
            }
        ]
    });

    server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
            Score: "0"
        }
    });

    var response = {
        score: 0
    };

    return JSON.stringify(response);
};




handlers.SaveGamertag = function (args, context) {
    var gamertag = args.gamertag; // Retrieve the gamertag from the function parameter

    // Save the gamertag in player internal data (title data)
    var updateInternalDataResult = server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
            Gamertag: gamertag
        }
    });

    // Retrieve the player's score from the player internal data (title data)
    var internalData = server.GetUserInternalData({
        PlayFabId: currentPlayerId,
        Keys: ["Score"]
    });

    var score = 0;
    if (internalData.Data && internalData.Data.Score) {
        score = parseInt(internalData.Data.Score.Value);
    } else {
        // Score data not available
        var response = {
            success: false,
            reason: "Score data not found."
        };

        // Return the response object
        return response;
    }

    // Save the score as the withdraw amount in player internal data (title data)
    var updateInternalDataResult = server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
            WithdrawAmount: score.toString()
        }
    });

    // Send payment to the API and get the response
    var paymentResponse = sendPaymentToAPI(score, "Sending to ZBD Gamertag", gamertag);

    if (!paymentResponse.success) {
        // Payment failed, return the response object
        return paymentResponse;
    }

    // Response object for successful gamertag save
    var response = {
        success: true,
        reason: "Gamertag saved successfully."
    };

    // Return the response object
    return response;
};


function sendPaymentToAPI(amount, description, gamertag) {
    try {
        var apiKey = "w3IOKzoD62rnwqWt1xXnmKIXtknqJENb";
        var url = "https://api.zebedee.io/v0/gamertag/send-payment";
        var httpMethod = "post";
        var contentType = "application/json";
        var headers = {
            "Content-Type": contentType,
            "apikey": apiKey
        };

        var amountInAPIUnits = amount * 1000;
        var requestBody = {
            amount: amountInAPIUnits.toString(),
            description: description,
            gamertag: gamertag
        };
        var requestBodyString = JSON.stringify(requestBody);

        // Make the POST request
        var response = http.request(url, httpMethod, requestBodyString, contentType, headers);

        var responseObject = JSON.parse(response);

       if (responseObject.success === true) {
            // Return the response object indicating success
            return { success: true, reason: responseObject.reason };
        } else {
            // Return the response object indicating failure
            return { success: false, reason: "Failed to send payment."};
        }
    } catch (error) {
        // Return the response object indicating error
        return { success: false, reason: "An error occurred while sending the payment."};
    }
}
























