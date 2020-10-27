using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using System.Net.Sockets;
using TMPro;
using System;

public class ControllerGameClient : MonoBehaviour
{
    static public ControllerGameClient singleTon;
    TcpClient socket = new TcpClient();
    Buffer buffer = Buffer.Alloc(0);
    public TMP_InputField inputHost;
    public TMP_InputField inputPort;
    public TMP_InputField inputUsername;
    public Transform panelHostDetails;
    public Transform panelUsername;
    public ControllerGameplay panelGameplay;
    
    
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

            //show connection screen
            panelHostDetails.gameObject.SetActive(true);
            panelUsername.gameObject.SetActive(false);
            panelGameplay.gameObject.SetActive(false);
        }

        //test Buffer class;
        //Buffer buff = Buffer.Alloc(10);//should create a new byte array that holds 10 bytes
        //Buffer buff = Buffer.From("Hello World");

        /*  buff.Concat(Buffer.From("A WHOLE OTHER HELLO WORLD"));
          //buff.WriteInt8(-123, 1);
          //buff.WriteBytes(new byte[] { 0, 5}, 0);
          //buff.WriteUInt16LE(517, 0);
          //print(buff.ReadUInt16LE(0));
          //print(buff.ReadUInt16BE(0));
          print(buff);
          print(buff.ReadString());*/
       

    }
   
    public void OnButtonConnect()
    {
        string host = inputHost.text;
        UInt16.TryParse(inputPort.text, out ushort port); //creates a variable in line
        TryToConnect(host, port);
    }

    public void OnButtonUsername()
    {
        string user = inputUsername.text;

        Buffer packet = PacketBuilder.Join(user);
        print(packet);
        SendPacketToServer(packet);


    }


    async public void TryToConnect(string host, int port)
    {
        if (socket.Connected) return;//already connected to a server backs out
        try
        {
            await socket.ConnectAsync(host, port);

            panelHostDetails.gameObject.SetActive(false);
            panelUsername.gameObject.SetActive(true);
            panelGameplay.gameObject.SetActive(false);

            StartReceivingPackets();
        }
        catch(Exception e)
        {
            print("FAILED TO CONNECT OH NOOOOOOOOOOOO" + e.ToString());

            panelHostDetails.gameObject.SetActive(true);
            panelUsername.gameObject.SetActive(false);
            panelGameplay.gameObject.SetActive(false);
        }
        
    }

    async private void StartReceivingPackets()
    {
        int maxPacketSize = 4096;

        while(socket.Connected)
        {
            byte[] data = new byte[maxPacketSize];

            try
            {
                int bytesRead = await socket.GetStream().ReadAsync(data, 0, maxPacketSize);
                buffer.Concat(data, bytesRead);

                ProcessPackets();
            }
            catch(Exception e)
            {

            }
            
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    void ProcessPackets()
    {
        if (buffer.length < 4) return;//not enough data in buffer

        string packetIdentifier = buffer.ReadString(0, 4);
        switch(packetIdentifier)
        {
            case "JOIN":
                if (buffer.length < 5) return;//not enough data for a join packet
                byte joinResponse = buffer.ReadUInt8(4);

                if(joinResponse == 1 || joinResponse == 2 || joinResponse == 3)
                {
                    // TODO: CHange which screen we are looking at
                    panelHostDetails.gameObject.SetActive(false);
                    panelUsername.gameObject.SetActive(false);
                    panelGameplay.gameObject.SetActive(true);
                }else if(joinResponse == 9)
                {
                    panelHostDetails.gameObject.SetActive(true);
                    panelUsername.gameObject.SetActive(false);
                    panelGameplay.gameObject.SetActive(false);
                }
                else
                {
                    //TODO: PRINT ERROR MESSAGE TO USER

                    //Then send user to screen
                    panelHostDetails.gameObject.SetActive(false);
                    panelUsername.gameObject.SetActive(true);
                    panelGameplay.gameObject.SetActive(false);
                    print(joinResponse);
                }
                
                //TODO: REMOVE 5 bites from buffer or CONSUME DATA FROM BUFFER
                buffer.Consume(5);
                break;
            case "UPDT":
                if (buffer.length < 15) return;//not enough data for a UPDT packet
                byte whoseTurn = buffer.ReadUInt8(4);
                byte gameStatus = buffer.ReadUInt8(5);
                byte[] spaces = new byte[9];
                for(int i = 0; i < 9; i ++)
                {
                   spaces[i] = buffer.ReadUInt8(6 + i);
                }
                //switch to gameplay screen...
                // TODO: CHange which screen we are looking at
                panelHostDetails.gameObject.SetActive(false);
                panelUsername.gameObject.SetActive(false);
                panelGameplay.gameObject.SetActive(true);
                
                panelGameplay.UpdateFromServer(gameStatus, whoseTurn, spaces);
                
                
                buffer.Consume(15);
                break;
            case "CHAT":
                byte usernameLength = buffer.ReadByte(4);

                ushort messageLength = buffer.ReadUInt16BE(5);

                if (buffer.length < 7 + usernameLength + messageLength) return;

                string username = buffer.ReadString(7, usernameLength);
                string message = buffer.ReadString(7 + usernameLength, messageLength);
                //TODO: switch you to gameplay screen if you are not on the screen alread
                panelHostDetails.gameObject.SetActive(false);
                panelUsername.gameObject.SetActive(false);
                panelGameplay.gameObject.SetActive(true);
                //TODO: update chat view
                //TODO: CONSUME DATA
                buffer.Consume(7 + usernameLength + messageLength);
                break;
            default:
                print("Unknown packet identified HOW COULD YOU DO THIS");

                

                buffer.Clear();
                
                break;

        }
    }

    async public void SendPacketToServer(Buffer packet)
    {
        if (!socket.Connected) return; //we want to leave because we aren't connected to the server//We could maybe make this a bool that returns false if we are not connected
        await socket.GetStream().WriteAsync(packet.bytes, 0, packet.bytes.Length);
    }

    public void SendPlayPacket(int x, int y)
    {
        SendPacketToServer(PacketBuilder.Play(x, y));
        
    }
}
