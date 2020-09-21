using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ChatHandler : MonoBehaviour
{
    public TextMeshProUGUI displayText;
    public string host = "127.0.0.1";
    public ushort port = 320;
    TcpClient socketToServer = new TcpClient();
    public int tempInt;
    public InputField inputHost;
    public InputField inputPort;
    public InputField inputUserName;
    public Canvas defaultCanvas;
    public Canvas chatCanvas;
    string buffer = "";
    public TMP_InputField inputChat;
   //public InputField inputChat;
    

    public TextMeshProUGUI scrollDisplay;
    public void Start()
    {
        chatCanvas.enabled = false;
    }
    public void TitleScreenDoneWithInput()
    {
        if(inputUserName && inputPort && inputHost)
        {
            host = inputHost.text;
            port =(ushort)Convert.ToInt32(inputPort.text);
           
            DoConnect();
        }
        else
        {
            displayText.text = "Please enter a valid host,port, and username";
        }
    }

    public void ChatSceneDoneWithInput()
    {
        if(new Regex(@"^\\list$", RegexOptions.IgnoreCase).IsMatch(inputChat.text))
        {
            SendPacketToServer(Packet.BuildListRequest());
            inputChat.text = "";
        }
        else if(! new Regex(@"^(\s|\t)*$").IsMatch(inputChat.text))
        {
            SendPacketToServer(Packet.BuildChat(inputChat.text));
            inputChat.text = "";
        }

        inputChat.Select();
        inputChat.ActivateInputField();
        
    }

    async void DoConnect()
    {
        try
        {
            await socketToServer.ConnectAsync(host, port);
            //WE switch over to the other chat here
            defaultCanvas.enabled = false;
            chatCanvas.enabled = true;
            //SEND NAME PACKET HERE
            SendPacketToServer(Packet.BuildName(inputUserName.text));
        }
        catch(Exception e)
        {
            displayText.text = $"Error: {e.Message}";
            return;
        }
        SendPacketToServer(Packet.BuildName(inputUserName.text));
        while (true)
        {
            byte[] data = new byte[4096];
            int bytesRead = await socketToServer.GetStream().ReadAsync(data, 0, data.Length);

            buffer += Encoding.ASCII.GetString(data).Substring(0, bytesRead);

            string[] packets = buffer.Split('\n');

            buffer = packets[packets.Length - 1];

            for(int i = 0; i < packets.Length-1; i ++)
            {
                HandlePacket(packets[i]);
            }
        }
    }

    void HandlePacket(string packet)
    {
        string[] parts = packet.Split('\t');

        switch(parts[0])
        {
            case "CHAT":
                string user = parts[1];
                string message = parts[2];

                AddPacketToScreen($"{user} : {message}");
                break;
            case "LIST":
                string users = "Users On Server: ";
                for(int i = 1;  i < parts.Length; i++)
                {
                    if (i > 1) users += " , ";
                    users += parts[i];
                }

                //ADD MESSAGE TO CHAT DISPLAY HERE
                AddPacketToScreen(users);
                break;
        }
    }

    public void AddPacketToScreen(string text)
    {
        scrollDisplay.text += $"{text}\n";
    }

    public void SendPacketToServer(string packet)
    {
        if(socketToServer.Connected)
        {
            byte[] data = Encoding.ASCII.GetBytes(packet);
            socketToServer.GetStream().Write(data, 0, data.Length);
        }
    }
    

  

    // Update is called once per frame
    void Update()
    {
        
    }
}
