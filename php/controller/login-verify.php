<?php
	require_once(__DIR__ . "/../model/config.php");
	require_once(__DIR__ . "/../controller/login-verify.php");

	function authenticateUser() {
		if (!isset($_SESSION["authenticated"])) {
			return false;
		}
		else {
			if($_SESSION["authenticated"] != true) {
				return false;
			}
			else {
				return true;
			}
		}
	}
?>