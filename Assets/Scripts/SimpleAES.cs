
using System;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using UnityEngine;
public class SimpleAES
{

    char[] base64charArray;

    private string base64Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    public byte[] GetBytes(string str)
    {
        byte[] bytes = new byte[str.Length * sizeof(char)];
        System.Buffer.BlockCopy(str.ToCharArray(), 0, bytes, 0, bytes.Length);
        return bytes;
    }

    public string GetString(byte[] bytes)
    {

        char[] chars = new char[bytes.Length / sizeof(char)];
        System.Buffer.BlockCopy(bytes, 0, chars, 0, bytes.Length);
        return new string(chars);
    }


    public string Encrypt(string prm_text_to_encrypt, string key, string iv)
    {
        string[] keysArray = key.Split(".");

        string encryptionKey = keysArray[0];
        string ceaser = keysArray[1];

        var sToEncrypt = prm_text_to_encrypt;

        var rj = new RijndaelManaged()
        {
            Padding = PaddingMode.PKCS7,
            Mode = CipherMode.CBC,
            KeySize = 256,
            BlockSize = 128,
        };

        byte[] keyBytes = Convert.FromBase64String(encryptionKey);
        byte[] ivBytes = Convert.FromBase64String(iv);

        var encryptor = rj.CreateEncryptor(keyBytes, ivBytes);

        var msEncrypt = new MemoryStream();
        var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write);

        var toEncrypt = Encoding.ASCII.GetBytes(sToEncrypt);

        csEncrypt.Write(toEncrypt, 0, toEncrypt.Length);
        csEncrypt.FlushFinalBlock();

