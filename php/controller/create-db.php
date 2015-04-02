<?php
	require_once(__DIR__ . "/../model/config.php");
	require_once(__DIR__ . "/../controller/login-verify.php");

	//* Creates a Table.							
	$query = $_SESSION["connection"]->query("CREATE TABLE posts ("
			 . "id int(11) NOT NULL AUTO_INCREMENT,"  //* ID. 11 values inside the integer. ID can't be null. Auto increments the ID numbers.
			 . "title varchar(255) NOT NULL,"	//* Title. Atleast 255 characters for a title. Title can't be null.
			 . "post text NOT NULL,"		//* Post. Will contain text. Can't be null.		
			 . "DateTime datetime NOT NULL,"			
			 . "PRIMARY KEY (id))");	//* Tells the table that the primary key is id.

	if($query) {
		echo "<p>Successfully created table: posts</p>";	// Informs you that it succesfully created table: posts.
	}

	/*else {
		echo "<p>" . $_SESSION["connection"]->error . "</p>";	// Informs you know that table: posts already exists.
	}*/

	$query = $_SESSION["connection"]->query("CREATE TABLE users ("
			. "id int(11) NOT NULL AUTO_INCREMENT,"
			. "username varchar(30) NOT NULL,"
			. "email varchar(50) NOT NULL," 
			. "password char(128) NOT NULL,"
			. "salt char(128) NOT NULL,"
			. "PRIMARY KEY (id))");

	if($query) {
		echo "<p>Successfully created table: users</p>";
	}
	/*else
		echo "<p>" . $_SESSION["connection"]->error . "</p>";*/
?>