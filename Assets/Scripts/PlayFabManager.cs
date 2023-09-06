using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using Beebyte.Obfuscator;
using Firebase.AppCheck;
using Firebase.Extensions;
using MiniJSON;
using PlayFab;
using PlayFab.ClientModels;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class PlayFabManager : MonoBehaviour
{



    [Header("PlayFab Configuration")]

    public static PlayFabManager Instance;

    public string userPlayfabId;
    public string titleId;
    [Header("Player Score")]

    public Text PlayerScoreText;
    public Text HighScoreText;

    [Header("Earn Notification Panel")]
    public GameObject NotificationPanel;

    [Header("Withdraw Panel")]
    public GameObject WithdrawPanel;
    public Text WithdrawScoreText;
    public InputField GamerTagField;

    [Header("Error Panel")]
    public GameObject ErrorPanel;
    public Text ErrorText;

    [Header("Success Panel")]
    public GameObject SuccessPanel;

    [Header("Play Button")]
    public Button PlayButton;

    [Header("Withdraw Button")]
    public Button WithdrawButton;

    private string appCheckToken;
    private int maxEarnScore = 0;
    private void Awake()
    {
        Instance = this;
    }
    #region Login PlayFab
    // Start is called before the first frame update
    void Start()
    {

        if (string.IsNullOrEmpty(PlayFabSettings.staticSettings.TitleId))
        {
            PlayFabSettings.staticSettings.TitleId = titleId; // Please change this value to your own titleId from PlayFab Game Manager

        }

        try
        {
            FirebaseAppCheck.SetAppCheckProviderFactory(PlayIntegrityProviderFactory.Instance);
        }
        catch (System.Exception e)
        {
            Debug.LogError(e);
        }



        Login();

    }

    void GetAppCheckToken()
    {
        Debug.Log("device check start1");
        FirebaseAppCheck.DefaultInstance.GetAppCheckTokenAsync(true).ContinueWithOnMainThread(task =>
        {
            if (task.IsFaulted)
            {
                Debug.LogError("device check s Failed to get the App Check token: " + task.Exception);
                appCheckToken = "error";

            }
            else
            {

                var token = task.Result;
                appCheckToken = token.Token;
                Debug.Log("device check App Check Token: " + token.Token);
            }

            StartCoroutine(VerifyUser());

        });
    }
    private void Login()
    {
        var request = new LoginWithCustomIDRequest { CustomId = SystemInfo.deviceUniqueIdentifier, CreateAccount = true };
        PlayFabClientAPI.LoginWithCustomID(request, OnLoginSuccess, OnLoginFailure);

    }
    private void OnLoginFailure(PlayFabError error)
    {
        Debug.LogWarning("Failed to log in to PlayFab. Error: " + error.GenerateErrorReport());
    }


    [System.Serializable]
    public class DataObject
    {
        public string appCheckToken;
        public string playFabId;
    }
    private IEnumerator VerifyUser()
    {
        DataObject data = new DataObject();
        data.appCheckToken = appCheckToken;
        data.playFabId = userPlayfabId;


        string jsonData = JsonUtility.ToJson(data);
        UnityWebRequest www = new UnityWebRequest("https://anticheat-example-server-5c67778cdc0e.herokuapp.com/verify-app-check-token", "POST");
        byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
        www.uploadHandler = new UploadHandlerRaw(bodyRaw);
        www.downloadHandler = new DownloadHandlerBuffer();
        www.SetRequestHeader("Content-Type", "application/json");

        yield return www.SendWebRequest();

        if (www.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError("Error sending POST: " + www.error);
        }
        else
        {
            Debug.Log("POST successful! Response:\n" + www.downloadHandler.text);
        }


    }


    private void OnLoginSuccess(LoginResult result)
    {
        Debug.Log("Successfully logged in to PlayFab.");
        userPlayfabId = result.PlayFabId;


        var request = new ExecuteCloudScriptRequest
        {
            FunctionName = "GetEarnModeScore", // The name of the cloud script function


            GeneratePlayStreamEvent = true
        };

        PlayFabClientAPI.ExecuteCloudScript(request, OnCloudScriptSuccess, OnCloudScriptFailure);

        Firebase.FirebaseApp.CheckAndFixDependenciesAsync().ContinueWith(task =>
        {
            var dependencyStatus = task.Result;
            if (dependencyStatus == Firebase.DependencyStatus.Available)
            {
                Debug.Log("Device check0");
                GetAppCheckToken();



            }
            else
            {
                UnityEngine.Debug.LogError(System.String.Format(
                  "Superscale-Firebase: Could not resolve all Firebase dependencies: {0}", dependencyStatus));
                // Firebase Unity SDK is not safe to use here.
            }
        });




    }
    private void OnCloudScriptSuccess(ExecuteCloudScriptResult result)
    {


        if (result.FunctionResult != null)
        {
            var jsonResult = result.FunctionResult.ToString();
            var response = Json.Deserialize(jsonResult) as Dictionary<string, object>;

            if (response != null && response.ContainsKey("earnModeScore") && response["earnModeScore"] is long earnModeScore)
            {

                Debug.Log("MAX_EARN_SCORE: " + (int)earnModeScore);

                // Call a method or update UI in Unity to display the maxEarnScore
                maxEarnScore = (int)earnModeScore;

                PlayButton.interactable = true;
            }
            else
            {
                Debug.LogError("Invalid earnModeScore value received from Cloud Script");
            }
        }
        else
        {
            Debug.LogError("Invalid FunctionResult received from Cloud Script");
        }


    }

    private void OnCloudScriptFailure(PlayFabError error)
    {

        Debug.LogWarning("Failed to execute cloud script. Error: " + error.GenerateErrorReport());
    }
    #endregion






    // Call this method whenever the player avoids an obstacle to increase and save the score
    public void IncreaseAndSaveScore()
    {
        // Update the score in PlayFab statistics
        UpdatePlayerScore();


    }

    // Update the player score statistic in PlayFab
    private void UpdatePlayerScore()
    {
        string proof = GameManager.Instance.CreateProof();
        var request = new ExecuteCloudScriptRequest
        {
            FunctionName = "updateAndRetrieveScore",
            GeneratePlayStreamEvent = true,
            FunctionParameter = new { payload = proof }
        };

        PlayFabClientAPI.ExecuteCloudScript(request, OnCloudScriptExecuted, OnCloudScriptError);

    }
    private void OnCloudScriptExecuted(ExecuteCloudScriptResult result)
    {
        if (result.FunctionResult != null)
        {
            var jsonResult = result.FunctionResult.ToString();
            var response = Json.Deserialize(jsonResult) as Dictionary<string, object>;

            if (response != null && response.ContainsKey("score") && response["score"] is long score &&
                response.ContainsKey("highScore") && response["highScore"] is long highScore)
            {
                // Display the score and high score in Unity
                DisplayScore((int)score);
                DisplayHighScore((int)highScore);
            }
            else
            {
                if (response != null && response.ContainsKey("message"))
                {
                    Debug.Log(response["message"]);
                }
                else
                {
                    Debug.LogError("Invalid score value received from Cloud Script");
                }
            }
        }
        else
        {
            Debug.LogError("Invalid FunctionResult received from Cloud Script");
        }

    }

    private void OnCloudScriptError(PlayFabError error)
    {
        // Handle any errors that occur during the API calls
        Debug.LogError("PlayFab Error: " + error.GenerateErrorReport());
    }


    // Display the score in Unity (you can replace this with your own implementation)
    private void DisplayScore(int score)
    {
        Debug.Log("Current Score: " + score);
        PlayerScoreText.text = score.ToString();

    }
    // Display the high score in Unity
    private void DisplayHighScore(int highScore)
    {
        HighScoreText.text = highScore.ToString();

    }
    [SkipRename]
    public void ResetScoreOnStart()
    {

        ResetScore();
    }

    public void ResetScore()
    {

        var request = new ExecuteCloudScriptRequest
        {
            FunctionName = "resetScore",
            GeneratePlayStreamEvent = true
        };

        PlayFabClientAPI.ExecuteCloudScript(request, OnCloudScriptExecutedReset, OnCloudScriptErrorReset);
    }



    private void OnCloudScriptExecutedReset(ExecuteCloudScriptResult result)
    {
        if (result.FunctionResult != null)
        {
            var jsonResult = result.FunctionResult.ToString();
            var response = Json.Deserialize(jsonResult) as Dictionary<string, object>;

            if (response != null && response.ContainsKey("score"))
            {
                // Reset the score to 0 in Unity
                var score = (long)response["score"];
                PlayerScoreText.text = score.ToString();

                Debug.Log("Score reset to 0");
            }
            else
            {
                Debug.LogError("Invalid score value received from Cloud Script");
            }
        }
        else
        {
            Debug.LogError("Invalid FunctionResult received from Cloud Script");
        }
    }

    private void OnCloudScriptErrorReset(PlayFabError error)
    {
        Debug.LogError("PlayFab Error: " + error.GenerateErrorReport());
    }

    private void Update()
    {
        if (maxEarnScore != 0)
        {
            UnlockEarnMode();
        }

    }

    private void UnlockEarnMode()
    {
        if (!PlayerPrefs.HasKey("EarnMode"))
        {

            int score = int.Parse(PlayerScoreText.text);
            if (score >= maxEarnScore)
            {
                NotificationPanel.SetActive(true);
                PlayerPrefs.SetInt("EarnMode", 1);
                Debug.Log("EarnMode unloacked " + score);
                PlayerPrefs.Save();


            }
        }

    }
    [SkipRename]
    public void WithdrawMethod()
    {
        SaveGamertag();
    }

    // Call this method to save the gamertag in player's internal data (title data)
    public void SaveGamertag()
    {
        WithdrawButton.interactable = false;
        PlayFabClientAPI.ExecuteCloudScript(new ExecuteCloudScriptRequest()
        {
            FunctionName = "SaveGamertag",
            FunctionParameter = new { gamertag = GamerTagField.text },
            GeneratePlayStreamEvent = true
        }, OnCloudScriptExecutedData, OnCloudScriptErrorData);
    }


    private void OnCloudScriptExecutedData(ExecuteCloudScriptResult result)
    {

        if (result.FunctionResult != null)
        {
            var jsonResult = result.FunctionResult.ToString();
            var response = Json.Deserialize(jsonResult) as Dictionary<string, object>;

            if (response != null && response.ContainsKey("success") && response["success"] is bool success)
            {
                string suc = response["success"].ToString();
                Debug.Log("Reason  of request : " + suc);
                if (success)
                {
                    Debug.Log("Reason  of request : " + response["reason"]);
                    WithdrawPanel.SetActive(false);
                    SuccessPanel.SetActive(true);
                    ResetScoreOnStart();
                }
                else
                {
                    Debug.LogError("Reason  of request  " + response["reason"]);
                    ErrorText.text = response["reason"].ToString();
                    WithdrawPanel.SetActive(false);
                    ErrorPanel.SetActive(true);
                    ResetScoreOnStart();
                }
            }
            else
            {
                Debug.LogError("^Invalid response received from Cloud Script^");
            }
        }
        else
        {
            Debug.LogError("Invalid FunctionResult received from Cloud Script");
        }
        WithdrawButton.interactable = true;
    }

    private void OnCloudScriptErrorData(PlayFabError error)
    {
        Debug.LogError("^PlayFab Error:^ " + error.GenerateErrorReport());
        WithdrawButton.interactable = true;
    }



    public void ShowwithdrawPanel()
    {
        if (PlayerPrefs.HasKey("EarnModeUnlocked"))
        {
            int score = int.Parse(PlayerScoreText.text);
            if (score > 0)
            {
                WithdrawScoreText.text = score.ToString();
                WithdrawPanel.SetActive(true);
            }



        }



    }
}
