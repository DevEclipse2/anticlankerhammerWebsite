//base class of chess piece
using System.Collections;
using System.Numerics;
public class chessPiece
{
    public byte[,] positions;
    //position has special meaning
    //up to 256 different i guess
    public Vector2 startPosition = (0,0);
    public int value;
}