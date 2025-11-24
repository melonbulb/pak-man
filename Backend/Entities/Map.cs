using System.Text.Json;

class Map
{
    private readonly int columns, rows;
    private int[][] map;
    private Position? playerStart;
    private Position[]? enemyStart;

    private int enemyCount, powerUpCount, foodCount;

    public record Position(int X, int Y);

    public Map(int columns, int rows)
    {
        this.columns = columns;
        this.rows = rows;
        powerUpCount = 0;
        foodCount = 0;
        enemyCount = 0;
        map = new int[rows][];
        for (int y = 0; y < rows; y++)
        {
            map[y] = new int[columns];
            for (int x = 0; x < columns; x++)
            {
                SetTile(new Position(x, y), "food", false);
            }
        }
    }

    public int GetConsumableCount()
    {
        return foodCount + powerUpCount;
    }

    public Position SetPlayerStart(Position pos)
    {
        int x = pos.X;
        int y = pos.Y;

        if (x < 0 || x >= columns || y < 0 || y >= rows)
        {
            throw new ArgumentException("Player start position out of bounds");
        }
        switch (GetTile(pos))
        {
            case 0:
                break;
            case 1:
                throw new ArgumentException("Player start position cannot be a wall");
            case 2:
                SetTile(pos, "empty");
                break;
            case 3:
                SetTile(pos, "empty");
                break;
        }
        playerStart = pos;
        return playerStart;
    }

    public Position? GetPlayerStart()
    {
        return playerStart;
    }

    public int GetEnemyCount()
    {
        return enemyCount;
    }

    public Position[]? GetEnemyStarts()
    {
        return enemyStart;
    }

    public void SetEnemiesStart(Position[] positions)
    {
        enemyStart = positions;
        enemyCount = positions.Length;
    }

    public void SetTile(Position pos, string tile, bool removeFirst = true)
    {
        {
            int x = pos.X;
            int y = pos.Y;
            if (removeFirst)
            {
                RemoveTile(new Position(x, y));
            }
            switch (tile)
            {
                case "empty":
                    PrintMessage("Setting empty tile at position (" + x + ", " + y + ")", "info");
                    map[y][x] = 0;
                    break;
                case "wall":
                    PrintMessage("Setting wall at position (" + x + ", " + y + ")", "info");
                    map[y][x] = 1;
                    break;
                case "food":
                    PrintMessage("Setting food at position (" + x + ", " + y + ")", "info");
                    map[y][x] = 2;
                    foodCount++;
                    break;
                case "power-up":
                    PrintMessage("Setting power-up at position (" + x + ", " + y + ")", "info");
                    map[y][x] = 3;
                    powerUpCount++;
                    break;
                default:
                    throw new ArgumentException("Invalid tile type");
            }
        }
    }


    public void SetTile(Position pos1, Position pos2, string tile)
    {

        int x1 = Math.Min(pos1.X, pos2.X);
        int y1 = Math.Min(pos1.Y, pos2.Y);
        int x2 = Math.Max(pos1.X, pos2.X);
        int y2 = Math.Max(pos1.Y, pos2.Y);
        for (int x = x1; x <= x2; x++)
        {
            for (int y = y1; y <= y2; y++)
            {
                SetTile(new Position(x, y), tile);
            }
        }
    }

    public void RemoveTile(Position pos)
    {
        int x = pos.X;
        int y = pos.Y;
        int tile = map[y][x];
        switch (tile)
        {
            case 0:
                break;
            case 1:
                PrintMessage("Removing wall at position (" + x + ", " + y + ")", "info");
                break;
            case 2:
                PrintMessage("Removing food at position (" + x + ", " + y + ")", "info");
                foodCount--;
                break;
            case 3:
                PrintMessage("Removing power-up at position (" + x + ", " + y + ")", "info");
                powerUpCount--;
                break;
            default:
                throw new ArgumentException("Invalid tile type");
        }
        map[y][x] = 0;
    }

    public int GetTile(Position pos)
    {
        int x = pos.X;
        int y = pos.Y;
        return map[y][x];
    }

    public int[][] GetMap()
    {
        return map;
    }

    public string Config()
    {
        var data = new
        {
            columns,
            rows,
            playerStart,
            enemyStart,
            enemyCount,
            powerUpCount,
            foodCount,
            map
        };

        return JsonSerializer.Serialize(data);
    }

    public void PrintReport()
    {
        Console.WriteLine("Map Report:");
        Console.WriteLine($"Dimensions: {columns} columns x {rows} rows");
        Console.WriteLine($"Total Tiles: {columns * rows}");
        Console.WriteLine($"Food Count: {foodCount}");
        Console.WriteLine($"Power-Up Count: {powerUpCount}");
        Console.WriteLine($"Enemy Count: {enemyCount}");
        if (playerStart != null)
        {
            Console.WriteLine($"Player Start Position: ({playerStart.X}, {playerStart.Y})");
        }
        else
        {
            Console.WriteLine("Player Start Position: Not Set");
        }
        if (enemyStart != null)
        {
            for (int i = 0; i < enemyStart.Length; i++)
            {
                Console.WriteLine($"Enemy {i + 1} Start Position: ({enemyStart[i].X}, {enemyStart[i].Y})");
            }
        }
        else
        {
            Console.WriteLine("Enemy Start Positions: Not Set");
        }
    }

    public void PrintMap(string type = "default")
    {
        Console.Write($"{" ",3}");
        for (int x = 0; x < columns; x++)
        {
            Console.Write($"{x,3}");
        }
        Console.WriteLine();
        for (int y = 0; y < rows; y++)
        {
            Console.Write($"{y,3}");
            for (int x = 0; x < columns; x++)
            {
                if (type == "graphical")
                {
                    switch (map[y][x])
                    {
                        case 0:
                            Console.Write($"{" ",3}");
                            break;
                        case 1:
                            Console.Write($"{"🧱",3}");
                            break;
                        case 2:
                            Console.Write($"{"🍇",3}");
                            break;
                        case 3:
                            Console.Write($"{"💪",3}");
                            break;
                    }
                }
                else
                {
                    Console.Write($"{map[y][x],3}");
                }
            }
            Console.WriteLine();
        }
    }
    private static void PrintMessage(string message, string type = "info")
    {
        switch (type)
        {
            case "info":
                Console.ForegroundColor = ConsoleColor.White;
                break;
            case "warning":
                Console.ForegroundColor = ConsoleColor.Yellow;
                break;
            case "error":
                Console.ForegroundColor = ConsoleColor.Red;
                break;
            default:
                Console.ResetColor();
                break;
        }
        Console.WriteLine("Map: " + message);
        Console.ResetColor();
    }
}