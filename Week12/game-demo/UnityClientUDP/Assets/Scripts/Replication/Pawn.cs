﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Pawn : NetworkObject
{
    new public static string classID = "PAWN";
    //new public  int networkID = 12;

    public override void Serialize()
    {
         
    }

    public override int Deserialize(Buffer packet)
    {
        return base.Deserialize(packet);
    }


}
