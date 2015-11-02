<?php 
class U
{
    public static function consoleLog($data)
    {
        $json = json_encode($data);
        echo "<script>console.dir($json)</script>";
    }
}
?>