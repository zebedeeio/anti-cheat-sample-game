using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class GameManager : MonoBehaviour
{


    public static GameManager Instance;
    public Player player;
    public Spawner spawner;

    public Text scoreText;
    public Text currentHighScoreText;
    public Text WithdrawScoreText;
    public GameObject playButton;
    public GameObject gameOver;
    public GameObject HighScore;
    public GameObject WithdrawPanel;
    public GameObject ErrorPanel;
    public GameObject SuccessPanel;
    public GameObject NotificationPanel;
    public Button WithdrawButton;
    public InputField GamerTagField;
    public GameObject WarningText;


  
    public int WithdrawScore = 5;



    private int currentHighScore;
    private int currentscore;

    private string apiUrl = "https://api.zebedee.io/v0/gamertag/send-payment";
    private string apiKey = "w3IOKzoD62rnwqWt1xXnmKIXtknqJENb";
    private string gamertag = "souleima03a12495";
  

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(this);
        }
        else
        {
            Instance = this;
        }
        Application.targetFrameRate = 60;
        Pause();
    }
    private void Update()
    {
        UnlockEarnMode();
    }
    public void Play()
    {
        currentscore = 0;
        scoreText.text = currentscore.ToString();

        playButton.SetActive(false);
        gameOver.SetActive(false);
        HighScore.SetActive(false);
        Time.timeScale = 1f;
        player.enabled = true;

        Pipes[] pipes = FindObjectsOfType<Pipes>();

        for (int i = 0; i < pipes.Length; i++) {
            Destroy(pipes[i].gameObject);
        }
    }

    public void GameOver()
    {
       
        CheckForNewHighScore();
        LoadHighScore();
        ShowwithdrawPanel();
        playButton.SetActive(true);
        gameOver.SetActive(true);
        HighScore.SetActive(true);
        Pause();
        if (PlayerPrefs.HasKey("EarnMode"))
        {
            PlayerPrefs.SetInt("EarnModeUnlocked", 1);
            PlayerPrefs.Save();
        }
    }

    public void Pause()
    {
        Time.timeScale = 0f;
        player.enabled = false;
    }

    public void IncreaseScore()
    {
        currentscore++;
        scoreText.text = currentscore.ToString();
    }

    private void LoadHighScore()
    {
        currentHighScore = PlayerPrefs.GetInt("HighScore");
        currentHighScoreText.text = currentHighScore.ToString();
    }

    private void CheckForNewHighScore()
    {
          if (currentscore >= currentHighScore)
            {
                currentHighScore = currentscore;
                SaveHighScore();
                


            }
     
      
    }

    private void SaveHighScore()
    {
        PlayerPrefs.SetInt("HighScore", currentHighScore);
        PlayerPrefs.Save();
    }

    private void UnlockEarnMode()
    {
        if(!PlayerPrefs.HasKey("EarnMode"))
        {
            if (currentscore >= WithdrawScore)
            {
                NotificationPanel.SetActive(true);
                PlayerPrefs.SetInt("EarnMode", 1);
                PlayerPrefs.Save();


            }
        }
        
    }
    private void ShowwithdrawPanel()
    {
        if( PlayerPrefs.HasKey("EarnModeUnlocked"))
        {
            if( currentscore > 0)
            {
                WithdrawScoreText.text = currentscore.ToString();
                WithdrawPanel.SetActive(true);
            }
               

            
        }
      
       

    }

    public void ClaimSats()
    {
        if (string.IsNullOrEmpty(GamerTagField.text))
        {
            WarningText.SetActive(true);
        }
        else
        {
            WarningText.SetActive(false);
            int amount = currentscore;
            Debug.Log("Amount sats to claim : " + amount);
            WithdrawButton.interactable = false;
            gamertag = GamerTagField.text;
            StartCoroutine(MakePostRequest(gamertag, amount));
        }

      
    }

    private IEnumerator MakePostRequest(string gamertag, int amount)
    {
        Debug.Log("MakePostRequest: " + amount);

        // Create the request
        UnityWebRequest request = UnityWebRequest.Post(apiUrl, "");

        // Set the content type header
        request.SetRequestHeader("Content-Type", "application/json");

        // Set the API key header
        request.SetRequestHeader("apikey", apiKey);

        Debug.Log("request progress: " + amount);
        amount = amount * 1000;
        // Create the request body object
        RequestBody requestBody = new RequestBody
        {
            amount = amount,
            description = "Sending to ZBD Gamertag",
            gamertag = gamertag
        };

        // Serialize the request body object to JSON
        string jsonBody = JsonUtility.ToJson(requestBody);

        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonBody);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);

        // Send the request
        yield return request.SendWebRequest();

        // Check for errors
        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.Log("Request error: " + request.error);
            WithdrawPanel.SetActive(false);
            ErrorPanel.SetActive(true);
            WithdrawButton.interactable = true;
        }
        else
        {
            Debug.Log("Request successful!");
            // Process the response here
            Debug.Log(request.downloadHandler.text);
            WithdrawPanel.SetActive(false);
            WithdrawButton.interactable = true;
            SuccessPanel.SetActive(true);
        }
    }


    [System.Serializable]
    public class RequestBody
    {
        public int amount;
        public string description;
        public string gamertag;
    }
}


