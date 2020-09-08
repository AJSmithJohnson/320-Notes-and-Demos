using System;
using System.Net; //we need to pull the system.net namesspace
using System.Net.Sockets; //also need to pull the system.net.sockets namespace
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleChat
{

    //In this program we have two loops running
    class Program
    {
        static TcpClient socket = new TcpClient();

        static void Main(string[] args)
        {
            //TcpClient socket = new TcpClient();//This has four overloads
            //CTRL+SHIFT+Space to look at overloads when cursor is in the parenthesis
            

            //NOT USING THIS
            /* try
             {

                 //THis function is a blocking connection call it will lock up
                 //your program if this doesn't work
                 //Nowadays you want to set up an event listener and write something asynchronously
                // socket.Connect("127.0.0.1", 320);//Pass in a string for the host name and a port
             }
             catch(Exception e)
             {
                 Console.WriteLine("Error : " + e.Message);
             }*/

            //NOT USING THIS EITHER
            //This begins the connection we still need an end
            //AsynchCallback needs an IAsynchResult
            //socket.BeginConnect("127.0.0.1", 320, new AsyncCallback(HandleConnection), null);

            ConnectToServer();

       
            //Multithreading is effectively running different tasks 
            //Multithreading is a very low level process
            //Tasks are abstracted versions of multithreading
            //You can open a lot of tasks at the same time which is very safe in Unity
            //This is the multithreading example
           /* Task.Run(() =>
            {
                //This is how you would open another thread in C# kind of
                socket.Connect("127.0.0.1", 320);//threadblocking
                Console.WriteLine("WE are now connected to the server");
            })*/
            Console.WriteLine("Hello World!");

            //THis is loop 2 which is also always running
            while(true)
            {
                string input = Console.ReadLine();

                byte[] data = Encoding.ASCII.GetBytes(input); //convert input string into accii data and place in byte array

                socket.GetStream().Write(data, 0, data.Length);
            }
            
        }//ENd of main method

         async static void ConnectToServer() //async keyword doesn't neccasarily open new thread but opens a new task //backend uses tasks
        {

            // Don't have to wait for it to comeback
            //is not threadblocking
            //await makes code function as it is threadblocking,
            //the way this works is if this takes too long it will pause running the function then on the next system tick will
            //attempt this again
            try
            {


                await socket.ConnectAsync("127.0.0.1", 320);
                Console.WriteLine("We are now connected to server...");//This will probably get printed out after hello world even though it should be 
                                                                       //first
            }
            catch
            {
                Console.WriteLine("Could not connect to server....");
                return; //if we fail to connect we return back out of the function
            }

            //LOOP 1 OUR GET DATA FROM SERVER LOOP
            while(true)
            {
                //Everyone of the protocols the authers created a RFC which is a request for comments
                //everyone has a chance to comment on the protocol and make a new version
                //there is just a limit to how much info could be in a single packet
                //byte[] data = new byte[4096]; //close to maximum size of packet? Double check would be good to know
                byte[] data = new byte[socket.Available]; //We just want something the size of the data 
                
                //Sockete.GetStream gives us access to the data buffer(what we refer to in javascript)(Called Net stream in CSharp)
                await socket.GetStream().ReadAsync(data, 0, data.Length); //await also doesn't allow anything else to run after this untill this works

                Console.WriteLine(Encoding.ASCII.GetString(data));//Converts our bytes into a string and prints it out
            }
        }

        //SO WE AREN"T USING THIS THIS IS ACTUALLY DEPRECATED
        /*
        static void HandleConnection(IAsyncResult ar)
        {
            try
            {
                socket.EndConnect(ar);
                Console.WriteLine("You are now connected to the server");
            }
            catch(Exception e)
            {
                Console.WriteLine("ERRR" + e.Message);
            }
            
        }//End of handleConnection */
    }
}
