<?php
	require_once(__DIR__ . "/Database.php");
	session_start();
	session_regenerate_id(true);

	$path = "/Awesomenauts/php/"; //* Sets a path to the Blog Folder 

	$host = "localhost";
	$username = "root";
	$password = "root";
	$database = "awesomenauts_db";

	if(!isset($_SESSION["connection"])) {
		$connection = new Database($host, $username, $password, $database);
		$_SESSION["connection"] = $connection;
	}

?>