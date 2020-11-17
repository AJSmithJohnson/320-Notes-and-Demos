﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Reflection;

public delegate NetworkObject SpawnDelegate();
static public class ObjectRegistry 
{
    static private Dictionary<string, Type> registeredTypes = new Dictionary<string, Type>();

    static public void RegisterAll()
    {
        //RegisterClass(Pawn.classID, ()=> {return new Pawn(); });
        RegisterClass<Pawn>();
    }

   

    static public void RegisterClass<T> () where T : NetworkObject
    {
        //lookup reflection and generics
        
        string classID = (string) typeof(T).GetField("classID").GetValue(null);


        registeredTypes.Add(classID, typeof(T));
    }

    static public NetworkObject SpawnFrom(string classID)
    {
        if(    registeredTypes.ContainsKey(classID))
        {

           ConstructorInfo cinfo = registeredTypes[classID].GetConstructor(new System.Type[] { });
            return (NetworkObject)cinfo.Invoke(null);
            
        }

        return null;
    }
}