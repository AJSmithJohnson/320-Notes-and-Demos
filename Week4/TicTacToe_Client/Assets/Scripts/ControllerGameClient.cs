using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using System.Net.Sockets;


public class ControllerGameClient : MonoBehaviour
{
    static ControllerGameClient singleTon;
    TcpClient socket = new TcpClient();


    // Start is called before the first frame update
    void Start()
    {
        if(singleTon)
        {
            Destroy(gameObject);//destroy this gameobject if singleton is already set because there's a singleton out there
        }
        else
        {
            singleTon = this;
            DontDestroyOnLoad(gameObject);//don't destroy this wehn we load a new scene otherwise we will loose this game object
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
