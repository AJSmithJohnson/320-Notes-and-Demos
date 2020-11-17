using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using System.Net.Sockets;
using System;

public class ClientUDP : MonoBehaviour
{

    private static ClientUDP _singleton;
    public static ClientUDP singleton
    {
        get { return _singleton; }
        private set { _singleton = value; }

    }

    //is possible to instantiate sock with address and port if needed
    UdpClient sock = new UdpClient();//create a client called scok    //instantiate it in line

    /// <summary>
    /// Most recent ball update packet
    /// that has been recieved
    /// </summary>
    uint ackBallupdate = 0; //called ack because client server acknowledges the packet

    public Transform ball;
    void Start()
    {
        if(singleton != null)
        {
            //already have a clientUDP...
            Destroy(gameObject);
        }
        else
        {
            singleton = this;
            //set up receive loop (async)
            ListenForPackets();
            //send a packet to the server(async);
            SendPacket(Buffer.From("JOIN"));
        }

          
    }


    /// <summary>
    /// This function listens for incoming UDP packets
    /// </summary>
    async void ListenForPackets()
    {

        while(true)
        {
            UdpReceiveResult res;
            try
            {


                //could use Var res //put cursor in var, ctrl+period, then use explicit datatype to have IDE change it for you
                 res = await sock.ReceiveAsync();//create the res object
                Buffer packet = Buffer.From(res.Buffer); //Buffer from is going to take the res object and give us a packet we can process. 

                ProcessPacket(packet);
            }
            catch
            {
                break;
            }

           
        }//as soon as we are done processing packet we just start listening for another packet //this is due to an inifinite loop
        
    }


    /// <summary>
    /// This function processes a packet and decides what to do next
    /// </summary>
    /// <param name="packet">the packet to process</param>
     void ProcessPacket(Buffer packet)
    {
        if (packet.Length < 4) return; //do nothing becuase there isn't enough info to use
        string id = packet.ReadString(0, 4); //we read a string from location 0 and the first four bytes
        switch(id)
        {
            case "BALL":
                //REMEMBER WE ARE USING BIG ENDIEN ON THE SERVER AND LITTLE ENDIEN HERE BECUASE THE WAY WE PROCESS ENDIAN PACKETS HERE HAS A PROBLEM
                if (packet.Length < 20) return; // do nothing, we don't have enough info to use
                uint packetNum = packet.ReadUInt32BE(4);
                if(packetNum < ackBallupdate)
                {
                    return;//ignore packet because it's olllllldddddd
                }
                ackBallupdate = packetNum;
                print(ackBallupdate);
                float x =packet.ReadSingleBE(8);//calls em singles instead of floats
                float y = packet.ReadSingleBE(12);//calls em singles instead of floats
                float z = packet.ReadSingleBE(16);//calls em singles instead of floats

                ball.position = new Vector3(x, y, z);
               // print(x);
                //packet.Consume(16); //we don't need to consume the packets in udp
                break;
        }

    }

    async public void SendPacket(Buffer packet)//takes a packet and sends it //made public so we can access it from packetBuilder
    {
        if (sock == null) return;
        
        //TODO: Extract server and port into seperate variables
        //Buffer packet = Buffer.From("HELLO WORLD!");//should probably store IP and port somewhere else in code
        await sock.SendAsync(packet.bytes, packet.bytes.Length, "127.0.0.1", 320);
    }
    
    void Update()
    {
        
    }

    /// <summary>
    /// when destroying clean up objects\\
    /// </summary>
    private void OnDestroy()
    {
        sock.Close();//after we call on destory our loop is still running
    }
}
