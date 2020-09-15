using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;
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

    string buffer = "";

    static class Packet
    {
        public static string BuildChat(string message)
        {
            return $"CHAT\t{message}\n";
        }

        public static string BuildDM(string recipient, string message)
        {
            return $"DMSG\t{recipient}\t{message}\n";
        }

        public static string BuildName(string newName)
        {
            return $"NAME\t{newName}\n";
        }

        public static string BuildListRequest()
        {
            return $"LIST\n";
        }
    }


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
        
        /*while(true)
        {
            byte[] data = new byte[socketToServer.Available];
             await   socketToServer.GetStream().ReadAsync(data, 0, data.Length);
            print(Encoding.ASCII.GetString(data));
            AddMessageToChatDisplay(Encoding.ASCII.GetString(data));//TODO: THere was a last bit of code here I need to double check
        }*/
        while(true)
        {
            byte[] data = new byte[4096];
            int bytesRead = await socketToServer.GetStream().ReadAsync(data, 0, data.Length);//if you don't have an await here it returns a task with an integer//the integer is how many bytes were read

            buffer += Encoding.ASCII.GetString(data).Substring(0, bytesRead);

            string[] packets = buffer.Split('\n');//in c# a character has '' single qoutations while a string has "" double qoutations

            buffer = packets[packets.Length - 1];


            //process all packets except the last one
            for (int i = 0; i < packets.Length-1; i++)
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

                AddMessageToChatDisplay($"{user} : {message}");
                break;
            case "LIST":

                string users = "Users on Server: ";

                for (int i = 1; i < parts.Length; i++)
                {
                    if (i > 1) users += " , ";
                    users += parts[i];
                    
                }

                AddMessageToChatDisplay(users);

                break;
        }
    }

    public void AddMessageToChatDisplay(string txt)
    {
        chatDisplay.text += $"{txt}\n";
    }

    //LEARN REGULAR EXPRESSIONS THEY WILL BE VERY USEFULL IN AREAS OUTSIDE OF GAME DEV
    
    public void UserDoneEditingMessage(string txt)
    {

        
        if (new Regex("^\\\\name ", RegexOptions.IgnoreCase).IsMatch(txt))
        {
            //if user wants to change their name............
            string name = txt.Substring(6);
            SendPacketToServer(Packet.BuildName(name));
            otherDisplay.text = "";
        }
        else if(new Regex(@"^\\list$", RegexOptions.IgnoreCase).IsMatch(txt))
        {
            //user is requesting list of all users
            SendPacketToServer(Packet.BuildListRequest());
            otherDisplay.text = "";
        }
        else if (!new Regex(@"^(\s|\t)*$").IsMatch(txt))
        {
            SendPacketToServer(Packet.BuildChat(txt));
            otherDisplay.text = "";
        }

        

        otherDisplay.Select();
        otherDisplay.ActivateInputField();
    }

    public void SendPacketToServer(string packet)
    {
        //packet += "\n"; //already doing that up above

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
