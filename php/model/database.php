<?php
	//* Classes are used to be called in an instance of an object. 
	class Database {
		//*Global variables
		private $connection;
		private $host;
		private $username;
		private $password;
		private $database;
		public $error;

		//* function __construct is used to define a constructor
		public function __construct($host, $username, $password, $database) { //*Local variables 
			$this->host = $host; 
			$this->username = $username;
			$this->password = $password;
			$this->database = $database;

			$this->connection = new mysqli($this->host, $this->username, $this->password);

		//*  Checks for an error. If the connection fails it is told to DIE.
		if ($this->connection->connect_error) {
			die("<p>Error: " . $this->connection->connect_error . "</p>");
		}

		$exists = $this->connection->select_db($database);
			//* If connection exists it'll run query.
			if (!$exists) {
				//* Query asks if there is a connection to the database. If not it'll create a database.
				$query = $this->connection->query("CREATE DATABASE $database");

			if ($query) {
				//* Echoes text if a database is created.
				echo "<p>Successfully created database: " . $database . "</p>";
			}
		}

			/*else {
				//* Echoes text if database already exists.
				echo "<p>Database already exists</p>";
			}*/			
		}

		public function openConnection() {
			$this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);

			if ($this->connection->connect_error) {
			//* Checks if we established a connection or not	
				die("<p>Error: " . $this->connection->connect_error . "</p>");
			}			
		}

		public function closeConnection() {
			if (isset($this->connection)) {
			//* isset is used to check if the variable has been set	
				$this->connection->close();
			}
		}

		public function query($string) {
			$this->openConnection();

			$query = $this->connection->query($string);

			if(!$query) {
				$this->error = $this->connection->error;	
			}

			$this->closeConnection();

			return $query;
		}

	}

?>