        var encrypted = msEncrypt.ToArray();
        return Scramble(Convert.ToBase64String(encrypted), ceaser);
    }
    int GetBase64Index(char character)
    {
        int i = 0;
        foreach (char aChar in base64charArray)
        {
            if (character == aChar)
            {
                return i;
            }
            i++;
        }

        Debug.Log(character);
        return -1;
    }
    int CeaserTotal(char[] charArray)
    {
        int i = 0;
        foreach (char charac in charArray)
        {
            i += GetBase64Index(charac);
        }
        return i;
    }
    public string Scramble(string data, string ceaserCipher)
    {


        string newString = "";
        // Debug.Log("ceaserCipher " + ceaserCipher);
        char[] ceaserCipherCharArray = ceaserCipher.ToCharArray();
        int i = 0;
        int ceaserTotal = CeaserTotal(ceaserCipherCharArray);
        foreach (char aChar2 in data)
        {
            char aChar = ceaserCipherCharArray[i % ceaserCipherCharArray.Length];
            int index = GetBase64Index(aChar);
            int index2 = GetBase64Index(aChar2);
            int index3 = (index + index2) * (ceaserTotal + i);


            newString += index3 + ",";
            i++;
        }

        string[] newStringAray = newString.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
        uint[] numbers = Array.ConvertAll(newStringAray, uint.Parse);

        // Convert each number into its byte representation
        byte[] bytes = new byte[numbers.Length * sizeof(uint)];
        Buffer.BlockCopy(numbers, 0, bytes, 0, bytes.Length);

        // Convert byte array to Base64 string
        string base64String = Convert.ToBase64String(bytes);
        return base64String;
    }

    public string Unscramble(string scrambled, string ceaserCipher)
    {


        string newString = "";

        char[] ceaserCipherCharArray = ceaserCipher.ToCharArray();
        int ceaserTotal = CeaserTotal(ceaserCipherCharArray);
        int i = 0;
        foreach (string aChar2 in scrambled.Split(","))
        {

            if (aChar2.Length == 0)
            {
                continue;
            }
            int int1 = int.Parse(aChar2) / (ceaserTotal + i);
            char aChar = ceaserCipherCharArray[i % ceaserCipherCharArray.Length];
            int index = GetBase64Index(aChar);


            int index3 = (int1 - index);

            newString += base64charArray[index3];
            i++;
        }
        return newString;
    }

    public string Decrypt(string sEncryptedString, string key, string iv)
    {

        string[] keysArray = key.Split(".");
        string encryptionKey = keysArray[0];


        var rj = new RijndaelManaged()
        {
            Padding = PaddingMode.Zeros,
            Mode = CipherMode.CBC,
            KeySize = 256,
            BlockSize = 128,
        };

        byte[] keyBytes = Convert.FromBase64String(encryptionKey);
        byte[] ivBytes = Convert.FromBase64String(iv);
        var decryptor = rj.CreateDecryptor(keyBytes, ivBytes);

        var msDecrypt = new MemoryStream(Convert.FromBase64String(sEncryptedString));
        var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read);

        string plainText = "";
        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
        {

            plainText = srDecrypt.ReadToEnd();
        }

        return plainText;
    }


    public static void GenerateKeyIV(out string key, out string IV)
    {
        var rj = new RijndaelManaged()
        {
            Padding = PaddingMode.PKCS7,
            Mode = CipherMode.CBC,
            KeySize = 256,
            BlockSize = 256,
            //FeedbackSize = 256
        };
        rj.GenerateKey();
        rj.GenerateIV();

        key = Convert.ToBase64String(rj.Key);
        IV = Convert.ToBase64String(rj.IV);
    }




    private ICryptoTransform EncryptorTransform, DecryptorTransform;
    private System.Text.UTF8Encoding UTFEncoder;

    public SimpleAES()
    {
        //This is our encryption method
        RijndaelManaged rm = new RijndaelManaged();


        //Used to translate bytes to text and vice versa
        UTFEncoder = new System.Text.UTF8Encoding();
        base64charArray = base64Characters.ToCharArray();

        //Debug.Log(ConvertByteArrayToString(GenerateEncryptionKey()));
    }

    /// -------------- Two Utility Methods (not used but may be useful) -----------
    /// Generates an encryption key.
    static public string GenerateEncryptionKey()
    {
        //Generate a Key.
        RijndaelManaged rm = new RijndaelManaged();
        rm.GenerateKey();
        return Convert.ToBase64String(rm.Key);
    }

    static public string GenerateEncryptionKeys()
    {
        //Generate a Key.
        RijndaelManaged rm = new RijndaelManaged();
        rm.GenerateKey();
        string key1 = Convert.ToBase64String(rm.Key);

        rm.GenerateKey();
        string key2 = Convert.ToBase64String(rm.Key);

        return key1 + "." + key2;
    }

    /// Generates a unique encryption vector
    static public string GenerateEncryptionVector()
    {
        //Generate a Vector
        RijndaelManaged rm = new RijndaelManaged();
        rm.GenerateIV();
        return Convert.ToBase64String(rm.IV);
    }

    public string EncryptToString(string TextValue)
    {
        return ByteArrToString(EncryptString(TextValue));
    }

    public string DecryptFromString(string EncryptedString)
    {
        return DecryptFromBytes(StrToByteArray(EncryptedString));
    }




    /// Encrypt some text and return an encrypted byte array.
    public byte[] EncryptString(string TextValue)
    {

        //Translates our text value into a byte array.
        Byte[] bytes = UTFEncoder.GetBytes(TextValue);

        //Used to stream the data in and out of the CryptoStream.
        MemoryStream memoryStream = new MemoryStream();

        #region Write the decrypted value to the encryption stream
        CryptoStream cs = new CryptoStream(memoryStream, EncryptorTransform, CryptoStreamMode.Write);
        cs.Write(bytes, 0, bytes.Length);
        cs.FlushFinalBlock();
        #endregion

        #region Read encrypted value back out of the stream
        memoryStream.Position = 0;
        byte[] encrypted = new byte[memoryStream.Length];
        memoryStream.Read(encrypted, 0, encrypted.Length);
        #endregion

        //Clean up.
        cs.Close();
        memoryStream.Close();

        return encrypted;
    }

    /// The other side: Decryption methods


    /// Decryption when working with byte arrays.    
    public string DecryptFromBytes(byte[] EncryptedValue)
    {
        #region Write the encrypted value to the decryption stream
        MemoryStream encryptedStream = new MemoryStream();
        CryptoStream decryptStream = new CryptoStream(encryptedStream, DecryptorTransform, CryptoStreamMode.Write);
        decryptStream.Write(EncryptedValue, 0, EncryptedValue.Length);
        decryptStream.FlushFinalBlock();
        #endregion

        #region Read the decrypted value from the stream.
        encryptedStream.Position = 0;
        Byte[] decryptedBytes = new Byte[encryptedStream.Length];
        encryptedStream.Read(decryptedBytes, 0, decryptedBytes.Length);
        encryptedStream.Close();
        #endregion
        return UTFEncoder.GetString(decryptedBytes);
    }

    /// Convert a string to a byte array.  NOTE: Normally we'd create a Byte Array from a string using an ASCII encoding (like so).
    //      System.Text.ASCIIEncoding encoding = new System.Text.ASCIIEncoding();
    //      return encoding.GetBytes(str);
    // However, this results in character values that cannot be passed in a URL.  So, instead, I just
    // lay out all of the byte values in a long string of numbers (three per - must pad numbers less than 100).
    public byte[] StrToByteArray(string str)
    {
        if (str.Length == 0)
            throw new Exception("Invalid string value in StrToByteArray");

        byte val;
        byte[] byteArr = new byte[str.Length / 3];
        int i = 0;
        int j = 0;
        do
        {
            val = byte.Parse(str.Substring(i, 3));
            byteArr[j++] = val;
            i += 3;
        }
        while (i < str.Length);
        return byteArr;
    }

    // Same comment as above.  Normally the conversion would use an ASCII encoding in the other direction:
    //      System.Text.ASCIIEncoding enc = new System.Text.ASCIIEncoding();
    //      return enc.GetString(byteArr);    
    public string ByteArrToString(byte[] byteArr)
    {
        byte val;
        string tempStr = "";
        for (int i = 0; i <= byteArr.GetUpperBound(0); i++)
        {
            val = byteArr[i];
            if (val < (byte)10)
                tempStr += "00" + val.ToString();
            else if (val < (byte)100)
                tempStr += "0" + val.ToString();
            else
                tempStr += val.ToString();
        }
        return tempStr;
    }
}