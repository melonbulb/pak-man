namespace Backend;

class Program
{
    static void Main(string[] args)
    {
        Map map = GenerateCustomMap1();

        map.PrintMap("graphical");
        map.PrintReport();
        Console.WriteLine("Map Json configuration" + map.Config());
    }

    static Map GenerateCustomMap1()
    {
        Map map = new Map(20, 15);
        map.SetPlayerStart(Position(5, 1));
        map.SetEnemiesStart([Position(14, 1), Position(14, 13)]);


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
