class Sprite
{
    private string name;
    private string imagePath;
    private Point spawnPoint;

    public Sprite(string name, string imagePath, Point spawnPoint)
    {
        this.name = name;
        this.imagePath = imagePath;
        this.spawnPoint = spawnPoint;
    }

    public struct Point(int x, int y)
    {
        public int X = x;
        public int Y = y;
    }
}