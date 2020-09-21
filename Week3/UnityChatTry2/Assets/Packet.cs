using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Packet : MonoBehaviour
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
        print("YOU BUILD A NAME" + newName);
        return $"NAME\t{newName}\n";
    }

    public static string BuildListRequest()
    {
        return $"LIST\n";
    }
}
