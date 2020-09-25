﻿using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public enum Player
{
    Nobody,
    PlayerX,
    PlayerO
}

public class ControllerGameplay : MonoBehaviour
{
    private int columns = 3;
    private int rows = 3;

    public ButtonXO bttnPrefab;//reference to the button prefab based on the script on it
    private Player whoseTurn = Player.PlayerX;//Isn't neccasarily needed server should set the player
    private Player[,] boardModel;//Enum of abstracted button states//all the data of who owns what 
    private ButtonXO[,] boardUI;

    public Transform panelGameBoard;//panel that holds the grid of buttons
    // Start is called before the first frame update
    void Start()
    {
        BuildBoardUI();
    }

    private void BuildBoardUI()
    {
        boardUI = new ButtonXO[columns, rows];//instantiating array for buttons
        for(int x = 0; x < columns; x++)
        {
            for(int y = 0; y < rows; y++)
            {
               ButtonXO bttn = Instantiate(bttnPrefab, panelGameBoard);
                bttn.Init(new GridPOS(x,y), ()=> { ButtonClicked(bttn); });//we can control what this button does from the controller script where we instantiate the button
                boardUI[x, y] = bttn;
                
            }
        }
        

    }


    void ButtonClicked(ButtonXO bttn)
    {

        //print("A BUTTON WAS CLICKED");
        print($"a button was clicked{bttn.pos}");
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
