using System;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using TMPro;
using UnityEngine;

public class NewBehaviourScript : MonoBehaviour
{

    public string host = "127.0.0.1";
    public ushort port = 320; //ushort is fewer bytes than a int and prevents us from going out o range
    TcpClient socketToServer = new TcpClient();

    public TextMeshProUGUI chatDisplay;
    //public TMP_InputField inputDisplay;
    public TMP_InputField otherDisplay;
    // Start is called before the first frame update
    void Start()
    {
        DoConnect();
    }

    async void DoConnect()
    {
        try
        {
            await socketToServer.ConnectAsync(host, port);
            AddMessageToChatDisplay("Successsfully connected to server");
        }
        catch(Exception e)
        {
            //print("oh no you've got errors" + e.Message);
            AddMessageToChatDisplay($"Error:  {e.Message}");
            return;
        }
        
        while(true)
        {
            byte[] data = new byte[socketToServer.Available];
             await   socketToServer.GetStream().ReadAsync(data, 0, data.Length);
            print(Encoding.ASCII.GetString(data));
            AddMessageToChatDisplay(Encoding.ASCII.GetString(data));//TODO: THere was a last bit of code here I need to double check
        }
    }


    public void AddMessageToChatDisplay(string txt)
    {
        chatDisplay.text += $"{txt}\n";
    }

    public void UserDoneEditingMessage(string txt)
    {
        SendMessageToServer(txt);
        otherDisplay.text = "";
        otherDisplay.Select();
        otherDisplay.ActivateInputField();
    }

    public void SendMessageToServer(string txt)
    {
        if(socketToServer.Connected)
        {
            byte[] data = Encoding.ASCII.GetBytes(txt);
            socketToServer.GetStream().Write(data, 0, data.Length);
        }
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
