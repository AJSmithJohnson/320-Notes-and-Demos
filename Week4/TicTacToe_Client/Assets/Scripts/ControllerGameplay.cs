using System;
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
        ControllerGameClient.singleTon.SendPlayPacket(bttn.pos.X, bttn.pos.Y);
    }

   
    // 0 1 2
    // 3 4 5
    // 6 7 8
    internal void UpdateFromServer(byte gameStatus, byte whoseTurn, byte[] spaces)
    {
        //Empty messages actually slow game down is recommended you remove them
        for (int i = 0; i < spaces.Length; i++)
        {
            byte b = spaces[i];
            int y = i / 3;
            int x = i % 3;

            boardUI[x, y].SetOwner(b);
        }
    }
}
