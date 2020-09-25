using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;


public struct GridPOS
{
    public int X;
    public int Y;
    public GridPOS(int X, int Y)
    {
        this.X = X;
        this.Y = Y;
    }

    public override string ToString()
    {
        return $"({X}, {Y})";
    }

}//struct is like a class but way it works in memory is different//variables in structs make copies rather than pointers

public class ButtonXO : MonoBehaviour
{
    public GridPOS pos;

    public void Init(GridPOS pos, UnityAction callback)
    {
        this.pos = pos;
        Button bttn = GetComponent<Button>();
        //bttn.onClick.AddListener(new UnityEngine.Events.UnityAction(ButtonClicked));//Traditional way to do it

        //More javascript looking way of doing this
        /* bttn.onClick.AddListener(() =>
         {
             ButtonClicked();
         });*/
        bttn.onClick.AddListener(callback);
    }

    public void ButtonClicked()
    {
        print("I have been clicked");
    }
}
