using Beebyte.Obfuscator;
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

    //more secure to split this key and store it in several places
    private string key = "n4hKhuwYmvaiVQFs9VEwzq/n/JJ2Re1MZlDqziqt3BE=.hX26teFMi8zB88oaAOg8lZ/Izy8Om8XvwVfuYLOBSEU=";
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

        // string key = SimpleAES.GenerateEncryptionKeys();
        //Debug.Log("put the key in the key varible above and on the server\n" + key);


    }

    public string CreateProof()
    {


        SimpleAES encryptor = new SimpleAES();

        string randomNonce = "hello";// System.Guid.NewGuid().ToString();

        string iv = SimpleAES.GenerateEncryptionVector();

        string encrypted = encryptor.Encrypt(randomNonce, key, iv);

        string payload = encrypted + "." + iv;

        return payload;

    }

    [SkipRename]
    public void Play()
    {

        PlayFabManager.Instance.ResetScoreOnStart();

        playButton.SetActive(false);
        gameOver.SetActive(false);
        HighScore.SetActive(false);
        Time.timeScale = 1f;
        player.enabled = true;

        Pipes[] pipes = FindObjectsOfType<Pipes>();

        for (int i = 0; i < pipes.Length; i++)
        {
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


