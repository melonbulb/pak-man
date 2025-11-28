namespace Backend;

using Backend.Models;

class Program
{
    static void Main(string[] args)
    {
        Menu();
    }

    static void SubMenu()
    {
        Map map = GenerateCustomMap1();
        if (map != null)
        {
            Console.WriteLine("Map generated successfully.");
            while (true)
            {
                Console.WriteLine("1. View Map (Graphical)");
                Console.WriteLine("2. View Map (Numeric)");
                Console.WriteLine("3. View Map Report");
                Console.WriteLine("4. View Map JSON Configuration");
                Console.WriteLine("5. Update player positions");
                Console.WriteLine("6. Exit to Main Menu");
                Console.WriteLine("Select an option: ");
                int.TryParse(Console.ReadLine(), out int choice);
                switch (choice)
                {
                    case 1:
                        map.PrintMap("graphical");
                        break;
                    case 2:
                        map.PrintMap();
                        break;
                    case 3:
                        map.PrintReport();
                        break;
                    case 4:
                        Console.WriteLine("Map JSON configuration" + map.Config);
                        break;
                    case 5:
                        if (map.Player == null)
                        {
                            Console.WriteLine("No player found on the map.");
                            Console.WriteLine("Adding player");
                            Console.Write("Enter X position for player: ");
                            int.TryParse(Console.ReadLine(), out int x);
                            Console.Write("Enter Y position for player: ");
                            int.TryParse(Console.ReadLine(), out int y);
                            if (map.Graph.ContainsKey(new Map.Position(x, y)))
                            {
                                map.Player = new Player("Player1", "player.png", Position(x, y));
                                Console.WriteLine("Player position updated.");
                                break;
                            }
                            Console.WriteLine("Invalid position for player.");
                        }
                        else
                        {

                            Console.Write("Enter new X position for player: ");
                            int.TryParse(Console.ReadLine(), out int x);
                            Console.Write("Enter new Y position for player: ");
                            int.TryParse(Console.ReadLine(), out int y);
                            if (map.Graph.ContainsKey(new Map.Position(x, y)))
                            {
                                map.Player.Position = Position(x, y);
                                Console.WriteLine("Player position updated.");
                                break;
                            }
                            Console.WriteLine("Invalid position for player.");
                        }
                        break;
                    case 6:
                        return;
                    default:
                        Console.WriteLine("Invalid choice. Please try again.");
                        break;
                }
            }
        }
    }

    static void Menu()
    {
        while (true)
        {
            Console.WriteLine("Map Generator Menu");
            Console.WriteLine("1. Generate Custom Map 1");
            Console.WriteLine("2. Exit");
            Console.Write("Select an option: ");
            int.TryParse(Console.ReadLine(), out int choice);
            switch (choice)
            {
                case 1:
                    SubMenu();
                    break;
                case 2:
                    return;
                default:
                    Console.WriteLine("Invalid choice. Please try again.");
                    break;
            }
        }


    }

    static Map GenerateCustomMap1()
    {
        Map map = new Map(20, 15);
        map.Player = new Player("Player1", "player.png", Position(5, 1));
        map.Enemies = [
            new Enemy("Enemy1", "enemy.png", Position(14, 1)),
            new Enemy("Enemy2", "enemy.png", Position(14, 13))
        ];

        // draw walls
        // draw border walls
        map.SetTile(Position(0, 0), Position(19, 0), "wall");
        map.SetTile(Position(19, 0), Position(19, 14), "wall");
        map.SetTile(Position(19, 14), Position(0, 14), "wall");
        map.SetTile(Position(0, 14), Position(0, 0), "wall");

        // create entrances at the border walls
        map.SetTile(Position(0, 6), Position(2, 6), "wall");
        map.SetTile(Position(0, 7), "food");
        map.SetTile(Position(0, 8), Position(2, 8), "wall");

        map.SetTile(Position(17, 6), Position(19, 6), "wall");
        map.SetTile(Position(19, 7), "food");
        map.SetTile(Position(17, 8), Position(19, 8), "wall");

        // draw first 3 square walls left side
        map.SetTile(Position(2, 2), Position(4, 4), "wall");
        map.SetTile(Position(2, 10), Position(4, 12), "wall");
        map.SetTile(Position(4, 6), Position(6, 8), "wall");

        // draw first 3 square walls right side
        map.SetTile(Position(15, 2), Position(17, 4), "wall");
        map.SetTile(Position(15, 10), Position(17, 12), "wall");
        map.SetTile(Position(13, 6), Position(15, 8), "wall");

        // top center upside down U shape
        map.SetTile(Position(6, 2), Position(6, 4), "wall");
        map.SetTile(Position(6, 2), Position(13, 2), "wall");
        map.SetTile(Position(13, 2), Position(13, 4), "wall");

        // U shape content
        map.SetTile(Position(8, 4), Position(11, 6), "wall");
        map.SetTile(Position(8, 8), Position(11, 8), "wall");

        // left center bottom rectangle
        map.SetTile(Position(6, 10), Position(7, 12), "wall");

        // right center bottom circular shape
        map.SetTile(Position(13, 12), Position(13, 10), "wall");
        map.SetTile(Position(13, 10), Position(9, 10), "wall");
        map.SetTile(Position(9, 10), Position(9, 12), "wall");
        map.SetTile(Position(9, 12), Position(11, 12), "wall");

        // draw power-ups
        map.SetTile(Position(1, 1), "power-up");
        map.SetTile(Position(1, 13), "power-up");
        map.SetTile(Position(18, 1), "power-up");
        map.SetTile(Position(18, 13), "power-up");
        map.SetTile(Position(9, 7), "power-up");
        map.SetTile(Position(10, 9), "power-up");
        map.SetTile(Position(5, 11), "power-up");
        map.SetTile(Position(14, 11), "power-up");
        map.SetTile(Position(14, 3), "power-up");
        return map;
    }

    static Map.Position Position(int x, int y)
    {
        return new Map.Position(x, y);
    }
}
