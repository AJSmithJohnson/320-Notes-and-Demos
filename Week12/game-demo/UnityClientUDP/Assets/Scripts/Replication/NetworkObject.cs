using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NetworkObject 
{
    public int networkID;
    public static string classID = "NWOB";


    //will want to override these methods in child classes
    public virtual void Serialize()//serialization is taking an object and making it something we can store
    {
        //{
        // x: 0,
        // y: 0,
        // z: 0,
        //} // we would create a function that would write this information to a string serializing it
        //then write it to a database
        //then we would deserialize it back to a game object
        //json is a way to serialize info
        //xml is another way to serialize stuff but is "old hat" // but xml is probably too much to send over a network

        //TODO: turn object into a byte array


    }

    public virtual void Deserialize()
    {

    }
}
