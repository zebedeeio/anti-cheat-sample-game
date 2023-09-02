using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Coins : MonoBehaviour
{

    public float speed = 5f;
    private float leftEdge;

    private void Start()
    {
        leftEdge = Camera.main.ScreenToWorldPoint(Vector3.zero).x - 1f;
    }

    private void Update()
    {
        transform.position += Vector3.left * speed * Time.deltaTime;

        if (transform.position.x < leftEdge)
        {
            Destroy(gameObject);
        }
    }



    private void OnTriggerEnter2D(Collider2D other)
    {
        
        if (other.gameObject.CompareTag("Player"))
        {
           
            gameObject.SetActive(false);
            Destroy(gameObject, 2f);
        }
    }
}
