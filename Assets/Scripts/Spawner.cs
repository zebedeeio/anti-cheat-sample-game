using UnityEngine;

public class Spawner : MonoBehaviour
{

    [Header("Pipe Setting")]
    public GameObject prefab;
    public float spawnRate = 1f;
    public float minHeight = -1f;
    public float maxHeight = 2f;


    [Header("Coin Setting")]
    public GameObject coinprefab;
    public float minHeightCoin = -1f;
    public float maxHeightCoin = 2f;
    private void OnEnable()
    {
        InvokeRepeating(nameof(Spawn), spawnRate, spawnRate);
       // InvokeRepeating(nameof(SpawnCoins), 2, 10);
    }

    private void OnDisable()
    {
        CancelInvoke(nameof(Spawn));
    }

    private void Spawn()
    {
        GameObject pipes = Instantiate(prefab, transform.position, Quaternion.identity);
        pipes.transform.position += Vector3.up * Random.Range(minHeight, maxHeight);
    }

    private void SpawnCoins()
    {
        GameObject coin = Instantiate(coinprefab, transform.position + new Vector3(Random.Range(1,4), 0 , 0), Quaternion.identity);
        coin.transform.position += Vector3.right * Random.Range(minHeightCoin, maxHeightCoin);
    }


}
