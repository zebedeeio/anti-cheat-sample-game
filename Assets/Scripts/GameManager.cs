using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class GameManager : MonoBehaviour
{


    public static GameManager Instance;
    [Header("Player Reference")]
    public Player player;
    [Header("UI  Elements")]
    public GameObject playButton;
    public GameObject gameOver;
    public GameObject HighScore;
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
 
    public void Play()
    {
        PlayFabManager.Instance.ResetScore();
      

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

       
        playButton.SetActive(true);
        gameOver.SetActive(true);
        HighScore.SetActive(true);
        PlayFabManager.Instance.ShowwithdrawPanel();
        if (PlayerPrefs.HasKey("EarnMode"))
        {
            PlayerPrefs.SetInt("EarnModeUnlocked", 1);
            PlayerPrefs.Save();
        }

        Pause();
     
    }

    public void Pause()
    {
        Time.timeScale = 0f;
        player.enabled = false;
    }

   
    
   

   

  


    

    

   
}


